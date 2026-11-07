# Authentication

This document describes the complete authentication system used by DriveFleet, including the library, configuration, session management, JWT flow, Google OAuth integration, route protection, and the token handshake between the frontend and backend.

---

## Authentication Library

DriveFleet uses **Better Auth v1** ([`better-auth`](https://www.better-auth.com/)) as its authentication framework. Better Auth is configured as a server-side instance in the Next.js frontend and exposes all auth endpoints under `/api/auth/`.

---

## Server-Side Auth Configuration (`src/lib/auth.js`)

```javascript
// Key configuration (values redacted — see Environment Setup)
export const auth = betterAuth({
    database: mongodbAdapter(db, { client }),   // drive-fleet-auth database
    emailAndPassword: { enabled: true },
    socialProviders: {
        google: { clientId, clientSecret }
    },
    session: {
        cookieCache: true,
        strategy: "jwt",
        maxAge: 5 * 24 * 60 * 60    // 5 days in seconds
    },
    plugins: [ jwt() ]
});
```

### Configuration Details

| Option | Value | Notes |
| --- | --- | --- |
| **Database** | MongoDB — `drive-fleet-auth` | Separate database from the application data |
| **Email/Password** | Enabled | Standard credential-based sign-up and sign-in |
| **Google OAuth** | Enabled | Requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` |
| **Session Strategy** | `"jwt"` | Sessions are maintained via JWT; no server-side session table |
| **Cookie Cache** | `true` | Session data is cached in a secure cookie to reduce database reads |
| **Session Max Age** | 432,000 seconds (5 days) | Session cookies expire after 5 days of inactivity |
| **JWT Plugin** | `jwt()` | Adds JWT access token issuance and a JWKS public key endpoint |

---

## Auth API Route (`src/app/api/auth/[...all]/route.js`)

```javascript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
export const { POST, GET } = toNextJsHandler(auth);
```

This catch-all route delegates all GET and POST requests at `/api/auth/*` to Better Auth. Key endpoints exposed include:

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/auth/sign-in/email` | POST | Email/password sign-in |
| `/api/auth/sign-up/email` | POST | Email/password registration |
| `/api/auth/sign-in/social` | POST | Initiate Google OAuth flow |
| `/api/auth/sign-out` | POST | Invalidate the current session |
| `/api/auth/get-session` | GET | Retrieve the current session (server-to-server) |
| `/api/auth/jwks` | GET | Returns the public JWKS for JWT verification by the backend |
| `/api/auth/token` | GET | Returns the current JWT access token for use in API calls |

---

## Client-Side Auth (`src/lib/auth-client.js`)

```javascript
export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [ jwtClient() ]
});

export const { signIn, signUp, useSession } = createAuthClient();
```

Two auth clients are created:

1. **`authClient`** — configured with the `jwtClient()` plugin. This client exposes `authClient.token()`, which makes a request to `/api/auth/token` and returns the current JWT access token. Used when the frontend needs to call protected backend API endpoints.

2. **`{ signIn, signUp, useSession }`** — a simpler client without the JWT plugin, exported for use in components that do not need token retrieval.

---

## Authentication Flows

### Email/Password Sign-In

```
User enters credentials
    │
    ▼
LoginPage.Login() calls authClient.signIn.email({ email, password, callbackURL: "/" })
    │
    ▼
POST /api/auth/sign-in/email  (handled by Better Auth)
    │
    ├─ Credentials valid ──► Session cookie set; callbackURL "/" redirect triggered
    │                         toast.success("Login successfully.")
    │
    └─ Credentials invalid ──► error.message returned; toast.error(error.message)
```

**Password requirements** (validated client-side by the Login and Registration pages):

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit

---

### Email/Password Registration

```
User fills registration form
    │
    ├─ Profile image uploaded to ImgBB first (required before submission)
    │
    ▼
RegistrationPage.Registration() calls authClient.signUp.email({
    name, email, password, image: imageUrl
})
    │
    ▼
POST /api/auth/sign-up/email  (handled by Better Auth)
    │
    ├─ Success ──► Better Auth creates user in drive-fleet-auth database
    │              Session is immediately signed out via authClient.signOut()
    │              User is redirected to /login
    │
    └─ Error ──► toast.error(error.message)
```

> After registration, the user is redirected to the login page and must sign in explicitly. Automatic post-registration sign-in is not implemented.

---

### Google OAuth Sign-In

```
User clicks "Login / Register with Google" button
    │
    ▼
GoogleLoginButton calls authClient.signIn.social({ provider: "google" })
    │
    ▼
Better Auth initiates the OAuth 2.0 authorisation code flow:
    │
    ├─ Redirects to Google's sign-in page
    ├─ User grants permission
    ├─ Google redirects back to the Better Auth callback URL
    └─ Better Auth creates or updates the user account in drive-fleet-auth
       and sets the session cookie
```

The `GoogleLoginButton` component accepts a `BtnFor` prop (`"Login"` or `"Register"`) for the button label, but the underlying flow is identical in both cases.

---

### Sign-Out

```
User clicks Logout (Navbar dropdown or mobile drawer)
    │
    ▼
authClient.signOut({
    fetchOptions: {
        onSuccess: () => {
            toast.success("Log out successfully!");
            window.location.reload();
            router.push("/");
        }
    }
})
    │
    ▼
POST /api/auth/sign-out  ──► Session cookie cleared
    │
    └─ Page reloaded and redirected to home
```

---

## JWT Token Flow (Frontend → Backend)

For protected backend routes, the frontend must include a JWT access token. The flow is:

```
Client Component or Server Component (my-added-cars, my-bookings)
    │
    ├─ [Client] authClient.token()  ──► GET /api/auth/token
    │               │
    │               └─ Returns { token: "<jwt_access_token>" }
    │
    ├─ [Server] auth.api.getToken({ headers })
    │               │
    │               └─ Reads the session cookie and returns the token
    │
    ▼
fetch(`${NEXT_PUBLIC_SERVER_URL}/protected-endpoint`, {
    headers: { authorization: `Bearer ${userToken}` }
})
    │
    ▼
Express authMiddleware (server-a9/src/middleware/auth.js)
    │
    ├─ Creates JWKS from: GET {CLIENT_URL}/api/auth/jwks
    ├─ jwtVerify(token, JWKS)
    │
    ├─ Valid ──► next()  (proceeds to controller)
    └─ Invalid ──► 401 or 403 response
```

### Token Usage by Route

| Frontend Action | Token Source | Protected Backend Route |
| --- | --- | --- |
| Add a car (`add-car` page) | `authClient.token()` (client-side) | `POST /all-cars` |
| View my added cars (`my-added-cars` page) | `auth.api.getToken()` (server-side) | `GET /added-cars/:userId` |
| View my bookings (`my-bookings` page) | `auth.api.getToken()` (server-side) | `GET /all-bookings/:userId` |

---

## Route Protection (Next.js Middleware)

The `src/proxy.js` file implements a Next.js Middleware function that protects the following routes at the server edge:

```
/my-bookings
/my-added-cars
/add-car
```

```javascript
export async function proxy(request) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session) return NextResponse.next();
    return NextResponse.redirect(new URL('/login', request.url));
}
```

If the user navigates to any of these routes without an active session cookie, the middleware redirects them to `/login` before the page component is rendered.

This protection is **server-side** and applies regardless of JavaScript availability in the browser. It does not prevent access to the backend API endpoints themselves.

---

## Auth Database Structure

Better Auth manages the following collections in the **`drive-fleet-auth`** MongoDB database using its MongoDB adapter:

| Collection | Purpose |
| --- | --- |
| `user` | Stores registered user accounts (id, name, email, image, emailVerified, createdAt, updatedAt) |
| `session` | Tracks active sessions (used for session invalidation and cookie caching) |
| `account` | Links users to OAuth provider accounts (e.g. Google account details) |

> These collections are managed entirely by Better Auth and should not be modified directly.

---

## Session Reading in Server Components

Server Components (e.g. `my-added-cars/page.jsx`, `my-bookings/page.jsx`) read session data and tokens server-side using the Next.js `headers()` function:

```javascript
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({ headers: await headers() });
const token = await auth.api.getToken({ headers: await headers() });

const userId = session?.user?.id;
const userToken = token?.token;
```

This approach allows server components to authenticate without client-side JavaScript and without exposing the token to the browser for these specific data-fetch calls.

---

## External Service: Google OAuth

Google OAuth requires a registered project in Google Cloud Console with an OAuth 2.0 Web Application credential:

- **Authorised JavaScript origins:** The frontend base URL (e.g. `http://localhost:3000`).
- **Authorised redirect URIs:** The Better Auth callback URL — typically `{BETTER_AUTH_URL}/api/auth/callback/google`.

The `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` environment variables must be set in the frontend's `.env` file.
