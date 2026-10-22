# Backend Documentation

The DriveFleet backend is a Node.js REST API server built with Express.js. It provides data persistence for cars and bookings, and enforces JWT-based authentication on protected routes. This document covers the server structure, middleware, route definitions, and controller logic.

---

## Directory Structure

```
server-a9/
├── index.js              # Entry point: loads env, starts HTTP server
└── src/
    ├── app.js            # Express app factory: middleware + route mounting
    ├── config/
    │   └── db.js         # MongoDB client and collection exports
    ├── middleware/
    │   └── auth.js       # JWT verification middleware (JWKS-based)
    ├── routes/
    │   ├── carsRoutes.js     # Car-related route definitions
    │   └── bookingsRoutes.js # Booking-related route definitions
    └── controllers/
        ├── carsController.js     # Car business logic and DB operations
        └── bookingsController.js # Booking business logic and DB operations
```

---

## Entry Point (`index.js`)

The entry point:

1. Loads `dotenv` to populate environment variables from `.env`.
2. Imports the Express application from `src/app.js`.
3. Reads `PORT` from the environment (defaults to `5000` if not set).
4. Starts the HTTP server and logs the active port.

```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

The `run()` async function is present in the entry point as a placeholder for connection verification logic (the active MongoDB ping call is commented out). The server starts regardless of this function's outcome.

---

## Application Setup (`src/app.js`)

The Express application is configured with:

| Middleware       | Purpose                                                                           |
| ---------------- | --------------------------------------------------------------------------------- |
| `cors()`         | Enables Cross-Origin Resource Sharing for all origins (no restriction configured) |
| `express.json()` | Parses incoming JSON request bodies                                               |

Two route modules are mounted at the root path `/`:

```javascript
app.use("/", carsRoutes);
app.use("/", bookingsRoutes);
```

A health check route is also defined:

```
GET /  →  "DriveFleet Server is running..."
```

---

## Database Configuration (`src/config/db.js`)

Establishes a single `MongoClient` connection using the `MONGODB_URI` environment variable. The MongoDB Server API v1 is used with strict mode and deprecation errors enabled.

Two collections are pre-instantiated and exported for use by controllers:

| Export               | Database      | Collection             |
| -------------------- | ------------- | ---------------------- |
| `carsCollection`     | `drive-fleet` | `all-cars`             |
| `bookingsCollection` | `drive-fleet` | `drive-fleet-bookings` |

The client instance is also exported to allow connection management if needed.

> **Important:** The `MongoClient` connection is opened lazily on first query. There is no explicit `client.connect()` call or connection-pooling teardown in the current implementation.

---

## Authentication Middleware (`src/middleware/auth.js`)

Protects routes by verifying Bearer JWT tokens issued by the Better Auth instance running on the frontend.

### How It Works

1. Reads the `Authorization` header from the incoming request.
2. Extracts the token after the `Bearer ` prefix.
3. Verifies the token using `jwtVerify` from `jose-cjs`, against the **remote JWKS** endpoint:
   ```
   {CLIENT_URL}/api/auth/jwks
   ```
   The `CLIENT_URL` environment variable points to the frontend's base URL (e.g. `http://localhost:3000`).
4. If verification succeeds, calls `next()` to proceed to the route handler.
5. If the header is missing or the token is invalid/expired, returns an appropriate error response.

### Error Responses

| Condition                 | HTTP Status | Response Body                    |
| ------------------------- | ----------- | -------------------------------- |
| No `Authorization` header | `401`       | `{ "message": "Unauthorized" }`  |
| No token after `Bearer`   | `401`       | `{ "message": "Unauthorized" }`  |
| Invalid or expired token  | `403`       | `{ "message": "Invalid token" }` |

### Dependency

The middleware depends on `jose-cjs` (a CommonJS-compatible port of the `jose` JOSE library) for JWKS-based token verification. The JWKS set is created once via `createRemoteJWKSet` and cached for subsequent requests.

---

## Routes

### Cars Routes (`src/routes/carsRoutes.js`)

All car routes are registered on the `express.Router()` and mounted at `/`.

| Method   | Path                  | Auth Required | Controller           | Description                                                    |
| -------- | --------------------- | ------------- | -------------------- | -------------------------------------------------------------- |
| `GET`    | `/all-cars`           | No            | `getAllCars`         | List all cars, with optional `search` and `type` query filters |
| `POST`   | `/all-cars`           | **Yes**       | `addCar`             | Add a new car listing                                          |
| `GET`    | `/available-cars`     | No            | `getAvailableCars`   | List up to 6 cars with `Status: "Available"`                   |
| `GET`    | `/all-cars/:id`       | No            | `getCarById`         | Retrieve a single car by MongoDB `_id`                         |
| `GET`    | `/added-cars/:userId` | **Yes**       | `getAddedCarsByUser` | List all cars added by a specific user                         |
| `DELETE` | `/all-cars/:id`       | No            | `deleteCar`          | Delete a car by MongoDB `_id`                                  |
| `PATCH`  | `/all-cars/:carId`    | No            | `updateCar`          | Partially update a car's fields                                |

