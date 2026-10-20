# DriveFleet Documentation

**DriveFleet** is a full-stack car rental web platform. Users can browse available vehicles, book cars, list their own vehicles for rent, and manage their listings and bookings through a modern, responsive interface.

---

## Documentation Index

| Document                                    | Description                                                                          |
| ------------------------------------------- | ------------------------------------------------------------------------------------ |
| [Architecture](./architecture.md)           | System architecture, technology decisions, and component relationships               |
| [Frontend](./frontend.md)                   | Next.js application: pages, routing, components, and UI patterns                     |
| [Backend](./backend.md)                     | Express.js server: structure, middleware, routes, and controllers                    |
| [API Reference](./api-reference.md)         | Complete REST API endpoint catalogue with request/response detail                    |
| [Authentication](./authentication.md)       | Auth system: Better Auth configuration, JWT flow, Google OAuth, and route protection |
| [Data Models](./data-models.md)             | MongoDB collection schemas and field descriptions                                    |
| [Environment Setup](./environment-setup.md) | Environment variables, local development setup, and configuration guide              |

---

## Project Summary

| Property             | Value                                                                            |
| -------------------- | -------------------------------------------------------------------------------- |
| **Application Name** | DriveFleet                                                                       |
| **Type**             | Car Rental Platform                                                              |
| **Frontend**         | Next.js 16 (React 19), Tailwind CSS v4, DaisyUI v5, HeroUI v3                    |
| **Backend**          | Node.js with Express.js v5                                                       |
| **Database**         | MongoDB (two databases: `drive-fleet` for app data, `drive-fleet-auth` for auth) |
| **Authentication**   | Better Auth v1 — email/password + Google OAuth, JWT strategy                     |
| **Image Hosting**    | ImgBB API (external, for car and profile images)                                 |

---

## Repository Layout

```
a9/
├── Drive-Fleet/          # Frontend (Next.js)
│   ├── src/
│   │   ├── app/          # Next.js App Router pages and API routes
│   │   ├── Components/   # Reusable React components
│   │   ├── Sections/     # Page-level layout sections (Navbar, Footer, etc.)
│   │   ├── lib/          # Auth configuration (server and client)
│   │   └── proxy.js      # Next.js middleware for route protection
│   ├── public/           # Static assets (logo, brand images)
│   └── documentation/    # This documentation directory
│
└── server-a9/            # Backend (Express.js)
    ├── index.js          # Server entry point
    └── src/
        ├── app.js        # Express app setup and middleware registration
        ├── config/       # Database client and collection references
        ├── middleware/   # JWT authentication middleware
        ├── routes/       # Route definitions
        └── controllers/  # Request handlers and business logic
```

---

## Core User Flows

1. **Browse Cars** — Any visitor can view available cars on the home page and explore the full catalogue.
2. **Register / Log In** — Users register with email + password and a profile photo, or sign in via Google OAuth.
3. **Book a Car** — Authenticated users open a car detail page, choose driver preference, add a note, and confirm.
4. **Add a Car** — Authenticated users fill in a listing form with image upload, type, price, and availability.
5. **Manage Listings** — Users view, update, and delete their own listed cars from the "My Added Cars" page.
6. **View Bookings** — Users see all their confirmed bookings from the "Booking Dashboard" page.

---

## Quick Start Reference

See [Environment Setup](./environment-setup.md) for detailed configuration and startup instructions.

| Service                | Default Port |
| ---------------------- | ------------ |
| Frontend (Next.js dev) | 3000         |
| Backend (Express)      | 5000         |
