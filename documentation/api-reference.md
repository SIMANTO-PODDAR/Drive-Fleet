# API Reference

This document is a complete catalogue of every HTTP endpoint exposed by the DriveFleet backend (`server-a9`). All endpoints return JSON.

**Base URL:** `http://localhost:5000` (development) — set as `NEXT_PUBLIC_SERVER_URL` in the frontend environment.

---

## Authentication

Endpoints marked **Protected** require a valid JWT Bearer token in the `Authorization` header:

```
Authorization: Bearer <jwt_access_token>
```

The token is issued by Better Auth and retrieved on the frontend via `authClient.token()`. The backend verifies the token using the JWKS public keys served at `{CLIENT_URL}/api/auth/jwks`.

---

## Cars Endpoints

### List All Cars

```
GET /all-cars
```

Returns all cars in the database. Supports optional query parameters for filtering.

**Authentication:** Not required

**Query Parameters:**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `search` | string | No | Case-insensitive substring match on the car's `Name` field |
| `type` | string | No | Exact match on the car's `Type` field (e.g. `SUV`, `Sedan`) |

**Example Requests:**

```
GET /all-cars
GET /all-cars?search=Tesla
GET /all-cars?type=Sedan
GET /all-cars?search=BMW&type=SUV
```

**Success Response — `200 OK`:**

```json
[
  {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "Name": "Tesla Model 3",
    "RentPrice": "120",
    "BookBy": 5,
    "Type": "Sedan",
    "ImgURL": "https://example.com/tesla.jpg",
    "Capacity": "5",
    "PickupLocation": "Dhaka",
    "Description": "Electric sedan with autopilot.",
    "Status": "Available",
    "userId": "user_abc123",
    "UserListedCar": true
  }
]
```

**Error Response — `404 Not Found`:**

```json
{ "error": "Failed to fetch cars data" }
```

---

### Add a Car

```
POST /all-cars
```

Creates a new car listing in the database.

**Authentication:** **Required**

**Request Body (JSON):**

| Field | Type | Description |
| --- | --- | --- |
| `Name` | string | Car name (e.g. "Toyota Corolla") |
| `RentPrice` | string/number | Daily rental price in USD |
| `BookBy` | number | Number of times booked (initialise to `0`) |
| `Type` | string | Car category: `SUV`, `Sedan`, `Hatchback`, `Luxury`, `Sports` |
| `ImgURL` | string | URL of the uploaded car image |
| `Capacity` | string/number | Seat capacity |
| `PickupLocation` | string | Pickup location name |
| `Description` | string | Car description (max 170 characters recommended) |
| `Status` | string | Availability: `"Available"` or `"Unavailable"` |
| `userId` | string | ID of the authenticated user submitting the listing |
| `UserListedCar` | boolean | Always `true` for user-submitted cars |

**Example Request Body:**

```json
{
  "Name": "BMW X5",
  "RentPrice": "200",
  "BookBy": 0,
  "Type": "SUV",
  "ImgURL": "https://i.ibb.co/example/bmw-x5.jpg",
  "Capacity": "7",
  "PickupLocation": "Chittagong",
  "Description": "Luxury SUV with panoramic sunroof and leather seats.",
  "Status": "Available",
  "userId": "user_abc123",
  "UserListedCar": true
}
```

**Success Response — `200 OK`:**

```json
{
  "acknowledged": true,
  "insertedId": "664f1a2b3c4d5e6f7a8b9c0d"
}
```

**Error Response — `401 Unauthorized`** (missing/invalid token):

```json
{ "message": "Unauthorized" }
```

---

### List Available Cars

```
GET /available-cars
```

Returns up to 6 cars with `Status: "Available"`. Used by the home page to populate the "Available Cars" section.

**Authentication:** Not required

**Success Response — `200 OK`:**

Array of up to 6 car objects (same schema as `GET /all-cars`).

---

### Get Car by ID

```
GET /all-cars/:id
```

Returns a single car document by its MongoDB `_id`.

**Authentication:** Not required

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | string | MongoDB ObjectId of the car |

**Success Response — `200 OK`:**

```json
{
  "_id": "664f1a2b3c4d5e6f7a8b9c0d",
  "Name": "Tesla Model 3",
  "RentPrice": "120",
  "BookBy": 5,
  "Type": "Sedan",
  "ImgURL": "https://example.com/tesla.jpg",
  "Capacity": "5",
  "PickupLocation": "Dhaka",
  "Description": "Electric sedan with autopilot.",
  "Status": "Available",
  "userId": "user_abc123",
  "UserListedCar": true
}
```

