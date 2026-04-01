# Finance Dashboard Backend API

A robust, production-ready RESTful backend for a finance dashboard system built with **Node.js**, **Express 5**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**. Features role-based access control (RBAC), JWT authentication, comprehensive input validation, and aggregated dashboard analytics.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Role Permissions Matrix](#role-permissions-matrix)
- [Error Handling](#error-handling)
- [Optional Enhancements](#optional-enhancements)
- [Testing](#testing)
- [Assumptions & Tradeoffs](#assumptions--tradeoffs)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express 5 |
| ORM | Prisma |
| Database | PostgreSQL (Supabase) |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Validation | Zod |
| Testing | Jest + ts-jest |

---

## Architecture

The project follows a **layered architecture** with clear separation of concerns:

```
src/
├── config/           # Environment configuration
├── controllers/      # HTTP request handlers
├── middlewares/       # Auth, authorization, validation, rate limiting, error handling
├── prisma/           # Prisma client singleton
├── repositories/     # Data access layer (Prisma queries)
├── routes/           # Express route definitions
├── services/         # Business logic layer
├── types/            # TypeScript type augmentations
├── utils/            # Shared utilities (JWT, hashing, error classes)
├── validators/       # Zod validation schemas
├── __tests__/        # Unit tests
├── app.ts            # Express app setup
└── server.ts         # Server entry point
```

**Data flow:** `Route → Middleware → Controller → Service → Repository → Database`

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or a Supabase account)

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd finance-backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your database URL and JWT secret

# 4. Generate Prisma client
npx prisma generate

# 5. Push schema to database
npx prisma db push

# 6. Start the development server
npm run dev
```

The server will start at `http://localhost:3000`.

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Generate Prisma client + compile TypeScript |
| `npm start` | Start production server |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:push` | Push schema changes to DB |
| `npm run db:studio` | Open Prisma Studio GUI |

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT signing | ✅ |
| `PORT` | Server port (default: 3000) | ❌ |
| `NODE_ENV` | Environment (development/production) | ❌ |

---

## Database Schema

### User

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| email | String | Unique email address |
| name | String | Display name |
| password | String | Bcrypt-hashed password |
| role | Enum | VIEWER, ANALYST, or ADMIN |
| isActive | Boolean | Account active status |
| createdAt | DateTime | Account creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### FinancialRecord

| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| amount | Float | Transaction amount |
| type | Enum | INCOME or EXPENSE |
| category | String | Transaction category |
| date | DateTime | Transaction date |
| notes | String? | Optional description |
| userId | UUID | Foreign key to User |
| isDeleted | Boolean | Soft delete flag |
| deletedAt | DateTime? | Soft delete timestamp |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

---

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Health Check

```
GET /
GET /health
```

---

### Authentication

#### Register a new user

```
POST /api/auth/signup
```

**Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123",
  "role": "VIEWER"          // optional, defaults to VIEWER
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": "...", "email": "...", "name": "...", "role": "VIEWER", ... },
    "token": "eyJhbGciOi..."
  }
}
```

#### Login

```
POST /api/auth/login
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK` — returns user object and JWT token.

---

### Financial Records

> All record endpoints require `Authorization: Bearer <token>` header.

#### Create Record (Admin only)

```
POST /api/records
```

**Body:**
```json
{
  "amount": 5000,
  "type": "INCOME",
  "category": "Salary",
  "date": "2025-01-15T00:00:00.000Z",
  "notes": "Monthly salary"
}
```

**Response:** `201 Created`

#### List Records (Admin, Analyst)

```
GET /api/records?page=1&limit=10&type=INCOME&category=Salary&startDate=2025-01-01&endDate=2025-12-31&search=salary
```

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10, max: 100) |
| type | string | Filter: INCOME or EXPENSE |
| category | string | Filter by exact category |
| startDate | string | Filter: records on or after this date |
| endDate | string | Filter: records on or before this date |
| search | string | Search in notes (case-insensitive) |

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

#### Get Record by ID (Admin, Analyst)

```
GET /api/records/:id
```

#### Update Record (Admin only)

```
PUT /api/records/:id
```

**Body:** (all fields optional)
```json
{
  "amount": 6000,
  "notes": "Updated salary amount"
}
```

#### Delete Record — Soft Delete (Admin only)

```
DELETE /api/records/:id
```

---

### Dashboard

> All dashboard endpoints require `Authorization: Bearer <token>` header.

#### Summary (All roles)

```
GET /api/dashboard/summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 50000,
    "totalExpense": 20000,
    "netBalance": 30000
  }
}
```

#### Category-wise Breakdown (Admin, Analyst)

```
GET /api/dashboard/category-wise
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "category": "Food", "type": "EXPENSE", "_sum": { "amount": 5000 } },
    { "category": "Salary", "type": "INCOME", "_sum": { "amount": 30000 } }
  ]
}
```

#### Monthly Trends (Admin, Analyst)

```
GET /api/dashboard/monthly-trends
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "month": "2025-01", "type": "INCOME", "total": 15000 },
    { "month": "2025-01", "type": "EXPENSE", "total": 8000 }
  ]
}
```

#### Recent Activity (All roles)

```
GET /api/dashboard/recent-activity
```

Returns the 10 most recent financial records.

---

### User Management (Admin only)

#### List All Users

```
GET /api/users
```

#### Get User by ID

```
GET /api/users/:id
```

#### Update User Role

```
PATCH /api/users/:id/role
```

**Body:**
```json
{ "role": "ANALYST" }
```

#### Update User Status

```
PATCH /api/users/:id/status
```

**Body:**
```json
{ "isActive": false }
```

---

## Role Permissions Matrix

| Action | Viewer | Analyst | Admin |
|---|:---:|:---:|:---:|
| View dashboard summary | ✅ | ✅ | ✅ |
| View recent activity | ✅ | ✅ | ✅ |
| View category breakdown | ❌ | ✅ | ✅ |
| View monthly trends | ❌ | ✅ | ✅ |
| List/view records | ❌ | ✅ | ✅ |
| Create records | ❌ | ❌ | ✅ |
| Update records | ❌ | ❌ | ✅ |
| Delete records | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## Error Handling

The API uses a centralized error handling middleware that returns consistent error responses:

```json
{
  "success": false,
  "message": "Description of what went wrong",
  "errors": [...]    // present only for validation errors
}
```

### HTTP Status Codes Used

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (insufficient role permissions) |
| 404 | Resource Not Found |
| 409 | Conflict (e.g., duplicate email) |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

### Error types handled:
- **Zod validation errors** — returns all field-level errors
- **AppError** — custom application errors with proper status codes
- **Prisma errors** — unique constraint violations (P2002), not found (P2025)
- **JWT errors** — expired or malformed tokens
- **Unknown errors** — stack traces hidden in production

---

## Optional Enhancements

All of the following optional features have been implemented:

- ✅ **JWT Authentication** — token-based auth with 7-day expiry
- ✅ **Pagination** — page/limit with total count metadata
- ✅ **Search** — case-insensitive search in record notes
- ✅ **Soft Delete** — records are marked as deleted, not removed
- ✅ **Rate Limiting** — in-memory rate limiter (100 req/15 min per IP)
- ✅ **Unit Tests** — Jest tests for services and middlewares
- ✅ **Input Validation** — Zod schemas on all endpoints
- ✅ **API Documentation** — this README

---

## Testing

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch
```

Tests cover:
- **Auth Service** — signup, login, duplicate email, wrong password, inactive user
- **Record Service** — CRUD, filtering, pagination, search, ownership, soft delete
- **Dashboard Service** — summary, category-wise, monthly trends, recent activity
- **Middlewares** — auth, authorize, validate

---

## Assumptions & Tradeoffs

1. **Password security**: Passwords are hashed with bcrypt (10 salt rounds). The password field is never returned in API responses.

2. **Role assignment**: New users default to `VIEWER` role. Only admins can change roles via `PATCH /api/users/:id/role`.

3. **Inactive users**: Deactivated users cannot log in but their data is preserved. Only admins can reactivate accounts.

4. **Soft delete**: Financial records are soft-deleted (marked with `isDeleted` flag). They are excluded from all queries but remain in the database for audit purposes.

5. **Rate limiting**: Uses a simple in-memory store. In a production multi-instance deployment, this should be replaced with Redis-backed rate limiting.

6. **Monthly trends**: Uses PostgreSQL's `DATE_TRUNC('month', date)` via raw SQL for accurate monthly grouping, rather than Prisma's `groupBy` which would group by exact date.

7. **Record ownership**: Records are scoped to the authenticated user. Each user can only see/manage their own financial records.

8. **Login error messages**: Uses generic "Invalid email or password" to prevent user enumeration attacks.

9. **Token expiry**: JWTs expire after 7 days. No refresh token mechanism is implemented — this would be a production enhancement.

10. **Database**: Uses PostgreSQL hosted on Supabase with Prisma ORM. Schema lives in a dedicated `fin_dash` schema namespace.
