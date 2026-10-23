# Architecture Overview

This document describes the overall system architecture of DriveFleet, the relationship between its components, and the key technology decisions that shape the implementation.

---

## High-Level Architecture

DriveFleet is a **monorepo containing two independent services**: a Next.js frontend and an Express.js backend. Both services are separate Node.js applications that run independently and communicate over HTTP.

```
┌─────────────────────────────────────────────────────────┐
│                       Browser                           │
│                                                         │
│   ┌──────────────────────────────────────────────────┐  │
│   │            Next.js Frontend (Drive-Fleet)        │  │
│   │                                                  │  │
│   │  ┌───────────┐   ┌──────────────────────────┐    │  │
│   │  │  App      │   │  Better Auth             │    │  │
│   │  │  Router   │   │  (auth.js / auth-client) │    │  │
│   │  │  Pages    │   │  JWT Plugin + Google     │    │  │
│   │  └─────┬─────┘   └──────────────┬───────────┘    │  │
│   │        │                        │                │  │
│   └────────┼────────────────────────┼────────────────┘  │
│            │                        │                   │
└────────────┼────────────────────────┼───────────────────┘
             │ REST API Calls         │ Auth API Calls
             │ (Bearer JWT)           │ (Cookie/Session)
             ▼                        ▼
┌──────────────────────┐   ┌─────────────────────────────┐
│  Express Backend     │   │  Better Auth (Next.js)      │
│  (server-a9)         │   │  /api/auth/[...all]         │
│                      │   │                             │
│  • carsRoutes        │   │  • /api/auth/jwks  (JWKS)   │
│  • bookingsRoutes    │   │  • /api/auth/sign-in        │
│  • authMiddleware    │   │  • /api/auth/sign-up        │
│  • db.js (MongoDB)   │   │  • /api/auth/sign-out       │
└──────────┬───────────┘   └──────────────┬──────────────┘
           │                              │
           ▼                              ▼
┌─────────────────────────────────────────────────────────┐
│                   MongoDB Atlas                         │
│                                                         │
│   ┌───────────────────┐   ┌────────────────────────┐    │
│   │  drive-fleet      │   │  drive-fleet-auth      │    │
│   │  • all-cars       │   │  • user                │    │
│   │  • drive-fleet-   │   │  • session             │    │
│   │    bookings       │   │  • account             │    │
│   └───────────────────┘   └────────────────────────┘    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 External Services                       │
│   ImgBB Image Hosting API (car/profile image upload)    │
│   Google OAuth 2.0 (social sign-in)                     │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend: Next.js Application

**Location:** `Drive-Fleet/`

The frontend uses the **Next.js App Router**, which enables a mixed rendering model:

- **Server Components (RSC)** are used for data-fetching pages (`explore-cars`, `my-added-cars`, `my-bookings`, `car detail`). These pages call the backend REST API or read the auth session directly on the server before rendering HTML.
- **Client Components** (`"use client"`) are used wherever interactivity, browser state, or session data is needed client-side: the `Navbar`, `Footer`, `SearchFilter`, `BookNowButton`, `DeleteAddedCar`, `UpdateAddedCar`, the `AddCarPage`, the `LoginPage`, and the `RegistrationPage`.

### Route Groups

Next.js route groups are used to organise pages without affecting URL paths:

| Group | Purpose |
|---|---|
| `(pages)` | Main feature pages (`/explore-cars`, `/add-car`, `/my-added-cars`, `/my-bookings`) |
| `(safety)` | Auth pages that should not inherit the protected middleware (`/login`, `/registration`) |

### Route Protection (Middleware)

`src/proxy.js` implements a Next.js Middleware that runs on the server for the following routes:

```
/my-bookings
/my-added-cars
/add-car
```

If the user has no active Better Auth session, the middleware redirects to `/login`. This provides server-side route protection independent of client-side session state.

> **Note:** The file is named `proxy.js` but functions as a standard Next.js middleware. It must be placed or imported from the correct middleware path to be applied by Next.js.

---

## Backend: Express.js Server

**Location:** `server-a9/`

The backend is a minimal, focused REST API server:

- **Express.js v5** handles routing and request parsing.
- **CORS** is enabled globally (no origin restriction currently set), allowing the frontend to make cross-origin requests.
- All routes are defined in two route files (`carsRoutes.js`, `bookingsRoutes.js`) and mounted at the root path `/`.
- Business logic is separated into two controller files.
- Database access is centralised in `src/config/db.js`, which exports pre-instantiated collection references.

---

## Authentication Architecture

Authentication is handled entirely by **Better Auth**, which runs as part of the Next.js application via an API catch-all route at `/api/auth/[...all]`.

| Concern | Implementation |
|---|---|
| Auth library | Better Auth v1 |
| Session strategy | JWT (configured in `lib/auth.js`) |
| Auth database | MongoDB (`drive-fleet-auth` database), managed by Better Auth's MongoDB adapter |
| Session lifetime | 5 days (cookie-cached) |
| Social provider | Google OAuth 2.0 |
| JWT issuance | Better Auth `jwt` plugin — issues access tokens retrievable via `authClient.token()` |
| JWKS endpoint | `/api/auth/jwks` — the backend fetches public keys from this URL to verify JWTs |

When the frontend needs to make a **protected backend request** (e.g. adding a car or fetching user-specific data), it:
1. Calls `authClient.token()` to retrieve the current JWT access token.
2. Attaches it as `Authorization: Bearer <token>` on the outgoing `fetch` request.

The backend's `authMiddleware` (`src/middleware/auth.js`) verifies this token using `jose-cjs` and the remote JWKS endpoint served by the frontend's Better Auth instance.

---

## Image Hosting

Both car images (on listing and update) and user profile photos (on registration) are uploaded directly from the browser to the **ImgBB API** before the form is submitted. The returned hosted image URL is then stored in MongoDB.

- Maximum image size: 5 MB.
- Accepted formats: PNG, JPG, WEBP.
- The ImgBB API key is exposed as a `NEXT_PUBLIC_*` environment variable, meaning it is visible to the browser.

---

## Data Flow: End-to-End Booking

```
User (Browser)
    │
    ├─ Visits /explore-cars/:id  ──► Next.js Server Component
    │                                 │
    │                                 └─ GET /all-cars/:id ──► Express ──► MongoDB
    │                                     (car data returned, page rendered)
    │
    ├─ Clicks "Book Now"   ──► Opens HeroUI Modal (Client Component)
    │
    ├─ Fills form (driver choice, note) ──► onSubmit handler
    │
    │   authClient.useSession() ──► reads current session (client-side)
    │
    ├─ POST /all-bookings  ──► Express (no auth middleware on this route)
    │       body: { CarName, TotalPrice, BookingDate, CarId, userId,
    │               DriverNeeded, SpecialNote }
    │
    └─ Express ──► bookingsController.addBooking()
                   │
                   ├─ INSERT into drive-fleet-bookings
                   └─ UPDATE all-cars ($inc BookBy +1 on the booked car)
```

---

## Technology Stack Summary

### Frontend

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Runtime | React 19 |
| Styling | Tailwind CSS v4 + DaisyUI v5 |
| UI Components | HeroUI v3 (`@heroui/react`) |
| Icons | React Icons v5, Gravity UI Icons |
| Auth Client | Better Auth v1 (`better-auth/react`) |
| Notifications | React Hot Toast |
| Marquee Animation | React Fast Marquee |
| Fonts | Geist Sans, Geist Mono (Google Fonts via `next/font`) |

### Backend

| Layer | Technology |
|---|---|
| Runtime | Node.js (CommonJS modules) |
| Framework | Express.js v5 |
| Database Driver | `mongodb` Node.js driver v7 |
| JWT Verification | `jose-cjs` (JWKS-based remote verification) |
| CORS | `cors` package |
| Config | `dotenv` |
