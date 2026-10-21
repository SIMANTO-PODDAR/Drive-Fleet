# Frontend Documentation

The DriveFleet frontend is a Next.js 16 application using the App Router. This document covers the application structure, every page and its behaviour, reusable components, section-level layout components, the auth integration, and the middleware configuration.

---

## Directory Structure

```
src/
├── app/
│   ├── layout.js                        # Root layout (Navbar, Footer, Toaster)
│   ├── page.js                          # Home page (/)
│   ├── globals.css                      # Global CSS (minimal; Tailwind handles most styles)
│   ├── error.jsx                        # Global error boundary
│   ├── not-found.jsx                    # 404 page
│   ├── (pages)/                         # Route group: main feature pages
│   │   ├── loading.js                   # Shared loading fallback for this group
│   │   ├── explore-cars/
│   │   │   ├── page.jsx                 # /explore-cars — car catalogue with search/filter
│   │   │   └── [id]/
│   │   │       └── page.jsx             # /explore-cars/:id — car detail and booking
│   │   ├── add-car/
│   │   │   └── page.jsx                 # /add-car — car listing form (protected)
│   │   ├── my-added-cars/
│   │   │   └── page.jsx                 # /my-added-cars — user's listed vehicles (protected)
│   │   └── my-bookings/
│   │       └── page.jsx                 # /my-bookings — user's booking history (protected)
│   ├── (safety)/                        # Route group: authentication pages
│   │   ├── login/
│   │   │   └── page.jsx                 # /login
│   │   └── registration/
│   │       └── page.jsx                 # /registration
│   └── api/
│       └── auth/
│           └── [...all]/
│               └── route.js             # Better Auth API handler
├── Components/                          # Reusable React components
│   ├── BookNowButton.jsx
│   ├── BookingTable.jsx
│   ├── CarCard.jsx
│   ├── DeleteAddedCar.jsx
│   ├── GoogleLoginButton.jsx
│   ├── Loading.jsx
│   ├── MyAddedCarsCard.jsx
│   ├── SearchFilter.jsx
│   └── UpdateAddedCar.jsx
├── Sections/                            # Page-section components (layout pieces)
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Hero.jsx
│   ├── AvailableCars.jsx
│   ├── OurFleetPartners.jsx
│   └── Reviews.jsx
├── lib/
│   ├── auth.js                          # Better Auth server configuration
│   └── auth-client.js                   # Better Auth browser client
└── proxy.js                             # Next.js Middleware (route protection)
```

---

## Root Layout (`src/app/layout.js`)

The root layout wraps every page with:

- **Geist Sans** and **Geist Mono** fonts loaded via `next/font/google`.
- `<Navbar />` rendered above the page content.
- `<Footer />` rendered below, outside the main container.
- `<Toaster />` from `react-hot-toast` mounted at the body level for global toast notifications.
- DaisyUI `data-theme="light"` applied to the `<html>` element.

The `metadata` export sets the global document title to **"DriveFleet"** and description to **"Car Rental Platform"**.

---

## Pages

### Home Page (`/`)

**File:** `src/app/page.js`  
**Rendering:** Server Component

Renders four sections in order:

1. `<Hero />` — brand headline, banner image, and CTA.
2. `<AvailableCars />` — async server component that fetches and displays up to 6 available cars.
3. `<OurFleetPartners />` — static section showing brand partner logos.
4. `<Reviews />` — static section with scrolling user testimonials.

---

### Explore Cars (`/explore-cars`)

**File:** `src/app/(pages)/explore-cars/page.jsx`  
**Rendering:** Async Server Component

Accepts `searchParams` (URL query parameters):

| Parameter | Type   | Purpose                                                     |
| --------- | ------ | ----------------------------------------------------------- |
| `search`  | string | Filter cars by name (case-insensitive regex on the backend) |
| `type`    | string | Filter cars by type (SUV, Sedan, Hatchback, Luxury, Sports) |

The page builds a query string from the params and fetches from `GET /all-cars`. The result is rendered as a grid of `<CarCard />` components. If no cars match, a "No cars found" message is shown.

The `<SearchFilter />` client component is embedded to allow interactive filtering without a page reload.

---

### Car Detail (`/explore-cars/:id`)

**File:** `src/app/(pages)/explore-cars/[id]/page.jsx`  
**Rendering:** Async Server Component

