# Vault Key - Full Stack Documentation

## 1) Project Overview
Vault Key is a Next.js App Router project containing:
- Frontend UI (vault screens/components)
- Backend API (Route Handlers under `app/api/v1/*`)
- Shared runtime in one app process (`npm run dev`)

Current local base URL:
- `http://localhost:3000`

## 2) Tech Stack
- Framework: Next.js (App Router)
- UI: React 18
- Styling: Tailwind CSS + custom CSS utilities
- Backend API: Next Route Handlers
- Database: MongoDB via Mongoose
- Auth token: JWT (`jsonwebtoken`)
- Auth password hashing: `bcryptjs`
- Validation: Zod
- Testing: Vitest (frontend-oriented setup)

## 3) High-Level Architecture

## 3.1 Frontend layer
- Main UI rendered by `app/page.jsx` (`"use client"`).
- UI flow orchestration in `src/pages/Index.jsx`.
- Uses local React contexts for auth screen state and custom toasts.

## 3.2 Backend layer
- API endpoints implemented in `app/api/v1/**/route.js`.
- Server/domain logic in `src/server/**`.
- Mongo connection handled by shared cached connection helper.

## 3.3 Deployment/runtime model
- Single Next.js app server.
- No separate Express service required.
- Frontend and backend share the same host/port.

## 4) Directory Map (Important Parts)

```text
app/
  layout.jsx
  page.jsx
  not-found.jsx
  globals.css
  api/
    v1/
      health/route.js
      auth/
        register/route.js
        login/route.js
      vault/route.js

src/
  components/
  contexts/
  data/
  hooks/
  lib/
  pages/

  server/
    common/
      AppError.js
      auth.js
      http.js
    config/
      db.js
      env.js
    modules/
      auth/
        auth.model.js
        auth.repository.js
        auth.service.js
        auth.validation.js
      vault/
        vault.model.js
        vault.repository.js
        vault.service.js
        vault.validation.js

docs/
  PROJECT_DOCUMENTATION.md
  FULLSTACK_DOCUMENTATION.md

backend/docs/
  ARCHITECTURE.md
  BACKEND_DOCUMENTATION.md
```

## 5) Frontend Detailed Flow

## 5.1 Entry and providers
`app/page.jsx` composes:
1. `QueryClientProvider`
2. `TooltipProvider`
3. shadcn toasters
4. `Index` page flow component

## 5.2 Screen state machine
`src/pages/Index.jsx` + `src/contexts/AuthContext.jsx` controls UI states:
- `login`
- `locked`
- `authenticated`

Transitions:
- login form submit -> `locked`
- unlock submit -> `authenticated`
- lock/signout -> `locked` or `login`

Auto-lock:
- 5-minute inactivity timer in `AuthContext`.

## 5.3 Main dashboard behavior
`src/pages/DashboardPage.jsx` manages:
- local password entries list
- search and category filtering
- view switching (`passwords`, `generator`, `settings`)
- modal open/edit state

Feature components:
- `Sidebar.jsx`
- `Navbar.jsx`
- `PasswordCard.jsx`
- `Modal.jsx`
- `Generator.jsx`

## 5.4 Current frontend/backend integration status
Important: frontend vault/auth screens are still mostly local-state driven.
- UI currently does not fully call all backend endpoints by default.
- API layer is available and ready at `/api/v1/*`.

## 6) Backend Detailed Architecture

## 6.1 Route Handlers (HTTP layer)
- `app/api/v1/health/route.js`
- `app/api/v1/auth/register/route.js`
- `app/api/v1/auth/login/route.js`
- `app/api/v1/vault/route.js` (`GET`, `POST`)

Responsibilities:
- Parse request
- Validate input
- Connect DB
- Call service
- Return standardized envelope

## 6.2 Common server utilities
- `src/server/common/http.js`
  - `ok()` success response helper
  - `fail()` error response helper
  - `routeHandler()` centralized error mapping
  - `readJson()` JSON parsing with `BAD_REQUEST`
- `src/server/common/auth.js`
  - `issueAccessToken()`
  - `requireAuth()` bearer token verification
- `src/server/common/AppError.js`
  - typed operational errors with `statusCode` + `code`

## 6.3 Config
- `src/server/config/env.js`
  - reads required env variables
  - throws `ENV_MISSING` when required values are absent
- `src/server/config/db.js`
  - establishes and caches Mongoose connection across requests

## 6.4 Domain modules

Auth module (`src/server/modules/auth/*`):
- model: `User { email, name, passwordHash, timestamps }`
- service: register/login logic
- validation: zod schemas
- repository: DB methods

Vault module (`src/server/modules/vault/*`):
- model: `VaultEntry { ownerId, service, username, password, category, icon, url, raw, timestamps }`
- service: create/list + response mapping
- validation: zod schema with `.passthrough()`
- repository: DB methods

## 7) API Blueprint

Base:
- `http://localhost:3000/api/v1`

## 7.1 Success envelope
```json
{
  "success": true,
  "data": {}
}
```

## 7.2 Error envelope
```json
{
  "success": false,
  "error": {
    "code": "SOME_CODE",
    "message": "Readable message"
  }
}
```

## 7.3 Endpoints
- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /vault` (Bearer token required)
- `POST /vault` (Bearer token required)

## 8) Error Codes (Canonical)
- `BAD_REQUEST`
- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `INTERNAL_ERROR`
- `ENV_MISSING`
- `EMAIL_ALREADY_USED`
- `INVALID_CREDENTIALS`

## 9) Security and Data Handling
- Login/register password is hashed using bcrypt (`passwordHash` in DB).
- Vault entry `password` is stored exactly as provided by frontend.
- Extra vault payload fields are stored under `raw`.
- JWT auth is stateless; refresh/revocation is not implemented yet.

## 10) Environment Configuration
Use root `.env.local` (or `.env`) for Next runtime.

Required:
- `MONGODB_URI`
- `JWT_ACCESS_SECRET`

Optional:
- `JWT_ACCESS_TTL` (default `15m`)

Reference template: `.env.example`

## 11) Run & Verify
1. Install deps: `npm install`
2. Ensure MongoDB is running.
3. Set root env values.
4. Start app: `npm run dev`
5. Verify API: `http://localhost:3000/api/v1/health`

Expected health response:
```json
{ "success": true, "data": { "status": "ok" } }
```

## 12) Known Gaps / Technical Debt
- Some docs still reference old split-backend/Express architecture.
- Frontend core user flow still local-state-first; API integration not fully wired.
- Duplicate style sources (`app/globals.css` and `src/index.css`).
- Project contains legacy dependencies from earlier setup.

## 13) Recommended Study Order
1. `app/page.jsx`
2. `src/pages/Index.jsx`
3. `src/contexts/AuthContext.jsx`
4. `src/pages/DashboardPage.jsx`
5. `app/api/v1/**/route.js`
6. `src/server/common/*`
7. `src/server/modules/auth/*`
8. `src/server/modules/vault/*`
9. `src/server/config/{env,db}.js`
10. `app/globals.css` + `tailwind.config.js`

This sequence gives UI flow first, then backend request lifecycle, then persistence/auth internals.
