# HarEvent Backend — Event & Vendor Marketplace API

REST API for HarEvent, a platform where users discover and manage event vendors.
Built with **Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, express-validator**.

## Features

- Signup / login with input validation, bcrypt-hashed passwords and JWT auth
- Vendor CRUD (create/update/delete require login; only the owner or an admin can modify)
- Event categories (Weddings, Birthdays, Corporate Events, Parties) managed by admins
- Search & filter vendors by category (id or name), location, keyword, with pagination
- Consistent JSON responses and clear error messages (400 / 401 / 403 / 404 / 409)

## Prerequisites

- Node.js 18+
- MongoDB running locally, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

## Setup

```bash
git clone <your-repo-url>
cd harevent-backend
npm install
cp .env.example .env        # then edit JWT_SECRET (and MONGO_URI if needed)
npm run seed                # creates the 4 default categories + an admin user
npm start                   # or: npm run dev
```

Server runs at `http://localhost:5000`. Health check: `GET /api/health`.

### Environment variables

| Variable | Description | Default / example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/harevent` |
| `JWT_SECRET` | Secret used to sign tokens (required) | long random string |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Optional, used by `npm run seed` | `admin@harevent.com` / `Admin1234` |

> Change the default admin password outside of local testing.

## Project structure

```
src/
  config/db.js            MongoDB connection
  models/                 User, Vendor, Category schemas
  controllers/            Request handlers
  routes/                 Routes + validation rules
  middleware/             auth (JWT), validate, errorHandler
  app.js                  Express app
  server.js               Entry point
  seed.js                 Seeds categories + admin
postman/HarEvent.postman_collection.json
docs/API.md               Endpoint documentation
```

## Database schema

**User**: `name`, `email` (unique), `password` (bcrypt hash, never returned), `role` (`user` | `admin`), timestamps
**Category**: `name` (unique), `description`, timestamps
**Vendor**: `name`, `description`, `category` (ref Category), `location`, `contactEmail`, `contactPhone`, `priceRange` (`budget` | `standard` | `premium`), `createdBy` (ref User), timestamps

## API documentation

See [docs/API.md](docs/API.md).

## Testing with Postman

1. Import `postman/HarEvent.postman_collection.json`.
2. Make sure the server is running and `npm run seed` has been executed.
3. Run the collection in order (Collection Runner). It stores the tokens and ids automatically
   (`adminToken`, `userToken`, `categoryId`, `vendorId`) and each request has test scripts
   covering both success and failure cases.

## Design notes

- Users cannot choose their own role at signup; admins come from the seed script only.
- Category deletion is blocked while vendors still use that category.
- Vendor search uses escaped, case-insensitive regex so user input can't inject patterns.
<img width="1920" height="1080" alt="Screenshot (1)" src="https://github.com/user-attachments/assets/87d77a94-5199-4b30-ad59-29b9146fd1be" />
