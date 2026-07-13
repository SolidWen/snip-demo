# Snip – Backend

Tiny URL shortener. Single-file Bun server, zero npm dependencies, in-memory store.

## Quick start

```bash
bun run server.js
# or
bun start
```

## API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/links` | Create a short link — body: `{ "url": "https://…" }` → 201 `{ code, url, shortUrl, hits, createdAt }` / 400 on bad input |
| `GET` | `/api/links` | Return all links as an array |
| `GET` | `/:code` | Redirect (302) to the original URL, incrementing `hits`; 404 if unknown |

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `3000` | Listening port |
| `BASE_URL` | `https://$RAILWAY_PUBLIC_DOMAIN` or `http://localhost:PORT` | Origin used in `shortUrl` |
| `PUBLIC_DIR` | _(unset)_ | When set, serve static files from this folder (`/` → `index.html`); static files take priority over short codes |

**Responses:**
- **200 OK**: Returns an array of all link objects.

### GET /:code

Redirects to the original URL based on the short code.

**Responses:**
- **302 Found**: Redirects to the original URL and increments hits.
- **404 Not Found**: Returns an error if the short code is unknown.

## Environment Variables

- **PORT**: The port on which the server will run (default: 3000).
- **BASE_URL**: The origin used in shortUrl values (defaults to https://$RAILWAY_PUBLIC_DOMAIN or localhost).
- **PUBLIC_DIR**: If set, serves static files from this directory.

## Getting Started

1. Clone the repository.
2. Navigate to the project directory.
3. Install Bun if you haven't already.
4. Run the server:
   ```bash
   bun run server.js
   ```
5. Access the API at `http://localhost:3000`.

## License

This project is licensed under the MIT License.