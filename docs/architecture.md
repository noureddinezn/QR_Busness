# Architecture Notes

This document keeps the long-term vision visible while the project is built in phases.

## Current Phase

Phase 1 only builds the foundation:

- Laravel REST API setup
- Vue 3 frontend setup
- PostgreSQL configuration
- Tailwind CSS
- Vue Router
- Pinia
- Axios
- Sanctum installed for Phase 2
- Base models and migrations for `User`, `Page`, and `Link`

No registration, login, dashboard CRUD, QR generation, analytics, admin panel, payments, or printable templates are implemented in Phase 1.

## MVP Domain Model

The first working MVP starts with three active entities:

- `User`
- `Page`
- `Link`

Relationships:

- `User hasMany Pages`
- `Page belongsTo User`
- `Page hasMany Links`
- `Link belongsTo Page`

The `links` table stays generic. We do not create columns such as `instagram`, `facebook`, `whatsapp`, or `tiktok` on the `pages` table. Each external destination is a row in `links`.

## Future Domain Model

These entities are documented for later phases:

- `QrCode`
- `Scan`
- `LinkClick`

They are intentionally not implemented yet. They become useful when QR download, dedicated QR codes, and analytics are added.

## Diagrams

- Use cases: `docs/diagrams/use-cases.puml`
- Domain class diagram: `docs/diagrams/domain-class-diagram.puml`
- Product flow: `docs/diagrams/product-flow.md`

## Frontend Request Flow

1. Vue renders the interface on the Vite dev server.
2. Pinia stores shared reactive state.
3. Axios sends requests to the Laravel API.
4. Laravel validates and handles the request.
5. Eloquent reads or writes PostgreSQL.
6. Laravel returns JSON.
7. Vue updates the UI.

## Stable Main QR Principle

The main QR code must point to the public page URL:

```text
/p/{slug}
```

It must not point directly to WhatsApp, Instagram, Google Maps, or another external link. This keeps the printed QR code stable while the owner edits links later.
