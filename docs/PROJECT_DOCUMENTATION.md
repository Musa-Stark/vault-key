# Vault Key - Project Documentation

## 1. Overview
Vault Key is a client-side password vault UI built with Next.js App Router and React.

Important: this is currently a front-end prototype, not a real secure vault.
- Authentication is simulated in memory.
- Password data is seeded from local dummy data.
- No backend, database, or encryption is implemented.

Primary user flow:
1. User lands on `/`.
2. App shows Login/Register state.
3. After login, vault is in a locked state.
4. User unlocks into the dashboard.
5. User can browse, search, add, edit, delete, and generate passwords.

## 2. Tech Stack
- Framework: Next.js (`app/` router)
- UI library: React 18
- Styling: Tailwind CSS + custom utility classes in global CSS
- Icons: `lucide-react`
- UI primitives: shadcn/Radix files under `src/components/ui`
- State management: React hooks + React Context
- Testing: Vitest + Testing Library setup

## 3. Directory Structure

```text
app/
  layout.jsx           # root HTML shell + global CSS import
  page.jsx             # main app entry (client component)
  not-found.jsx        # 404 page
  globals.css          # global Tailwind + custom design system classes

src/
  pages/
    Index.jsx          # app flow switch (login/register/locked/dashboard)
    LoginPage.jsx      # login form UI
    RegisterPage.jsx   # register form UI
    UnlockPage.jsx     # unlock form UI
    DashboardPage.jsx  # main vault workspace

  contexts/
    AuthContext.jsx    # auth state machine + auto-lock behavior
    ToastContext.jsx   # custom toast notifications

  components/
    Sidebar.jsx        # left navigation + categories + mobile drawer
    Navbar.jsx         # search/add/lock/profile menu
    PasswordCard.jsx   # per-password card actions
    Modal.jsx          # add/edit password form dialog
    Generator.jsx      # random password generator
    ui/                # shadcn/Radix reusable primitives

  data/
    passwords.js       # seed data + categories + service icon mapping

  hooks/
    use-mobile.jsx     # viewport breakpoint helper
    use-toast.js       # shadcn toast state hook (separate from ToastContext)

  lib/
    utils.js           # className merge helper (`cn`)

  test/
    setup.js
    example.test.js
```

## 4. Runtime Architecture

### 4.1 App Router entry
`app/page.jsx` is the runtime root for the UI and is marked `"use client"`.

It composes providers/components in this order:
1. `QueryClientProvider` (react-query)
2. `TooltipProvider` (shadcn)
3. `Toaster` and `Sonner` (shadcn toasts)
4. `Index` (actual app flow)

### 4.2 App flow controller
`src/pages/Index.jsx` chooses which screen to show based on auth state.

It wraps children with:
- `AuthProvider`
- `ToastProvider` (custom toasts)

`AppContent` logic:
- `authState === "login"`: show `LoginPage` or `RegisterPage`
- `authState === "locked"`: show `UnlockPage`
- `authState === "authenticated"`: show `DashboardPage`

## 5. State Management

### 5.1 Auth state machine (`AuthContext`)
`src/contexts/AuthContext.jsx` stores `authState` with three values:
- `"login"`
- `"locked"`
- `"authenticated"`

Actions:
- `login()` -> sets `locked`
- `logout()` -> sets `login`
- `unlock()` -> sets `authenticated`
- `lock()` -> sets `locked`

Auto-lock:
- Runs only when authenticated.
- Listens to activity events (`mousedown`, `keydown`, `scroll`, `touchstart`).
- Resets a 5-minute timer on activity.
- When timer expires, forces `locked`.

### 5.2 Vault data state (`DashboardPage`)
`src/pages/DashboardPage.jsx` owns main working state:
- `passwords` (array, initialized from `dummyPasswords`)
- `activeView` (`passwords`, `generator`, `settings`)
- `activeCategory`
- `searchQuery`
- modal state (`modalOpen`, `editData`)

Computed view model:
- `filtered` is memoized using category + search query.

Mutations:
- `handleSave(entry)` upserts item by `id`
- `handleEdit(id)` opens modal with selected item
- `handleDelete(id)` removes item

### 5.3 Toast state
There are two toast systems present:
1. `src/contexts/ToastContext.jsx` (actively used by app features)
2. shadcn toast stack (`src/hooks/use-toast.js`, `src/components/ui/toaster.jsx`, `app/page.jsx` render)

Current feature components (`PasswordCard`, `Generator`, `DashboardPage`) use `ToastContext` via `useToast()` from `@/contexts/ToastContext`.

## 6. UI Behavior by Feature

### 6.1 Authentication screens
- `LoginPage.jsx`: email/password form, submit triggers `onLogin()`.
- `RegisterPage.jsx`: name/email/password form, submit triggers `onRegister()`.
- `UnlockPage.jsx`: master password input, submit triggers `onUnlock()`.

These forms currently do not validate against backend credentials; they only drive local state transitions.