Returns `null` if no car matches the given ID.

---

### Get Cars Added by a User

```
GET /added-cars/:userId
```

Returns all cars whose `userId` field matches the given user ID.

**Authentication:** **Required**

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `userId` | string | Better Auth user ID |

**Success Response — `200 OK`:**

Array of car objects belonging to the specified user.

---

### Delete a Car

```
DELETE /all-cars/:id
```

Permanently removes a car document from the database.

**Authentication:** Not required *(see note below)*

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | string | MongoDB ObjectId of the car to delete |

**Success Response — `200 OK`:**

```json
{
  "acknowledged": true,
  "deletedCount": 1
}
```

> **Note:** This endpoint does not require authentication in the current implementation. Any client that knows a car's ID can delete it.

---

### Update a Car

```
PATCH /all-cars/:carId
```

Applies partial updates to a car document using `$set`. Only the fields provided in the request body are modified.

**Authentication:** Not required *(see note below)*

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `carId` | string | MongoDB ObjectId of the car to update |

**Request Body (JSON):**

Any subset of car fields. The `UpdateAddedCar` component sends the following fields:

```json
{
  "RentPrice": "150",
  "Type": "Luxury",
  "ImgURL": "https://i.ibb.co/new-image.jpg",
  "PickupLocation": "Sylhet",
  "Description": "Updated description here.",
  "Status": "Unavailable"
}
```

**Success Response — `200 OK`:**

```json
{
  "acknowledged": true,
  "matchedCount": 1,
  "modifiedCount": 1,
  "upsertedId": null
}
```

> **Note:** This endpoint does not require authentication in the current implementation.

---

## Bookings Endpoints

### Create a Booking

```
POST /all-bookings
```

Records a new booking and increments the booked car's `BookBy` counter.

**Authentication:** Not required *(see note below)*

**Request Body (JSON):**

| Field | Type | Description |
| --- | --- | --- |
| `CarName` | string | Name of the booked car |
| `TotalPrice` | string/number | Daily rental price at time of booking |
| `BookingDate` | string (ISO 8601) | Timestamp of the booking (`new Date()` from client) |
| `CarId` | string | MongoDB ObjectId of the booked car |
| `userId` | string | Better Auth user ID of the booking user |
| `DriverNeeded` | string | `"Yes"` or `"No"` |
| `SpecialNote` | string | Free-text special request from the user |

**Example Request Body:**

```json
{
  "CarName": "Tesla Model 3",
  "TotalPrice": "120",
  "BookingDate": "2026-10-19T06:00:00.000Z",
  "CarId": "664f1a2b3c4d5e6f7a8b9c0d",
  "userId": "user_abc123",
  "DriverNeeded": "No",
  "SpecialNote": "Please have the car ready by 9am."
}
```

**Success Response — `200 OK`:**

```json
{
  "acknowledged": true,
  "insertedId": "664f9z8y7x6w5v4u3t2s1r0q"
}
```

> **Side effect:** On successful insertion, `carsCollection.updateOne()` increments `BookBy` by `+1` on the car matching `CarId`.

> **Note:** This endpoint does not currently require authentication. The `userId` in the request body is trusted as provided by the client.

---

### Get Bookings by User

```
GET /all-bookings/:userId
```

Returns all booking records for a specific user.

**Authentication:** **Required**

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `userId` | string | Better Auth user ID |

**Success Response — `200 OK`:**

```json
[
  {
    "_id": "664f9z8y7x6w5v4u3t2s1r0q",
    "CarName": "Tesla Model 3",
    "TotalPrice": "120",
    "BookingDate": "2026-10-19T06:00:00.000Z",
    "CarId": "664f1a2b3c4d5e6f7a8b9c0d",
    "userId": "user_abc123",
    "DriverNeeded": "No",
    "SpecialNote": "Please have the car ready by 9am."
  }
]
```

---

## Health Check

```
GET /
```

Returns a plain-text confirmation that the server is running.

**Authentication:** Not required

**Response — `200 OK`:**

```
DriveFleet Server is running...
```

---

## Error Responses Summary

| HTTP Status | Scenario |
| --- | --- |
| `200 OK` | All successful responses (including empty arrays) |
| `401 Unauthorized` | Missing or malformed `Authorization` header |
| `403 Forbidden` | JWT token present but invalid or expired |
| `404 Not Found` | Car fetch query fails (only on `GET /all-cars`) |

> The backend does not implement a consistent global error handler. Most controller functions do not have try/catch blocks and will let Express propagate unhandled errors as 500 responses.
