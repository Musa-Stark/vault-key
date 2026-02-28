# Vault Key (Client)

A modern client-side password vault frontend built with Next.js App Router, React, and Tailwind CSS.

This repository contains the UI application only. Backend/server logic is intentionally handled in a separate project.

## Overview

Vault Key provides a complete frontend flow for:
- Account registration and login screens
- Vault lock/unlock flow
- Password dashboard with search and category filters
- Add, edit, and delete password entries
- Built-in password generator
- Toast notifications and responsive layout

The app communicates with an external API using `NEXT_PUBLIC_API_URL`.

## Tech Stack

- `Next.js` (App Router)
- `React 18`
- `Tailwind CSS`
- `@tanstack/react-query`
- `lucide-react`
- Shadcn/Radix UI primitives
- `Vitest` + Testing Library

## Project Structure

```text
app/
  layout.jsx
  page.jsx
  globals.css
  not-found.jsx

src/
  components/        # UI building blocks (navbar, sidebar, cards, modal, generator)
  contexts/          # Auth and toast state providers
  data/              # Static UI data (categories, fallback icons)
  hooks/             # Shared hooks
  lib/               # API request helper and utilities
  pages/             # Screen-level UI (login/register/unlock/dashboard)
  test/              # Vitest setup and sample tests
```

## Prerequisites

- `Node.js 18+` (recommended: latest LTS)
- `npm` (or compatible package manager)
- Running backend API from your separate server project

## Environment Variables

Create a local env file:

```bash
cp .env.example .env.local
```

Required for this client:

- `NEXT_PUBLIC_API_URL`  
  Example: `http://localhost:4000/api/v1`

Note: Other values in `.env.example` may belong to server concerns and are not required by this client runtime.

## Getting Started

```bash
npm install
npm run dev
```

App will run at `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run lint checks
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## Backend API Contract Used by This Client

Base URL: `NEXT_PUBLIC_API_URL`

The frontend currently calls:
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/token`
- `POST /auth/unlock`
- `GET /password`
- `POST /password`
- `PATCH /password`
- `DELETE /password`

If your server differs, update frontend API calls in:
- `src/lib/apiRequest.js`
- Screen/components under `src/pages` and `src/components`

## Current Scope and Notes

- This project is focused on frontend UX and integration points.
- Secure password storage, encryption strategy, and persistence are backend responsibilities in your separate server project.
- Keep API URL and auth/token behavior aligned between both repos.

## Documentation

- Frontend project notes: [`docs/PROJECT_DOCUMENTATION.md`](docs/PROJECT_DOCUMENTATION.md)
