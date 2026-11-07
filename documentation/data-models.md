# Data Models

This document describes the MongoDB collections used by DriveFleet, their field schemas, and the relationships between them. All data is stored in **MongoDB Atlas**.

---

## Databases

DriveFleet uses two separate MongoDB databases:

| Database | Purpose | Managed By |
| --- | --- | --- |
| `drive-fleet` | Application data (cars, bookings) | Application code |
| `drive-fleet-auth` | Authentication data (users, sessions, accounts) | Better Auth |

---

## `drive-fleet` Database

### Collection: `all-cars`

Stores every car listing — both platform-added cars and user-listed cars.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `_id` | ObjectId | Auto | MongoDB-generated unique identifier |
| `Name` | string | Yes | Car name (e.g. `"Tesla Model 3"`) |
| `RentPrice` | string | Yes | Daily rental price in USD (stored as a string from the form input) |
| `BookBy` | number | Yes | Count of how many times this car has been booked; starts at `0` |
| `Type` | string | Yes | Vehicle category: one of `SUV`, `Sedan`, `Hatchback`, `Luxury`, `Sports` |
| `ImgURL` | string | Yes | Full URL of the car image (hosted on ImgBB) |
| `Capacity` | string | Yes | Seat capacity (stored as a string from the form input) |
| `PickupLocation` | string | Yes | Pickup location name (e.g. `"Dhaka"`) |
| `Description` | string | Yes | Free-text car description (up to 170 characters recommended) |
| `Status` | string | Yes | Availability status: `"Available"` or `"Unavailable"` |
| `userId` | string | Conditional | Better Auth user ID of the user who listed this car. Present only on user-listed cars. |
| `UserListedCar` | boolean | Conditional | `true` when the car was added by a user via the "Add Car" form. Absent on platform-added cars. |

**Example Document:**

```json
{
  "_id": { "$oid": "664f1a2b3c4d5e6f7a8b9c0d" },
  "Name": "BMW X5",
  "RentPrice": "200",
  "BookBy": 3,
  "Type": "SUV",
  "ImgURL": "https://i.ibb.co/example/bmw-x5.jpg",
  "Capacity": "7",
  "PickupLocation": "Chittagong",
  "Description": "Luxury SUV with panoramic sunroof and heated leather seats.",
  "Status": "Available",
  "userId": "user_abc123xyz",
  "UserListedCar": true
}
```

**Notes:**

- `RentPrice` and `Capacity` are strings because they are submitted directly from HTML form inputs. Consumers should parse them to numbers when performing arithmetic.
- The `BookBy` field is incremented atomically (via `$inc`) by the bookings controller each time a new booking is created for this car.
- `userId` and `UserListedCar` are absent on cars that were pre-seeded into the database directly, rather than added through the user interface.
- There is no referential integrity constraint between `userId` in this collection and the `user` collection in `drive-fleet-auth`.

---

### Collection: `drive-fleet-bookings`

Stores each confirmed car booking submitted by an authenticated user.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `_id` | ObjectId | Auto | MongoDB-generated unique identifier |
| `CarName` | string | Yes | Name of the booked car (denormalised from `all-cars.Name` at booking time) |
| `TotalPrice` | string | Yes | Daily price at the time of booking (denormalised from `all-cars.RentPrice`) |
| `BookingDate` | string (ISO 8601) | Yes | Timestamp of when the booking was created (`new Date()` serialised as ISO string) |
| `CarId` | string | Yes | The `_id` string of the booked car in `all-cars` |
| `userId` | string | Yes | Better Auth user ID of the user who made the booking |
| `DriverNeeded` | string | Yes | User's driver preference: `"Yes"` or `"No"` |
| `SpecialNote` | string | Yes | Free-text special requests or instructions from the user |

**Example Document:**

```json
{
  "_id": { "$oid": "664f9z8y7x6w5v4u3t2s1r0q" },
  "CarName": "BMW X5",
  "TotalPrice": "200",
  "BookingDate": "2026-10-19T06:30:00.000Z",
  "CarId": "664f1a2b3c4d5e6f7a8b9c0d",
  "userId": "user_abc123xyz",
  "DriverNeeded": "No",
  "SpecialNote": "Please deliver to Dhaka Airport, Terminal 2."
}
```

**Notes:**

- Car name and price are **denormalised** into the booking document. This means bookings capture the price at the time of booking, but if the car's name or price is later updated via `PATCH /all-cars/:id`, the booking record is not retroactively updated.
- `CarId` is stored as a plain **string** (not a MongoDB ObjectId type). The bookings controller converts it to `ObjectId` when performing the `$inc` update on `all-cars`.
- There is no pricing calculation beyond the daily rate — taxes, fees, and duration multipliers are noted in the UI as "Calculated at checkout" but are not implemented.

---

## `drive-fleet-auth` Database

This database is managed entirely by Better Auth's MongoDB adapter. The application does not write to it directly.

### Collection: `user`

Stores registered user accounts.

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Better Auth-generated user identifier (used as `userId` in app collections) |
| `name` | string | User's display name |
| `email` | string | User's email address (unique) |
| `emailVerified` | boolean | Whether the email has been verified |
| `image` | string | URL of the user's profile photo (hosted on ImgBB) |
| `createdAt` | Date | Account creation timestamp |
| `updatedAt` | Date | Last update timestamp |

### Collection: `session`

Tracks active sessions for cookie caching and session invalidation.

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Session identifier |
| `userId` | string | Reference to the user's `id` in the `user` collection |
| `expiresAt` | Date | Session expiry (5 days from creation) |
| `token` | string | Unique session token |
| `createdAt` | Date | Session creation timestamp |
| `updatedAt` | Date | Last update timestamp |

### Collection: `account`

Links user accounts to OAuth providers (e.g. Google).

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Account record identifier |
| `userId` | string | Reference to the user's `id` in the `user` collection |
| `providerId` | string | OAuth provider name (e.g. `"google"`) |
| `accountId` | string | The user's identifier within the OAuth provider |
| `accessToken` | string | OAuth access token (provider-issued) |
| `refreshToken` | string | OAuth refresh token, if provided |
| `createdAt` | Date | Record creation timestamp |
| `updatedAt` | Date | Last update timestamp |

> The exact schema of `drive-fleet-auth` collections may vary between Better Auth versions. Refer to the Better Auth documentation for the authoritative schema.

---

## Collection Relationships

```
drive-fleet-auth.user.id
        │
        ├──── drive-fleet.all-cars.userId  (user's listed cars)
        │
        └──── drive-fleet-bookings.userId  (user's bookings)

drive-fleet.all-cars._id (as string)
        │
        └──── drive-fleet.drive-fleet-bookings.CarId  (car reference in booking)
```

These relationships are enforced only by application logic, not by MongoDB foreign keys or indexes. No cascading deletes are implemented: if a car is deleted, its associated bookings remain in `drive-fleet-bookings`.

---

## Indexes

No explicit indexes beyond the default `_id` index are defined in the application code. For production use, the following indexes would be beneficial:

| Collection | Field | Reason |
| --- | --- | --- |
| `all-cars` | `Status` | Speeds up `GET /available-cars` queries |
| `all-cars` | `Name` | Speeds up the `$regex` search in `GET /all-cars?search=` |
| `all-cars` | `Type` | Speeds up type-filter queries |
| `all-cars` | `userId` | Speeds up `GET /added-cars/:userId` |
| `drive-fleet-bookings` | `userId` | Speeds up `GET /all-bookings/:userId` |