Receives the car `id` from the dynamic segment and fetches from `GET /all-cars/:id`. Displays:

- Car name and availability status badge.
- Car image.
- Specification cards: Type, Capacity, Booked By count, Status.
- Description text. If `car.UserListedCar === true`, a "User Listed Car" label is shown.
- A sticky sidebar panel showing daily rental price, status, taxes note, and the `<BookNowButton />` client component.

---

### Add Car (`/add-car`)

**File:** `src/app/(pages)/add-car/page.jsx`  
**Rendering:** Client Component (`"use client"`)  
**Access:** Protected — requires authentication (middleware redirect + client-side session check)

A multi-field car listing form. On submission:

1. Validates that an image has been uploaded.
2. Retrieves the JWT access token via `authClient.token()`.
3. Sends a `POST /all-cars` request with `Authorization: Bearer <token>`.
4. On success, redirects to `/my-added-cars` after 1.5 seconds.

**Form Fields:**

| Field               | Input Type                | Constraints                                     |
| ------------------- | ------------------------- | ----------------------------------------------- |
| Car Name            | Text                      | Required; max 35 characters                     |
| Daily Rent Price    | Number                    | Required; 1–100,000                             |
| Car Type            | Select                    | SUV, Sedan, Hatchback, Luxury, Sports           |
| Car Image           | File Upload (drag & drop) | Required; image/\*; max 5 MB; uploaded to ImgBB |
| Seat Capacity       | Number                    | Required; 1–500                                 |
| Pickup Location     | Text                      | Required; max 50 characters                     |
| Description         | Textarea                  | Required; max 170 characters                    |
| Availability Status | Select                    | Available / Unavailable                         |

**Derived fields set automatically:**

- `BookBy`: initialised to `0`.
- `userId`: taken from the current session user's ID.
- `UserListedCar`: always `true` for user-submitted cars.

---

### My Added Cars (`/my-added-cars`)

**File:** `src/app/(pages)/my-added-cars/page.jsx`  
**Rendering:** Async Server Component  
**Access:** Protected

Reads the server-side session and token via `auth.api.getSession()` and `auth.api.getToken()`. Fetches `GET /added-cars/:userId` with the JWT token in the `Authorization` header.

Renders a grid of `<MyAddedCarsCard />` components. When no cars are listed, displays an empty-state panel with a link to `/add-car`.

---

### My Bookings (`/my-bookings`)

**File:** `src/app/(pages)/my-bookings/page.jsx`  
**Rendering:** Async Server Component  
**Access:** Protected

Reads the server-side session and token. Fetches `GET /all-bookings/:userId` with the JWT token. Renders a `<BookingTable />` component. When no bookings exist, an empty-state panel prompts navigation to `/explore-cars`.

---

### Login (`/login`)

**File:** `src/app/(safety)/login/page.jsx`  
**Rendering:** Client Component

Provides two sign-in methods:

1. **Email/Password** — calls `authClient.signIn.email({ email, password, callbackURL: "/" })`. On success, redirects to `/`.
2. **Google OAuth** — delegates to `<GoogleLoginButton BtnFor="Login" />`.

Password validation rules (client-side): minimum 8 characters, at least one uppercase, one lowercase, one digit.

A link to `/registration` is shown for new users.

---

### Registration (`/registration`)

**File:** `src/app/(safety)/registration/page.jsx`  
**Rendering:** Client Component

Collects name, email, profile image (uploaded to ImgBB), and password. On submission:

1. Calls `authClient.signUp.email({ name, email, password, image })`.
2. On success, signs the user out immediately and redirects to `/login` so they must log in explicitly.

This design requires users to explicitly authenticate after registration rather than being automatically signed in.

Password requirements are identical to the login page validation rules.

---

### Error Page (`src/app/error.jsx`)

A global React error boundary that Next.js renders when an unhandled error occurs in a server or client component. Provides a "Restart" button (calls `reset()`) and a "Home" navigation link.

---

### 404 Page (`src/app/not-found.jsx`)

Rendered for any unmatched route. Provides navigation buttons to the home page and the explore cars page.

---

### Loading Fallback (`src/app/(pages)/loading.js`)

Next.js automatically renders this component as a Suspense fallback for any page under the `(pages)` route group while server components are streaming. It renders `<Loading />`.

---

## Sections

Sections are large, page-level components used in the root layout or on the home page.

