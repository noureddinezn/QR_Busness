# Public QR loading diagnosis

Verified on October 7, 2026. No physical phone was connected to the test tools.

## Findings

- QR, LAN address and server bindings were correct: 192.168.1.184, both servers bound to 0.0.0.0.
- The public route eagerly imported every dashboard view, including editor, AI and QR code generation.
- Development imports served entire Font Awesome icon collections: 2,579,232 and 1,549,336 bytes. These are unnecessary for a visitor.
- The empty HTML app root and public view had no loading UI. Axios had no timeout, so an unreachable API could leave the visitor waiting indefinitely.
- The browser previously needed to reach Laravel directly on port 8000 as well as Vite on 5173.
- Windows Wi-Fi is classified Public. Node allow rules exist; no matching PHP/8000 allow rule was found. Adding scoped LAN rules returned Access Denied. An actual inbound firewall block was not proven from this computer.
- CORS returned Access-Control-Allow-Origin: *; no CORS failure was reproduced.
- The actual profile logo is a 24,366-byte WebP, not a large Base64 image. It returned HTTP 200. This profile has no cover image. Image size was not the cause.
- The URL uses a numeric IP, so DNS lookup is not involved.

## Fix

Routes load on demand. Icons use individual imports. Public Axios requests have a 10-second timeout, no dashboard token and no login redirect. Loading feedback exists in HTML before JavaScript starts and in Vue while the API loads. Failure and retry are visible.

Frontend environment now uses VITE_API_URL=/api. Vite dev and preview proxy /api and /storage to Laravel on the computer. Storage URLs are relative. A phone only needs frontend port 5173; it no longer needs direct inbound access to 8000.

An optimized build is currently served with Vite preview on the original port. This is a local testing server, not a production hosting setup.

## Addresses

- Frontend / QR: http://192.168.1.184:5173/p/noureddine
- Axios as resolved on the phone: http://192.168.1.184:5173/api
- Laravel: http://192.168.1.184:8000
- Proxy upstream (on the computer only): http://127.0.0.1:8000

Backend-only database/cache loopback addresses and test fixtures remain intentional.

## Measurements and tests

Chromium with a 390x844 viewport on the computer, accessing the LAN IP:

- Before: 6,265 ms until profile loaded and network settled.
- Optimized build: 2,548 ms until settled, 11 requests, approximately 134 KB of measured resource transfers, zero failed requests.
- Remaining largest request: Laravel public API, 1,426 ms in this sample.
- Timings are individual local samples, not guarantees of phone/Wi-Fi performance.
- 27 frontend unit/integration tests passed.
- 23 Playwright tests passed, including API timeout, failure/retry, missing JavaScript, credential-free public requests, and ten public viewport sizes from 320 to 1440 pixels.
- 9 Laravel tests passed. Frontend build passed.

## Changed files

- frontend/.env, frontend/.env.example
- frontend/vite.config.js
- frontend/index.html, frontend/src/main.js
- frontend/src/router/index.js
- frontend/src/components/AppIcon.vue
- frontend/src/components/profile/PublicProfile.vue
- frontend/src/views/PublicPageView.vue
- frontend/src/config/network.js, frontend/src/config/publicUrl.js
- frontend/src/services/api.js, pageService.js, linkService.js
- backend/config/app.php, backend/config/filesystems.php
- backend/app/Http/Controllers/Api/PageController.php
- backend/app/Services/QrCodeService.php
- frontend/tests/unit/network.spec.js
- frontend/tests/e2e/public-loading.spec.js
- frontend/scripts/measure-public.mjs
- README.md, docs/mobile-loading-report.md

## Running locally

In backend: php artisan serve --host=0.0.0.0 --port=8000

In frontend, for phone testing: npm run build, then npm run preview.
Stop the existing frontend server first; strictPort prevents silently changing the QR port.
For editing with hot reload use npm run dev instead. Rebuild before switching back to preview.

On the phone, join the same Wi-Fi, open the public URL above directly, then scan the existing QR. Reload once to discard the previously opened page. Check that the profile, image and links appear.

If even the HTML loading message never appears, test http://192.168.1.184:5173/api/health from the phone. A failure before HTML arrives points to reachability, device Wi-Fi isolation, or firewall. No frontend code can display a loading state before the browser receives the HTML.

To measure again from the project frontend directory: node scripts/measure-public.mjs.