### 6.2 Dashboard
Composed of:
- `Sidebar`: navigation between passwords/generator/settings, plus category filters for password view.
- `Navbar`: search input, Add button, Lock button, profile dropdown with Sign out.
- `PasswordCard`: shows each password row/card with reveal/copy/edit/delete actions.
- `Modal`: add/edit form.
- `Generator`: random password generation utility.

### 6.3 Password card interactions
In `PasswordCard.jsx`:
- Toggle visible/hidden password text.
- Copy to clipboard with `navigator.clipboard.writeText`.
- Edit and delete callbacks bubble to dashboard handlers.

### 6.4 Add/Edit modal
In `Modal.jsx`:
- Opens via dashboard state.
- Pre-fills form when editing.
- New entries get `id = Date.now().toString()`.
- Category options come from `data/passwords.js` excluding `All`.

### 6.5 Password generator
In `Generator.jsx`:
- Character pools controlled by toggles: uppercase/lowercase/numbers/symbols.
- Length range: 8..64.
- If all toggles are disabled, fallback pool is lowercase alphabet.
- Generated text is copyable.

## 7. Data Layer
`src/data/passwords.js` contains:
- `dummyPasswords`: initial in-memory records used by dashboard
- `categories`: category list for filters/selects
- `serviceIcons`: fallback emoji mapping by service name

No persistence is implemented:
- reload clears edits/additions/deletions back to seed state.

## 8. Styling System

### 8.1 Tailwind config
`tailwind.config.js` defines:
- content scan for `app/**/*.{js,jsx}` and `src/**/*.{js,jsx}`
- custom semantic color tokens mapping to CSS variables
- radius scale + simple accordion animations

### 8.2 Global CSS design tokens
`app/globals.css` (same content as `src/index.css`) defines:
- color, spacing, shadows, gradients via CSS variables
- reusable classes: `vault-card`, `vault-input`, `vault-btn-*`, `vault-sidebar-item`, `vault-toast`, etc.

Note: both `app/globals.css` and `src/index.css` currently exist with duplicated content. Runtime uses `app/globals.css`.

## 9. shadcn UI Layer
`src/components/ui` includes many generated reusable primitives (accordion, dialog, drawer, table, etc.).

In current product flow:
- directly used in `app/page.jsx`: tooltip/toaster/sonner providers
- many other ui primitives are available but not used by current custom pages/components

This is typical for scaffolds where component library breadth exceeds immediate usage.

## 10. Configuration Files

### 10.1 Next
- `next.config.js`: minimal config object
- `app/layout.jsx`: document shell + metadata
- `app/not-found.jsx`: route-level 404

### 10.2 Path alias
- `jsconfig.json` maps `@/*` -> `src/*`

### 10.3 CSS/PostCSS
- `tailwind.config.js`
- `postcss.config.js` with `tailwindcss` + `autoprefixer`

### 10.4 Lint/Test
- `eslint.config.js`: JS/JSX lint setup
- `vitest.config.js`: jsdom test environment and alias resolution
- `src/test/setup.js`: testing polyfills (`matchMedia`, jest-dom)

## 11. Request/Render Lifecycle Walkthrough
For route `/`:
1. Next renders `app/layout.jsx` and includes `app/globals.css`.
2. Next renders `app/page.jsx` (client component).
3. Providers mount (`QueryClient`, tooltip, toasters).
4. `Index` mounts and creates auth + custom toast contexts.
5. `AuthContext` starts in `login` state.
6. User action transitions state (`login` -> `locked` -> `authenticated`).
7. Dashboard manages all vault interactions in local component state.

## 12. Security Reality Check
Despite vault-like UI, current behavior is not secure storage.

Gaps:
- no encryption
- no hashed credentials
- no persistence backend
- mock data includes plain-text passwords
- lock/unlock is only UI state

Treat this as a UX prototype or front-end shell.

## 13. Known Inconsistencies / Technical Debt
- README still describes old Vite + TypeScript setup.
- `package.json` still includes some Vite-era dev dependencies not required for pure Next runtime.
- Duplicate global styles (`app/globals.css` and `src/index.css`).
- Two toast systems coexist (custom context + shadcn store).
- `src/App.css` appears legacy and unused by current app router entry.

## 14. How to Extend This Project (Suggested Path)
1. Add persistent storage (API + database).
2. Encrypt secrets client-side or server-side using a clear threat model.
3. Replace dummy auth with real credential flow.
4. Persist vault entries per authenticated user.
5. Consolidate to one toast system.
6. Remove legacy dependencies/files after migration cleanup.
7. Add tests for auth transitions and dashboard CRUD behavior.

## 15. Quick File Guide for Study Order
Recommended reading sequence:
1. `app/page.jsx`
2. `src/pages/Index.jsx`
3. `src/contexts/AuthContext.jsx`
4. `src/pages/DashboardPage.jsx`
5. `src/components/{Sidebar,Navbar,PasswordCard,Modal,Generator}.jsx`
6. `src/contexts/ToastContext.jsx`
7. `src/data/passwords.js`
8. `app/globals.css` + `tailwind.config.js`

This order maps from entrypoint -> state orchestration -> feature logic -> data/styling.
