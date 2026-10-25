# Environment Setup

This document describes every environment variable required by both the frontend and backend, explains their purpose, and provides instructions for configuring the local development environment.

> **Security Note:** Never commit `.env` files to version control. Both projects include `.gitignore` entries that exclude `.env` from commits. Never expose secret values in documentation, logs, or client-side code.

---

## Frontend Environment Variables

**File:** `Drive-Fleet/.env`

The Next.js frontend reads variables from this file at build and runtime. Variables prefixed with `NEXT_PUBLIC_` are bundled into the client-side JavaScript and are accessible in the browser.

| Variable | Public | Required | Description |
| --- | --- | --- | --- |
| `MONGODB_URI` | No | Yes | Full MongoDB connection string used by Better Auth to connect to the `drive-fleet-auth` database |
| `BETTER_AUTH_SECRET` | No | Yes | A long, random secret string used by Better Auth for signing and encryption |
| `BETTER_AUTH_URL` | No | Yes | The base URL of the Next.js application (e.g. `http://localhost:3000`). Used by the Better Auth client to locate auth endpoints |
| `GOOGLE_CLIENT_ID` | No | Yes | OAuth 2.0 client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | No | Yes | OAuth 2.0 client secret from Google Cloud Console |
| `NEXT_PUBLIC_SERVER_URL` | **Yes** | Yes | Base URL of the Express backend (e.g. `http://localhost:5000`). Used in client and server components for API calls |
| `NEXT_PUBLIC_IMAGE_UPLOAD_API` | **Yes** | Yes | ImgBB API key. Used client-side to upload car and profile images |

### Example `.env` (Safe Placeholder Values)

```dotenv
# MongoDB (Better Auth)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority

# Better Auth
BETTER_AUTH_SECRET=<your-long-random-secret-string>
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-oauth-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your-google-oauth-client-secret>

# Backend API
NEXT_PUBLIC_SERVER_URL=http://localhost:5000

# ImgBB
NEXT_PUBLIC_IMAGE_UPLOAD_API=<your-imgbb-api-key>
```

---

## Backend Environment Variables

**File:** `server-a9/.env`

The Express backend reads these variables via `dotenv` at startup.

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | Full MongoDB connection string used by the application to connect to the `drive-fleet` database |
| `PORT` | No | HTTP port for the Express server. Defaults to `5000` if not set |
| `CLIENT_URL` | Yes | Base URL of the Next.js frontend (e.g. `http://localhost:3000`). Used to construct the JWKS endpoint: `${CLIENT_URL}/api/auth/jwks` |

### Example `.env` (Safe Placeholder Values)

```dotenv
# MongoDB (Application Data)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority

# Server
PORT=5000

# Frontend URL (for JWKS verification)
CLIENT_URL=http://localhost:3000
```

---

## Database Setup

DriveFleet requires a **MongoDB Atlas** cluster (or any accessible MongoDB instance). The same cluster can host both databases.

### Required Databases and Collections

| Database | Collection | Created By |
| --- | --- | --- |
| `drive-fleet` | `all-cars` | Application (auto-created on first insert) |
| `drive-fleet` | `drive-fleet-bookings` | Application (auto-created on first insert) |
| `drive-fleet-auth` | `user`, `session`, `account` | Better Auth (auto-created on first auth operation) |

Collections are created automatically by MongoDB on first write. No migration scripts are required.

### Connection String Format

Both the frontend and backend use a MongoDB connection string of the form:

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
```

- The **frontend** (`Drive-Fleet/.env`) connects to the `drive-fleet-auth` database — the specific database name is set programmatically in `src/lib/auth.js` via `client.db('drive-fleet-auth')`.
- The **backend** (`server-a9/.env`) connects to the `drive-fleet` database — set programmatically in `src/config/db.js` via `client.db('drive-fleet')`.

Both can use the same connection string (same cluster, same credentials), as the database name is specified in the code, not in the URI.

---

## External Service Setup

### ImgBB (Image Hosting)

Images are uploaded directly from the browser to the ImgBB API.

1. Create a free account at [imgbb.com](https://imgbb.com).
2. Go to the API section and generate an API key.
3. Add the key to `NEXT_PUBLIC_IMAGE_UPLOAD_API` in `Drive-Fleet/.env`.

The API key is publicly visible in the browser since it is a `NEXT_PUBLIC_` variable. Consider ImgBB's API usage limits and terms of service for production use.

### Google OAuth

1. Visit the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or use an existing one).
3. Navigate to **APIs & Services > Credentials**.
4. Click **Create Credentials > OAuth 2.0 Client ID**.
5. Select **Web Application**.
6. Under **Authorised JavaScript origins**, add: `http://localhost:3000`
7. Under **Authorised redirect URIs**, add: `http://localhost:3000/api/auth/callback/google`
8. Copy the **Client ID** and **Client Secret** into `Drive-Fleet/.env`.

For production, replace `localhost:3000` with the actual deployed domain in both fields.

---

## Local Development Startup

### Prerequisites

- Node.js (v18 or later recommended)
- A MongoDB Atlas cluster or local MongoDB instance

### Step 1: Configure the Backend

1. Navigate to `server-a9/`.
2. Create `.env` using the template above.
3. Install dependencies: `npm install`
4. Start the backend: `node index.js`

The server will log: `Server running on port 5000`

### Step 2: Configure the Frontend

1. Navigate to `Drive-Fleet/`.
2. Create `.env` using the template above.
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

The Next.js dev server will start at `http://localhost:3000`.

### Step 3: Verify

- Open `http://localhost:3000` — the DriveFleet home page should load.
- The "Available Cars" section should display cars if any are in the database.
- Navigate to `/login` and test email/password authentication.
- The backend health check is available at `http://localhost:5000/`.

---

## Production Considerations

| Concern | Guidance |
| --- | --- |
| `BETTER_AUTH_URL` | Set to the production domain (e.g. `https://drivefleet.com`) |
| `CLIENT_URL` (backend) | Set to the production frontend URL for JWKS verification |
| `NEXT_PUBLIC_SERVER_URL` | Set to the production backend URL |
| Google OAuth redirect URI | Add the production redirect URI in Google Cloud Console |
| CORS | The backend currently allows all origins. Restrict to the production frontend domain for production deployments |
| ImgBB API key | The key is exposed to browsers as `NEXT_PUBLIC_`. For a production system, consider routing image uploads through a server-side endpoint to keep the key private |
| MongoDB Atlas | Ensure the IP allowlist includes the servers hosting both the frontend and backend |
| `BETTER_AUTH_SECRET` | Use a cryptographically secure random string (at least 32 characters) |

---

## Next.js Build

To build the production frontend bundle:

```bash
cd Drive-Fleet
npm run build
npm run start
```

The `build` command compiles the Next.js application for production. The React Compiler (`reactCompiler: true` in `next.config.mjs`) is active and will optimise React component rendering during the build.
