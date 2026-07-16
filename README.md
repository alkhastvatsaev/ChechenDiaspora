# Waynakh Diaspora Hub

[Live demo](https://waynakh.vercel.app) · Next.js 16 · TypeScript · Firebase · Leaflet

Waynakh Diaspora Hub is a mobile-first community directory prototype. It explores how a geographically distributed community could discover local expertise, search a structured directory, publish requests, and preserve cultural reference material in one web application.

This repository is a portfolio case study, not a production-ready private directory. The live interface uses Russian and Chechen content; the engineering documentation is in English.

## Product case study

### Problem

Useful community knowledge is often scattered across chats and personal contact lists. The project tests a more searchable model:

- a map for exploring hubs and approved directory entries;
- text and category filters for finding relevant expertise;
- community requests and classified posts;
- a mobile web-app shell with a manifest and install-oriented layout;
- static cultural and language reference pages.

The application includes fictional sample profiles so the interface remains demonstrable without exposing private community records.

### Technical approach

The App Router renders the application shell while interactive features run as client components. Leaflet handles map rendering and clustering. Firebase Anonymous Authentication establishes a per-browser identity. Realtime Database powers directory submissions, published requests, and posts; Firestore is also read as a migration-compatible source for approved members. Local storage retains first-visit state and a directory cache.

```text
Browser
  ├─ Next.js App Router + React
  ├─ Leaflet map, clustering, search and filters
  ├─ Web App Manifest + responsive app shell
  └─ Firebase client SDK
       ├─ Anonymous Authentication
       ├─ Realtime Database (members, tickets, ads)
       ├─ Firestore (approved-member compatibility read)
       └─ Storage (denied until a moderated upload flow exists)
```

The PWA work currently covers the app-like responsive shell and web manifest. A service worker, reliable offline navigation, generated install icons, and update lifecycle are roadmap items; the project should not yet be described as fully offline-capable.

## Privacy and security model

The committed Firebase rules are deny-by-default:

- only authenticated sessions can query approved members and published tickets;
- pending member submissions are hidden from ordinary clients;
- submissions are tied to the anonymous Firebase UID that created them;
- ordinary clients cannot approve members or edit arbitrary records;
- moderator operations require a server-issued `admin` custom claim;
- Cloud Storage is closed until an authenticated, moderated media workflow is implemented.

Important limitations:

- Anonymous Authentication identifies a browser session; it does **not** prove community membership.
- The passphrase and route checks in the current UI are client-side product prototypes and provide no security boundary. They must not be treated as shared-password protection.
- Approved profile fields, published requests, and classified posts are visible to any user who can obtain an anonymous session. Do not store private addresses, identity documents, sensitive case details, or secrets.
- Contact data and precise locations need explicit consent, retention/deletion workflows, abuse controls, and a privacy review before real community use.
- Admin custom claims must be assigned from a trusted server or Firebase Admin SDK, never from client code.
- Firebase web configuration values are public project identifiers. Authorization depends on Firebase rules, not on hiding those values.

Rule changes in this repository are not active until an authorized maintainer deploys them with the Firebase CLI.

## Local development

Requirements: Node.js 20+, npm, and an optional Firebase project with Anonymous Authentication enabled.

```bash
git clone https://github.com/alkhastvatsaev/ChechenDiaspora.git
cd ChechenDiaspora
npm ci
cp .env.example .env.local
npm run dev
```

Fill `.env.local` with the Firebase web-app configuration:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`

Without these values the UI starts in placeholder mode, which is sufficient for static/sample-data development but not for Firebase-backed features.

To deploy rules after reviewing them against a non-production project:

```bash
npx firebase-tools deploy --only firestore:rules,database,storage
```

## Quality checks

```bash
npm run lint        # ESLint, zero warnings
npm run typecheck   # strict TypeScript check
npm test            # Vitest unit/component tests
npm run test:e2e    # Playwright browser tests
npm run build       # production Next.js build
npm run check       # lint + types + unit tests + build
```

GitHub Actions runs the deterministic checks for pull requests and pushes to `main`. Dependabot proposes monthly npm and Actions updates.

## Repository structure

- `src/app` — routes, metadata, and application pages
- `src/features` — map, navigation, hub, layout, and modal features
- `src/hooks` — Firebase synchronization and product state
- `src/data` — static geography and cultural reference data
- `src/contexts` — authentication/session context
- `tests/e2e` — Playwright user-flow coverage
- `firestore.rules`, `database.rules.json`, `storage.rules` — backend authorization policy

## Roadmap

1. Replace client-side membership checks with a server-verified invite or account workflow.
2. Move moderation and vouch aggregation to trusted server functions.
3. Separate public profile fields from private contact details and add consent/deletion flows.
4. Add App Check, rate limiting, abuse reporting, audit logs, and Firebase emulator rule tests.
5. Complete the PWA lifecycle with generated icons, a service worker, offline fallbacks, and install tests.
6. Consolidate the dual Firestore/Realtime Database member source and add typed data validation.

## License and data use

No license is currently granted. Source availability does not imply permission to reuse community data. The bundled sample profiles are demonstrative; do not commit real personal data, production exports, credentials, or private contact lists.
