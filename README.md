# Compass Web Monorepo

## Local development
1. Install dependencies:
   - `npm install`
2. Create environment files:
   - `apps/site/.env.local`
   - `apps/admin/.env.local`
3. Add local API URL:
   - `NEXT_PUBLIC_API_URL=http://localhost:4000`
4. Run both apps:
   - `npm run dev`

Backend (optional for local API stubs):
- `npm run dev:backend`
- or run everything together: `npm run dev:all`

Backend environment:
- Copy `backend/.env.example` to `backend/.env`
- Set `MONGO_URI`
- Optional: `UPLOADS_DIR`, `UPLOADS_URL_PREFIX`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`

Ports:
- Marketing site: `http://localhost:3000`
- Admin panel: `http://localhost:3001`
- Backend API: `http://localhost:4000`

## Environment variables
Local (development):
- `NEXT_PUBLIC_API_URL=http://localhost:4000`

Production (later):
- `NEXT_PUBLIC_API_URL=https://api.compassdigitalservices.com`

## Build & static export
Build both apps:
- `npm run build`

Export static HTML:
- `npm run export`

Static output folders:
- `apps/site/out`
- `apps/admin/out`

Per app:
- `npm run build --workspace apps/site`
- `npm run export --workspace apps/site`
- `npm run build --workspace apps/admin`
- `npm run export --workspace apps/admin`

## Hostinger upload steps
1. Build + export both apps.
2. Upload contents of `apps/site/out` to the marketing hosting root for `compassdigitalservices.com`.
3. Upload contents of `apps/admin/out` to the admin hosting root for `admin.compassdigitalservices.com`.
4. Add the `.htaccess` below to each hosting root to support SPA routing.

`.htaccess`
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Notes on cookies, CORS, HTTPS, subdomains
- Admin auth uses HttpOnly cookies; all admin fetches include credentials.
- Backend must allow CORS for:
  - `http://localhost:3000`
  - `http://localhost:3001`
  - `https://compassdigitalservices.com`
  - `https://admin.compassdigitalservices.com`
- Production cookies must be:
  - `HttpOnly`, `Secure=true`, `SameSite=None`, `Domain=.compassdigitalservices.com`
- Always serve admin + site over HTTPS in production.

## Static export notes
- Dynamic marketing routes (`/services/[slug]`, `/portfolio/[slug]`, `/packages/[slug]`, `/review/[token]`) are pre-generated from `apps/site/lib/data.ts`.
- To add more slugs or review tokens, update that data file or fetch a list during build, then re-run `npm run export`.
- Middleware is not used because static export runs without a Next.js server; client-side auth guard handles admin access via `/auth/me`.