### `Navbar.jsx`

**Type:** Client Component

The site-wide navigation bar, rendered on every page via the root layout. Key features:

- **Sticky** with a backdrop-blur effect.
- **Desktop navigation** (≥1024px): horizontal link list — Home, Explore Cars, Add Car, My Bookings, My Added Cars.
- **Mobile navigation** (< 1024px): a slide-in drawer activated by a hamburger button.
- **Session-aware:** reads the session from `authClient.useSession()`.
  - If no session: a **Login** button is shown.
  - If session active: an **Avatar + Name** button is shown, opening a dropdown with a **Logout** button.
- **Logout** calls `authClient.signOut()`, shows a success toast, and reloads the page.

### `Footer.jsx`

**Type:** Client Component (uses `usePathname` for active-link highlighting)

A multi-column footer with:

- About text and contact details (email, phone, location).
- Navigation links with active-state highlighting.
- Account links (Login, Registration).
- Social media links (Facebook, Instagram, LinkedIn — href `#` placeholders).
- Copyright notice with a dynamic year.
- Decorative ambient glow effects.

### `Hero.jsx`

**Type:** Server Component

The home page hero section with the banner image, brand tagline "Drive Smarter with DriveFleet", a short description, and an "Explore Cars" CTA button linking to `/explore-cars`.

### `AvailableCars.jsx`

**Type:** Async Server Component

Fetches up to 6 cars with `Status: "Available"` from `GET /available-cars` (with `cache: "no-store"`). Renders a responsive 1–3 column grid of `<CarCard />` components.

### `OurFleetPartners.jsx`

**Type:** Server Component

Static section showcasing four automotive brand partners: BMW, Hyundai, Tesla, Toyota. Uses local `public/` images. Dark background (`#0D0D33`) with a 4-column responsive card grid.

### `Reviews.jsx`

**Type:** Server Component (uses `react-fast-marquee` for animation)

Displays six static customer testimonials in an auto-scrolling marquee that pauses on hover. Each testimonial card shows an avatar (loaded from an external URL), reviewer name, star rating, and quote text.

---

## Components

### `CarCard.jsx`

Displays a single car in a card format. Shows:

- Car image.
- Car name and availability status badge (`badge-success` for Available, `badge-warning` otherwise).
- A "User Listed Car" label if `car.UserListedCar === true`.
- Description (2-line clamp).
- Daily rent price badge.
- A "Details" button linking to `/explore-cars/:id`.

### `BookNowButton.jsx`

**Type:** Client Component

A booking trigger button and associated HeroUI `Modal` form. On click, a modal opens. The modal contains:

- A vehicle summary card (image, name, type, daily rate, status).
- **Driver Needed** field: radio buttons styled as custom tick-box cards (Yes / No). Selection is tracked in local state.
- **Special Note** textarea: free-form request text. Required field.
- Cancel and Confirm Booking buttons.

On form submission:

1. Validates session, car availability, and driver selection.
2. Posts a booking object to `POST /all-bookings`.
3. On success: shows a toast and reloads the page after 2 seconds.

The "Book Now" button is disabled if `car.Status === "Unavailable"`.

### `BookingTable.jsx`

Renders a HeroUI `Table` with scrolling support. Columns: Car Name, Total Price ($), Booking Date (formatted as locale date), Driver Needed. Populated from an array of booking objects.

### `DeleteAddedCar.jsx`

**Type:** Client Component

A delete trigger button that opens a HeroUI `AlertDialog` for confirmation. On confirmation:

- Sends `DELETE /all-cars/:carId`.
- Shows a success toast and reloads the page.

### `GoogleLoginButton.jsx`

**Type:** Client Component (does not require `"use client"` directive but is used in client pages)

A Google sign-in/sign-up button. Accepts a `BtnFor` prop (e.g. `"Login"` or `"Register"`) to customise the label text. Calls `authClient.signIn.social({ provider: "google" })`.

### `Loading.jsx`

A branded loading spinner:

- Outer pulsing ring (animated gradient).
- Rotating border spinner.
- Centred animated car icon (`FaCarSide`).
- "Loading DriveFleet..." text.

### `MyAddedCarsCard.jsx`

A detailed card for user-owned car listings. Shows:

