# Snip

> Tiny URL shortener — one backend, two clients, three git branches.

---

## Architecture

```
snip-demo (this repo)
├── backend/   ← Bun HTTP server          (branch: backend)
├── frontend/  ← Angular 19 SPA           (branch: frontend)
└── cli/       ← Node.js CLI              (branch: cli)
```

Each layer lives on its **own orphan branch** of this single repository and is
mounted here as a **git submodule** tracking that branch. The `main` branch is
the aggregator — it owns nothing except `.gitmodules` and this README.

---

## API contract

The backend exposes three routes; both clients speak only to these.

| Method | Path | Request body | Success | Error |
|--------|------|-------------|---------|-------|
| `POST` | `/api/links` | `{ "url": "https://…" }` | `201` `{ code, url, shortUrl, hits, createdAt }` | `400` `{ error }` |
| `GET` | `/api/links` | — | `200` array of link objects | — |
| `GET` | `/:code` | — | `302 → original URL` (hits++) | `404` |

All responses carry open CORS headers.  
`shortUrl` is built from `BASE_URL` (env) or `https://$RAILWAY_PUBLIC_DOMAIN` or `http://localhost:PORT`.

---

## Cloning

Because the `backend/`, `frontend/`, and `cli/` folders are submodules, a plain
`git clone` leaves those directories **empty**. Always use:

```bash
git clone --recurse-submodules https://github.com/SolidWen/snip-demo.git
```

If you already cloned without the flag:

```bash
git submodule update --init --recursive
```

---

## Running each piece

### Backend (Bun)

```bash
cd backend
bun run server.js          # listens on PORT (default 3000)

# optional env vars
PORT=3000
BASE_URL=https://your-domain.com
PUBLIC_DIR=../frontend/dist/snip-frontend/browser   # serve the SPA too
```

### Frontend (Angular)

```bash
cd frontend
npm install
npm start                  # dev server → http://localhost:4200
                           # points at http://localhost:3000 for the API

# production build (output: frontend/dist/snip-frontend/browser)
npx ng build
```

### CLI (Node 18+)

```bash
cd cli
node cli.js help

# or install globally
npm install -g .
snip help

# point at a remote backend
SNIP_API=https://your-domain.com snip ls
```

### Serving frontend from the backend (single-origin deploy)

```bash
cd frontend && npx ng build && cd ..
PUBLIC_DIR=./frontend/dist/snip-frontend/browser bun run backend/server.js
# → backend serves both the API and the built SPA on the same port
```

---

## Updating a submodule

Work inside the submodule folder as a normal git repo:

```bash
cd backend          # or frontend / cli
# … edit files …
git add -A
git commit -m "feat: my change"
git push origin backend
cd ..
```

Then bump the superproject's pointer to the new commit:

```bash
# pull the latest commit from the tracked branch
git submodule update --remote backend

# stage the updated pointer + commit
git add backend
git commit -m "chore: bump backend submodule"
git push origin main
```

To update **all** submodules at once:

```bash
git submodule update --remote
git add backend frontend cli
git commit -m "chore: bump all submodules"
git push origin main
```

---

## Repository layout

| Branch | Contents | Tech |
|--------|----------|------|
| `main` | `.gitmodules`, `README.md` | — |
| `backend` | `server.js`, `package.json`, `README.md` | Bun, zero npm deps |
| `frontend` | Angular 19 app (`src/`, `angular.json`, …) | TypeScript, Angular |
| `cli` | `cli.js`, shell wrappers, `package.json` | Node 18+, zero npm deps |
