## VoxCare Pulse — AI‑Driven After‑Sales Prototype

VoxCare Pulse is a demonstration-grade prototype that combines real‑time conversational support with predictive vehicle health monitoring. It showcases how a sentiment‑aware chat agent (powered by Google Gemini) can triage user messages, trigger escalations, and surface maintenance recommendations based on simulated OBD‑II data.

This README contains detailed setup, development, deployment, and troubleshooting instructions so contributors can run the app locally and understand the architecture.

## Quick Snapshot
- Purpose: Customer-facing chat and vehicle health diagnostics with an admin dashboard for service centers.
- Current demo: Frontend deployed to Netlify (static site). Express backend is included but must be hosted separately for API support.
- Note: For a quick visual demo, overall vehicle health is currently hardcoded to 60% in the frontend.

## Contents
- Overview
- Getting started (dev)
- Architecture & important files
- Scripts
- Deployment (Netlify for frontend)
- Environment variables
- Testing
- Troubleshooting
- Contributing

---

## Getting started (development)

Prerequisites
- Node.js 18+ and npm (or pnpm)
- Optional: PostgreSQL (Neon recommended) if you want persistence

Local install
```bash
# clone
git clone https://github.com/AAsthaKhushi/VoxCare-Pulse.git
cd VoxCare-Pulse

# install dependencies
npm install
```

Environment
- Copy the example env file (if you keep local secrets out of the repo):

```bash
cp .env.example .env    # (Windows: copy .env.example .env)
```

- Required variables (see "Environment variables" section below).

Run locally

```bash
npm run dev
# open http://localhost:5000
```

Database (optional)
- To use a real Postgres DB:
    - Set `DATABASE_URL` in `.env`.
    - Run migrations: `npm run db:push`
    - Seed sample data (optional): `npm run db:seed`

If `DATABASE_URL` is not set the app uses an in‑memory mock storage for quick testing.

---

## Architecture & Important Files

- client/ — React + TypeScript UI (Vite):
    - `client/src/pages/CustomerApp.tsx` — main customer page
    - `client/src/components/customer/VehicleHealthDashboard.tsx` — vehicle health UI
    - `client/src/components/shared/VehicleHealthCard.tsx` — small health card component

- server/ — Node + Express API and WebSocket (single file server/index.ts)
    - `server/routes.ts` — API & WS route definitions
    - `server/storage.ts` — data access layer (DB or mock)
    - `server/mockStorage.ts` — in‑memory data for local dev (used when DATABASE_URL is missing)

- shared/ — shared schema and types (`shared/schema.ts`)

Notes
- The Vite build outputs static files under `dist/public`. The repo also bundles a Node server into `dist/index.js` for convenience, but Netlify (static host) will only serve the `dist/public` frontend.

---

## Scripts

Key npm scripts (see `package.json`)
- `npm run dev` — run dev server (tsx) + Vite frontend
- `npm run build` — build frontend (Vite) and bundle server (esbuild)
- `npm start` — run production server from `dist/index.js` (requires Node + built files)
- `npm run check` — TypeScript typecheck
- `npm run db:push` — run Drizzle migrations
- `npm run db:seed` — seed DB

---

## Deployment

Frontend (Netlify)
- The Vite frontend is deployed to Netlify. The repo contains a `netlify.toml` configured to build with `npm run build` and publish `dist/public`.
- The project was deployed via Netlify CLI during setup — the static frontend is available at the configured Netlify site.

Backend (APIs)
- The Express backend cannot run as a long‑lived process on Netlify. Options:
    1. Host the Node server on a platform that supports Node (Render, Railway, Fly, Heroku) and set the frontend's API base URL to that host.
 2. Convert server endpoints into Netlify Functions (serverless) — requires extracting handlers into `/netlify/functions`.

Example: quick production deploy (CLI)
```bash
# one‑time: log in
npx netlify-cli login

# deploy dist/public to production
npx netlify deploy --dir=dist/public --prod
```

---

## Environment variables

Required
- `DATABASE_URL` — Postgres connection string (if using DB)
- `GEMINI_API_KEY` — Google Gemini API key (for sentiment/NLU features)

Optional
- `PORT` — server port (default: 5000)
- `NODE_ENV` — environment (development/production)

Security note: Do not commit secrets. Keep `.env` in `.gitignore` (this repo already avoids committing `.env`).

---

## Testing guidance

Manual checks
- Sentiment analysis: send messages with different tones and observe escalation behavior.
- Vehicle health: open the Vehicle Health dashboard. (Overall health currently hardcoded to 60% in the demo frontend.)

Automated
- Add unit tests for services in `server/services` and component tests for key UI components (Jest + React Testing Library recommended).

---

## Troubleshooting

- If builds fail with a PostCSS "from option" warning, ensure PostCSS config and plugin versions are compatible.
- If the site shows 404s for client routes, the `netlify.toml` includes a redirect to serve `index.html` for SPA routes.
- If static assets are large, Vite will warn about chunk size — consider code splitting.

---

## Contributing

This is a prototype. If you'd like to contribute:
1. Fork the repo
2. Create a feature branch
3. Open a PR with a clear description and tests for any behavior changes

Suggested small improvements
- Make overall vehicle health driven by mock data or an environment config (instead of being hardcoded)
- Add CI: GitHub Actions to run `npm run check` and `npm run build`
- Add an API integration test that runs against the mock storage

---

## Changelog (quick)

- Hardcoded overall vehicle health to 60% in the frontend for demo purposes.
- Added `netlify.toml` and deployed the frontend to Netlify.

---

If you'd like, I can also add a short diagram of the architecture, wire up GitHub Actions to build on push, or create a `CONTRIBUTING.md` file with PR guidelines.

**License:** MIT

