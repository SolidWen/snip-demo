// Snip – tiny URL shortener  (Bun-native, zero npm deps)

const PORT = parseInt(process.env.PORT) || 3000;
const BASE_URL =
  process.env.BASE_URL ||
  (process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : `http://localhost:${PORT}`);
const PUBLIC_DIR = process.env.PUBLIC_DIR || "";

/** In-memory store: code -> { code, url, shortUrl, hits, createdAt } */
const links = new Map();

const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function generateCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  let code = "";
  for (const b of bytes) code += CHARS[b % 62];
  return code;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

Bun.serve({
  port: PORT,

  async fetch(req) {
    const { pathname } = new URL(req.url);
    const method = req.method;

    // ── CORS preflight ────────────────────────────────────────────────────
    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    // ── Static files (PUBLIC_DIR wins over short codes) ───────────────────
    if (PUBLIC_DIR && method === "GET") {
      const rel = pathname === "/" ? "/index.html" : pathname;
      const file = Bun.file(`${PUBLIC_DIR}${rel}`);
      if (await file.exists()) {
        return new Response(file, { headers: CORS });
      }
    }

    // ── POST /api/links ───────────────────────────────────────────────────
    if (method === "POST" && pathname === "/api/links") {
      let body;
      try {
        body = await req.json();
      } catch {
        return jsonResponse({ error: "Invalid JSON" }, 400);
      }

      let parsed;
      try {
        parsed = new URL(body?.url);
      } catch {
        return jsonResponse({ error: "Invalid URL" }, 400);
      }
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return jsonResponse({ error: "URL must use http or https" }, 400);
      }

      const code = generateCode();
      const entry = {
        code,
        url: body.url,
        shortUrl: `${BASE_URL}/${code}`,
        hits: 0,
        createdAt: new Date().toISOString(),
      };
      links.set(code, entry);
      return jsonResponse(entry, 201);
    }

    // ── GET /api/links ────────────────────────────────────────────────────
    if (method === "GET" && pathname === "/api/links") {
      return jsonResponse(Array.from(links.values()));
    }

    // ── GET /:code  (redirect) ────────────────────────────────────────────
    if (method === "GET" && pathname.length > 1) {
      const code = pathname.slice(1);
      const entry = links.get(code);
      if (entry) {
        entry.hits++;
        return new Response(null, {
          status: 302,
          headers: { Location: entry.url, ...CORS },
        });
      }
    }

    return jsonResponse({ error: "Not found" }, 404);
  },
});

console.log(`Snip backend listening on port ${PORT}`);
console.log(`Short URLs base: ${BASE_URL}`);