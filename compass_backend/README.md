# Backend

Local API stub for frontend development.

## Setup
1. Copy `.env.example` to `.env` and set:
   - `MONGO_URI`
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD`
   - (optional) `UPLOADS_DIR` and `UPLOADS_URL_PREFIX` to control where and under which path uploads are served
2. Install dependencies from repo root:
   - `npm install`
3. Start the API:
   - `npm run dev:backend`

Uploads are served from `http://localhost:4000/<UPLOADS_URL_PREFIX>` (defaults to `/uploads`), and the API listens on `http://localhost:4000` by default.
