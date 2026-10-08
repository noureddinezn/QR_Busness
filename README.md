# Universal QR Digital Profile Platform

This is a local MVP for a universal QR digital profile and QR management platform.

## What Are We Building?

This project is a universal QR profile platform. A user can create a public page such as `/p/techzone`, add unlimited links, choose a theme, and generate one stable QR code that always points to the public page.

The MVP includes:

- Laravel REST API in `backend`
- Vue 3 frontend in `frontend`
- PostgreSQL configuration for `localhost:5432`
- Sanctum token authentication
- Dashboard, page editor, links, live phone preview, public profile, QR manager, analytics, settings, and admin panel
- Database design for `users`, `pages`, `links`, `qr_codes`, `scans`, and `link_clicks`
- Architecture diagrams in `docs/`

## Why This Architecture?

The app has two sides:

- Vue owns the browser experience.
- Laravel owns validation, database access, API responses, files, auth, and later QR generation.

This separation keeps the public profile fast, the dashboard reactive, and the API responsible for validation, ownership, and persistence.

## How Laravel Connects To Vue

Vue runs locally at:

```bash
http://localhost:5173
```

Laravel runs locally at:

```bash
http://localhost:8000
```

The frontend stores the API URL in `frontend/.env`:

```bash
VITE_API_URL=/api
```

Axios uses that value in `frontend/src/services/api.js`, then calls Laravel routes such as:

```bash
GET http://localhost:8000/api/health
```

## Database Relationship Design

Current relationships:

- `User hasMany Pages`
- `Page belongsTo User`
- `Page hasMany Links`
- `Link belongsTo Page`
- `Page hasMany QrCodes`
- `Page hasMany Scans`
- `Link hasMany LinkClicks`

Current foundation fields:

- `users`: name, email, password, role, active status
- `pages`: title, slug, bio, logo, optional cover image, theme, optional colors, active status
- `links`: type, title, URL, optional icon, position, active status

The important design decision is that social/contact/menu/review links do not live as separate columns on `pages`. They live in a generic `links` table, which keeps the system flexible for WhatsApp, Instagram, Google Maps, PDFs, menus, booking links, payment links, and custom URLs.

## Project Documentation

Architecture notes:

```bash
docs/architecture.md
```

PlantUML diagrams:

```bash
docs/diagrams/use-cases.puml
docs/diagrams/domain-class-diagram.puml
```

Product flow:

```bash
docs/diagrams/product-flow.md
```

## Request Flow

1. Vue renders a screen and reacts to user actions.
2. Axios sends a JSON request to Laravel.
3. Laravel routes the request to API code.
4. Laravel uses Eloquent models to read/write PostgreSQL.
5. Laravel returns JSON.
6. Vue updates the interface with reactive state.

## Local Setup

Backend:

```bash
cd backend
composer install
php artisan serve --host=0.0.0.0 --port=8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

PostgreSQL database expected by `backend/.env`:

```bash
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=qr_profile
DB_USERNAME=postgres
DB_PASSWORD=
```

For local development, sessions, cache, and queues use local storage instead of PostgreSQL:

```bash
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

This keeps the Laravel app bootable while you are configuring the PostgreSQL password. PostgreSQL is still the main application database for users, pages, links, QR records, and analytics records.

Create the database with your local PostgreSQL credentials, put the password in `backend/.env`, then run:

```bash
cd backend
php artisan migrate
php artisan db:seed
php artisan storage:link
```

Demo credentials after seeding:

```bash
User: demo@example.com / password123
Admin: admin@example.com / password123
```

For phone testing on the same Wi-Fi later, run both servers with `0.0.0.0`, then open:

```bash
http://YOUR_LOCAL_IP:5173
```

The seeded demo public page is:

```bash
http://localhost:5173/p/techzone
```

If Vite uses a different port, such as `5174`, use that port instead.

## Completed MVP Features

- Landing page
- Register, login, logout, current user
- Protected dashboard routes
- Page CRUD
- Logo and cover image upload
- Generic link CRUD
- Link reorder controls
- Link enable/disable field support
- Theme selection
- Live mobile preview
- Public profile page by slug
- Main QR and dedicated QR records
- PNG and SVG QR downloads in the browser
- Simple scan and click analytics
- Account settings
- Admin stats, users, page moderation
- Local network-friendly Vite and Laravel host commands

## Local Phone Testing

Run Laravel:

```bash
cd backend
php artisan serve --host=0.0.0.0 --port=8000
```

