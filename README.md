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
<img width="1920" height="1080" alt="Screenshot (3)" src="https://github.com/user-attachments/assets/17c4d52a-aadf-4fbe-9506-5d1f895ac9b6" />
<img width="1920" height="1080" alt="Screenshot (2)" src="https://github.com/user-attachments/assets/c3c08087-d68e-4135-821d-1fc1c641d0e8" />
<img width="1920" height="1080" alt="Screenshot (4)" src="https://github.com/user-attachments/assets/098fb5c6-2cfd-4481-9f3a-833d29e8e148" />
<img width="1920" height="1080" alt="Screenshot (5)" src="https://github.com/user-attachments/assets/a28e0c51-5ec7-4644-92dd-2d3581c3616a" />
<img width="1920" height="1080" alt="Screenshot (6)" src="https://github.com/user-attachments/assets/46a3782a-10bf-459b-a888-8575c184ec3c" />
<img width="1920" height="1080" alt="Screenshot (7)" src="https://github.com/user-attachments/assets/f6271beb-0bf5-4d16-a0a3-2ce8b730dba4" />
<img width="1920" height="1080" alt="Screenshot (8)" src="https://github.com/user-attachments/assets/55a29a5e-dae7-419e-9e07-f8d9fb79f2f0" />
<img width="1920" height="1080" alt="Screenshot (9)" src="https://github.com/user-attachments/assets/489efa84-87d0-47cd-8521-bf50b5e80f3d" />
<img width="1920" height="1080" alt="Screenshot (10)" src="https://github.com/user-attachments/assets/39d3b819-1e2c-4c82-8d51-e0905b4ef43c" />
<img width="1920" height="1080" alt="Screenshot (11)" src="https://github.com/user-attachments/assets/fe29186f-d2ce-465a-9f1e-f7963123c83a" />
<img width="1920" height="1080" alt="Screenshot (12)" src="https://github.com/user-attachments/assets/7ec5f324-e6e1-4575-a3cb-3aed1fc93b9f" />
<img width="1920" height="1080" alt="Screenshot (13)" src="https://github.com/user-attachments/assets/394030c2-1649-466a-9312-685ed704a20a" />
<img width="1920" height="1080" alt="Screenshot (13)" src="https://github.com/user-attachments/assets/9712f899-c1ad-44cc-9791-c85e079a3cac" />
<img width="1920" height="1080" alt="Screenshot (14)" src="https://github.com/user-attachments/assets/50139dda-5989-4f11-a794-f257a64ef9ab" />
<img width="1920" height="1080" alt="Screenshot (15)" src="https://github.com/user-attachments/assets/75280baa-d4d7-4439-9eff-dc958470f15a" />
<img width="1920" height="1080" alt="Screenshot (16)" src="https://github.com/user-attachments/assets/370401e0-f4dc-4d3b-9a12-0294e7990f58" />
<img width="1920" height="1080" alt="Screenshot (17)" src="https://github.com/user-attachments/assets/1965c046-b938-461d-a5f9-72c4418e6541" />
<img width="1920" height="1080" alt="Screenshot (18)" src="https://github.com/user-attachments/assets/5e116560-04f1-47b6-a83e-4b0187d2c7b2" />
<img width="1920" height="1080" alt="Screenshot (19)" src="https://github.com/user-attachments/assets/1e18daf4-9be8-4fe5-a6bb-0964bb2c3556" />
<img width="1920" height="1080" alt="Screenshot (20)" src="https://github.com/user-attachments/assets/d7cfe826-bac3-4a94-a689-1b203a2a345e" />
<img width="1920" height="1080" alt="Screenshot (21)" src="https://github.com/user-attachments/assets/5a5e4ec7-f05b-46a2-a1fd-0083bdf4bd4f" />
<img width="1920" height="1080" alt="Screenshot (22)" src="https://github.com/user-attachments/assets/3fa38376-9528-4103-9067-d2af7deab9c5" />
<img width="1920" height="1080" alt="Screenshot (23)" src="https://github.com/user-attachments/assets/9c86b555-f71f-4dae-bd94-c271e72f2e4a" />
<img width="1920" height="1080" alt="Screenshot (24)" src="https://github.com/user-attachments/assets/0abf5e2d-47f9-4ce6-a768-cc9a237f3274" />
















