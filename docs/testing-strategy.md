# Testing Strategy

The frontend test suite is organized into three layers:

```text
frontend/tests/
  unit/
    qrService.spec.js
    linkService.spec.js
    storageService.spec.js
    validators.spec.js

  integration/
    profileStore.spec.js
    editorPreview.spec.js
    importExport.spec.js

  e2e/
    create-profile.spec.js
    qr-manager.spec.js
    persistence.spec.js
```

## Unit And Logic Tests

Tooling:

- Vitest
- jsdom

Covered behavior:

- Moroccan WhatsApp phone normalization
- WhatsApp URL generation
- Google Maps URL generation from addresses
- QR target generation by type
- URL validation
- email validation
- link validation by type
- duplicate link prevention
- link enable/disable toggling
- link reordering
- localStorage JSON save/load/remove

## Integration Tests

Tooling:

- Vitest
- Vue Test Utils
- Pinia

Covered behavior:

- auth store persists user and token to localStorage
- logout clears auth state
- live phone preview updates when profile props change
- profile configuration export/import
- invalid imported profile configuration is rejected

## Functional / E2E Tests

Tooling:

- Playwright
- mocked API routes for deterministic browser tests

Covered user flows:

- user logs in
- opens editor
- edits profile information
- selects a theme
- sees live mobile preview update
- adds a link
- opens QR Manager
- sees main, WhatsApp, and Google Maps QR cards
- downloads a QR PNG
- refreshes the app and keeps auth state
- opens the public profile
- clicks a WhatsApp link

## Commands

Run unit, logic, and integration tests:

```bash
cd frontend
npm run test
```

Run functional / E2E tests:

```bash
cd frontend
npx playwright test
```

Run production build:

```bash
cd frontend
npm run build
```

## Latest Test Report

Date: 2026-10-07

- Unit tests: passed
- Logic tests: passed
- Integration tests: passed
- Functional / E2E tests: passed
- Production build: passed

Observed results:

```text
Vitest: 7 files passed, 20 tests passed
Playwright: 3 tests passed
Vite build: passed
```

## Remaining Untested Risks

- Backend Laravel API feature tests should be expanded beyond the default smoke tests.
- File uploads should be covered with backend feature tests and browser tests.
- Real PostgreSQL test database lifecycle is not automated yet.
- QR visual correctness is tested through generation/download flow, not pixel comparison.
- Admin moderation flows are not covered by Playwright yet.