Run Vue:

```bash
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173
```

Find your computer IP on Wi-Fi, then open:

```bash
http://YOUR_LOCAL_IP:5173/p/techzone
```

Also set the frontend URL in `backend/.env` to match the phone-visible URL when generating QR targets:

```bash
FRONTEND_URL=http://YOUR_LOCAL_IP:5173
```

## Current Local Blocker

The code is ready for PostgreSQL, but this computer's local `postgres` user requires a password. `php artisan migrate` currently fails until `DB_PASSWORD` in `backend/.env` is filled in with the correct password or the local PostgreSQL auth rules are changed.

## Docker Setup

The project also includes a Docker setup for the current full-stack application:

```bash
project-root/
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.docker.example
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── nginx.conf
└── backend/
    ├── Dockerfile
    ├── .dockerignore
    └── docker/entrypoint.sh
```

Docker runs three services:

- `frontend`: Vue build served by Nginx.
- `backend`: Laravel API served on port `8000` inside the container.
- `database`: PostgreSQL 16 with a persistent Docker volume.

Inside Docker, Laravel connects to PostgreSQL with:

```bash
DB_HOST=database
DB_PORT=5432
```

Containers must not use `localhost` to reach each other. The frontend Nginx container proxies browser requests from `/api` and `/storage` to the Laravel backend service.

### Docker Environment

Create a Docker env file from the example:

```bash
copy .env.docker.example .env
```

Then generate a Laravel app key on your host:

```bash
cd backend
php artisan key:generate --show
```

Put that value into root `.env`:

```bash
APP_KEY=base64:PASTE_GENERATED_KEY_HERE
```

Important Docker variables:

```bash
FRONTEND_PORT=8080
BACKEND_PORT=8000
POSTGRES_PORT=5432

APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:8080

VITE_API_URL=/api
VITE_PUBLIC_APP_URL=http://localhost:8080

POSTGRES_DB=qr_profile
POSTGRES_USER=qrprofile
POSTGRES_PASSWORD=change_me
```

For a server or domain later, update:

```bash
APP_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
VITE_PUBLIC_APP_URL=https://yourdomain.com
VITE_API_URL=/api
```

### Build And Run

From the project root:

```bash
docker compose build
docker compose up -d
docker compose ps
```

Open the app:

```bash
http://localhost:8080
```

Check Laravel health through the frontend proxy:

```bash
http://localhost:8080/api/health
```

You can also call Laravel directly during local Docker testing:

```bash
http://localhost:8000/api/health
```

### Database Migrations

Run migrations inside the backend container:

```bash
docker compose exec backend php artisan migrate
```

Seed demo data:

```bash
docker compose exec backend php artisan db:seed
```

Create or refresh the storage symlink:

```bash
docker compose exec backend php artisan storage:link
```

The backend container does not automatically run migrations on startup. That is intentional so production deployments do not change the database without an explicit command.

### Logs And Debugging

Inspect logs:

```bash
docker compose logs backend
docker compose logs frontend
docker compose logs database
```

Follow logs live:

```bash
docker compose logs -f backend
```

Enter the backend container:

```bash
docker compose exec backend sh
```

### Stop Or Rebuild

Stop containers:

```bash
docker compose down
```

Stop containers and remove database/storage volumes:

```bash
docker compose down -v
```

Rebuild after Dockerfile, dependency, or frontend environment changes:

```bash
docker compose build --no-cache
docker compose up -d
```

For normal source changes:

```bash
docker compose build
docker compose up -d
```

### Production Compose

The optional production override removes public database/backend ports and exposes only the frontend:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

For production, set real secrets in the root `.env` or your server secret manager:

```bash
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:...
POSTGRES_PASSWORD=strong_password
FRONTEND_URL=https://yourdomain.com
APP_URL=https://api.yourdomain.com
VITE_PUBLIC_APP_URL=https://yourdomain.com
```

The current backend image uses `php artisan serve` for the first deployment. The Dockerfile is structured so it can later be upgraded to Nginx + PHP-FPM or FrankenPHP without changing the application code.

### CI/CD Direction

The setup is ready for a later flow like:

```bash
GitHub -> GitHub Actions -> Docker build -> Docker Hub -> Oracle Cloud VM -> docker compose pull -> docker compose up -d
```

A future GitHub Actions workflow can build `frontend/Dockerfile` and `backend/Dockerfile`, push both images to Docker Hub, then the Oracle VM can pull those images and run the same Compose architecture.
