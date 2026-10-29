# HarEvent API Documentation

Base URL: `http://localhost:5000/api`
All bodies are JSON. Protected routes need `Authorization: Bearer <token>`.

Every response has `success` (boolean). Errors return `message`, and validation errors also return `errors: [{ field, message }]`.

## Auth

### POST /auth/register
Body: `{ "name": "Asha Patil", "email": "asha@example.com", "password": "Passw0rdX" }`
Rules: name 2–60 chars, valid email, password ≥ 8 chars with a letter and a number.
- `201` `{ success, message, token, user: { id, name, email, role } }`
- `400` validation failed · `409` email already registered

### POST /auth/login
Body: `{ "email": "...", "password": "..." }`
- `200` `{ success, message, token, user }`
- `400` validation failed · `401` invalid email or password

### GET /auth/me  🔒
- `200` `{ success, user }` · `401` missing/invalid token

## Categories

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/categories` | Public | List all categories |
| GET | `/categories/:id` | Public | Get one category |
| POST | `/categories` | Admin | Create. Body: `{ name, description? }` |
| PUT | `/categories/:id` | Admin | Update name/description |
| DELETE | `/categories/:id` | Admin | Delete (409 if vendors use it) |

Errors: `400` validation/invalid id · `401` no token · `403` not admin · `404` not found · `409` duplicate name or category in use.

## Vendors

### GET /vendors  (public) — search & filter
Query params (all optional):

| Param | Description |
|---|---|
| `category` | Category id **or** name (e.g. `Weddings`) |
| `location` | Case-insensitive partial match (e.g. `pune`) |
| `q` | Partial match on vendor name |
| `page` | Default 1 |
| `limit` | Default 10, max 50 |

Example: `GET /vendors?category=Weddings&location=Pune&page=1&limit=10`
Response: `{ success, count, total, page, pages, data: [vendor] }`

### GET /vendors/:id  (public)
`200` vendor with populated category · `400` invalid id · `404` not found

### POST /vendors  🔒
Body:
```json
{
  "name": "Royal Caterers",
  "category": "<categoryId>",
  "location": "Pune",
  "description": "Wedding and party catering",
  "contactEmail": "royal@example.com",
  "contactPhone": "+91 98765 43210",
  "priceRange": "standard"
}
```
Required: `name`, `category`, `location`. `priceRange`: `budget | standard | premium`.
`201` created · `400` validation / category doesn't exist · `401` no token

### PUT /vendors/:id  🔒
Any subset of the create fields. Only the creator or an admin.
`200` updated · `400` · `401` · `403` not owner · `404`

### DELETE /vendors/:id  🔒
Only the creator or an admin. `200` deleted · `401` · `403` · `404`

## Status codes used
`200` OK · `201` Created · `400` Bad request/validation · `401` Unauthenticated · `403` Forbidden · `404` Not found · `409` Conflict · `500` Server error