> **Note:** The `DELETE` and `PATCH` routes do not currently require authentication middleware. Only `POST /all-cars` and `GET /added-cars/:userId` use the `authMiddleware`.

---

### Bookings Routes (`src/routes/bookingsRoutes.js`)

| Method | Path                    | Auth Required | Controller          | Description                                                   |
| ------ | ----------------------- | ------------- | ------------------- | ------------------------------------------------------------- |
| `POST` | `/all-bookings`         | No            | `addBooking`        | Create a new booking and increment the car's `BookBy` counter |
| `GET`  | `/all-bookings/:userId` | **Yes**       | `getBookingsByUser` | Retrieve all bookings for a specific user                     |

---

## Controllers

### Cars Controller (`src/controllers/carsController.js`)

#### `getAllCars(req, res)`

Handles `GET /all-cars`.

Reads optional query parameters `search` (string) and `type` (string) from `req.query`. Builds a MongoDB query:

- If `search` is provided: adds a case-insensitive regex filter on the `Name` field.
- If `type` is provided: adds an exact match filter on the `Type` field.

Returns the full matching array as JSON. Responds with `404` and an error message if the query fails.

#### `addCar(req, res)`

Handles `POST /all-cars`.

Inserts `req.body` directly into `carsCollection` using `insertOne`. Returns the MongoDB insertion result as JSON.

#### `getAvailableCars(req, res)`

Handles `GET /available-cars`.

Queries for documents where `Status` equals `"Available"`, limited to 6 results. Returns the array as JSON.

#### `getCarById(req, res)`

Handles `GET /all-cars/:id`.

Converts `req.params.id` to a `mongodb.ObjectId` and performs a `findOne` lookup. Returns the matching document as JSON (or `null` if not found).

#### `getAddedCarsByUser(req, res)`

Handles `GET /added-cars/:userId`.

Queries for all documents where `userId` equals `req.params.userId`. Returns the array as JSON.

#### `deleteCar(req, res)`

Handles `DELETE /all-cars/:id`.

Converts `req.params.id` to `ObjectId` and calls `deleteOne`. Returns the MongoDB deletion result as JSON.

#### `updateCar(req, res)`

Handles `PATCH /all-cars/:carId`.

Converts `req.params.carId` to `ObjectId`, then calls `updateOne` with `$set: req.body` to apply partial updates to the matched document. Returns the MongoDB update result as JSON.

---

### Bookings Controller (`src/controllers/bookingsController.js`)

#### `addBooking(req, res)`

Handles `POST /all-bookings`.

1. Inserts `req.body` into `bookingsCollection` using `insertOne`.
2. If the insertion is successful (`result.insertedId` is truthy): calls `updateOne` on `carsCollection` to increment the `BookBy` field by `1` for the car identified by `req.body.CarId` (converted to `ObjectId`).
3. Returns the insertion result as JSON.

This two-step operation is not atomic. If the `BookBy` increment fails after a successful booking insertion, the booking will still be recorded but the counter will not reflect it.

#### `getBookingsByUser(req, res)`

Handles `GET /all-bookings/:userId`.

Queries `bookingsCollection` for all documents where `userId` equals `req.params.userId`. Returns the full array as JSON.

---

## Environment Variables

The backend reads the following variables from its `.env` file:

| Variable      | Purpose                                                            |
| ------------- | ------------------------------------------------------------------ |
| `MONGODB_URI` | Full MongoDB connection string (including credentials)             |
| `PORT`        | HTTP port for the Express server (optional; defaults to 5000)      |
| `CLIENT_URL`  | Base URL of the frontend — used to construct the JWKS endpoint URL |

See [Environment Setup](./environment-setup.md) for configuration details.

---

## Module System

The backend uses **CommonJS** (`"type": "commonjs"` in `package.json`), consistent with traditional Node.js server patterns. All files use `require()` and `module.exports`.

---

## Dependencies

| Package    | Version | Purpose                          |
| ---------- | ------- | -------------------------------- |
| `express`  | ^5.2.1  | HTTP server and routing          |
| `cors`     | ^2.8.6  | Cross-origin request handling    |
| `mongodb`  | ^7.2.0  | Native MongoDB driver            |
| `jose-cjs` | ^6.2.3  | JWT verification via remote JWKS |
| `dotenv`   | ^17.4.2 | Environment variable loading     |