- Car image (clickable link to detail page) with zoom-on-hover effect.
- Car type badge overlay.
- Car name (link to detail page).
- Description (2-line clamp).
- Price, pickup location, capacity in a 2-column grid.
- Animated availability status badge.
- Action row: `<DeleteAddedCar />` and `<UpdateAddedCar />` buttons.

### `SearchFilter.jsx`

**Type:** Client Component

A search and type-filter bar for the Explore Cars page. Uses `useRouter` and `useSearchParams` to update the URL query string without a full page reload (`router.push` with `scroll: false`).

- **Search input**: Filters by car name on button click.
- **Type dropdown**: Immediately pushes the selected type to the URL on change.

Available type options: All Types (empty), SUV, Sedan, Hatchback, Luxury, Sports.

### `UpdateAddedCar.jsx`

**Type:** Client Component

An update trigger button that opens a HeroUI `Modal` containing an edit form. The form is pre-filled with existing car data. Supports:

- Image replacement via drag-and-drop or file picker (upload to ImgBB; current image shown with a "Change Image" button).
- Editing: Daily Rent Price, Availability Status, Car Type, Pickup Location, Description.

On submission, sends `PATCH /all-cars/:id` with the updated fields. The car name and `userId` are **not** editable through this form.

---

## Auth Library Files

### `src/lib/auth.js` (Server-side)

Configures the Better Auth instance. Key settings:

| Setting          | Value                                                  |
| ---------------- | ------------------------------------------------------ |
| Database         | MongoDB adapter (`drive-fleet-auth` database)          |
| Email/Password   | Enabled                                                |
| Google OAuth     | Enabled (clientId/clientSecret from env vars)          |
| Session Strategy | JWT                                                    |
| Session Max Age  | 5 days (432,000 seconds)                               |
| Cookie Cache     | Enabled                                                |
| Plugins          | `jwt()` — enables JWT token issuance and JWKS endpoint |

### `src/lib/auth-client.js` (Client-side)

Creates two exports:

1. **`authClient`**: A Better Auth React client configured with the `jwtClient()` plugin, allowing `authClient.token()` to retrieve JWT access tokens for use in backend API calls.
2. **`{ signIn, signUp, useSession }`**: Exported directly from a second `createAuthClient()` call (without the JWT plugin) for convenience in some components.

The `baseURL` for the auth client is set from `process.env.BETTER_AUTH_URL`.

### `src/app/api/auth/[...all]/route.js`

A Next.js App Router API catch-all route that delegates all GET and POST requests to Better Auth's Next.js handler (`toNextJsHandler(auth)`). This exposes all Better Auth endpoints under `/api/auth/`.

---

## Middleware (`src/proxy.js`)

Implements a Next.js Middleware function that protects specific routes by checking for an active server-side session:

```javascript
// Protected routes
matcher: ["/my-bookings", "/my-added-cars", "/add-car"];
```

If no session is found, the middleware issues a redirect to `/login`. If a session exists, the request proceeds.

The middleware uses `auth.api.getSession({ headers })` from the server-side auth instance, which reads the session cookie without any additional network round-trips.

---

## Styling and UI Framework

| Tool                 | Role                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| Tailwind CSS v4      | Utility-first CSS; configured via `postcss.config.mjs`                                           |
| DaisyUI v5           | Component theme layer on top of Tailwind (buttons, badges, cards, etc.)                          |
| HeroUI v3            | React component library for complex UI elements (Modal, AlertDialog, Table, Avatar, Form fields) |
| `react-hot-toast`    | Toast notification system                                                                        |
| Brand colour palette | Primary dark: `#0D0D33`; Primary blue: `#0033FF` (used as gradient endpoints)                    |

### Responsive Breakpoints

Standard Tailwind breakpoints are used throughout:

| Breakpoint | Width    |
| ---------- | -------- |
| `sm`       | ≥ 640px  |
| `md`       | ≥ 768px  |
| `lg`       | ≥ 1024px |

The Navbar switches from a drawer menu to an inline horizontal menu at `lg` (1024px).

---

## Next.js Configuration (`next.config.mjs`)

| Option                  | Value                                      | Purpose                                                               |
| ----------------------- | ------------------------------------------ | --------------------------------------------------------------------- |
| `reactCompiler`         | `true`                                     | Enables the experimental React Compiler (babel-plugin-react-compiler) |
| `images.remotePatterns` | `[{ protocol: "https", hostname: "***" }]` | Allows `next/image` to serve images from any HTTPS host               |
