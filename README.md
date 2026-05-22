# Gyanodaya Backend

Production-style Node.js + Express + MongoDB backend scaffold for an EdTech mock test mobile app.

## Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT access/refresh auth
- bcryptjs
- Multer uploads
- Firebase push notification service scaffold
- Google Sign-In verification
- Swagger docs
- Helmet, rate limiting, logging, compression, validation

## Architecture

Hybrid clean architecture + MVC:

- `src/controllers` handles request/response orchestration
- `src/services` holds business logic
- `src/repositories` abstracts data access
- `src/models` defines Mongoose schemas
- `src/routes/v1` maps REST endpoints
- `src/middlewares` centralizes security, validation, errors, uploads
- `src/utils` and `src/config` hold shared infrastructure

## Key APIs

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/google-signin`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/verify-otp`
- `POST /api/v1/auth/reset-password`
- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/auth/logout`
- `GET /api/v1/users/profile`
- `PATCH /api/v1/users/profile`
- `POST /api/v1/users/profile/image`
- `GET /api/v1/teachers`
- `GET /api/v1/courses`
- `GET /api/v1/mock-tests`
- `POST /api/v1/mock-tests/:mockTestId/start`
- `PATCH /api/v1/mock-tests/sessions/:sessionId/answer`
- `POST /api/v1/mock-tests/sessions/:sessionId/submit`
- `GET /api/v1/results/my`
- `GET /api/v1/results/leaderboard/:mockTestId`
- `GET /api/v1/admin/dashboard`

## Setup

1. Copy `.env.example` to `.env`
2. Install dependencies with `npm install`
3. Start with `npm run dev`
4. Open Swagger at `/docs`

## Notes

- Notification delivery is scaffolded for phase 2 through Firebase Admin.
- Legacy prototype files in `routes/`, `middleware/`, and `db.js` are no longer used by `server.js`.
