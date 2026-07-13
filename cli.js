#!/usr/bin/env node
'use strict';

// snip CLI – zero npm dependencies, Node 18+ (global fetch)
// Base URL from SNIP_API env var, default http://localhost:3000

const { spawn } = require('child_process');

const BASE = (process.env.SNIP_API ?? 'http://localhost:3000').replace(/\/$/, '');
const [,, cmd, arg] = process.argv;

// ── Helpers ───────────────────────────────────────────────────────────────────

function die(msg) {
  process.stderr.write(`snip: ${msg}\n`);
  process.exit(1);
}
function openBrowser(url) {
  let child;
  if (process.platform === 'win32') {
    child = spawn('cmd.exe', ['/c', 'start', '', url],
      { detached: true, stdio: 'ignore', shell: false });
  } else if (process.platform === 'darwin') {
    child = spawn('open', [url], { detached: true, stdio: 'ignore' });
  } else {
    child = spawn('xdg-open', [url], { detached: true, stdio: 'ignore' });
  }
  child.unref();
}

// ── Commands ──────────────────────────────────────────────────────────────────

async function add(url) {
  if (!url) die('missing url\n  usage: snip add <url>');

  let res;
  try {
    res = await fetch(`${BASE}/api/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
  } catch (e) { die(`backend unreachable — ${e.message}`); }

  const body = await res.json();
  if (!res.ok) die(body.error ?? res.statusText);
  console.log(body.shortUrl);
}

async function ls() {
  let res;
  try { res = await fetch(`${BASE}/api/links`); }
  catch (e) { die(`backend unreachable — ${e.message}`); }

  const links = await res.json();
  if (!res.ok) die(links.error ?? res.statusText);

  if (!links.length) { console.log('No links yet.'); return; }

  // Aligned table: CODE  HITS  URL
  const cW = Math.max('CODE'.length, ...links.map(l => l.code.length));
  const hW = Math.max('HITS'.length, ...links.map(l => String(l.hits).length));
  const header = `${'CODE'.padEnd(cW)}  ${'HITS'.padStart(hW)}  URL`;
  console.log(header);
  console.log('─'.repeat(header.length));
  for (const l of links) {
    console.log(`${l.code.padEnd(cW)}  ${String(l.hits).padStart(hW)}  ${l.url}`);
  }
}

async function open(code) {
  if (!code) die('missing code\n  usage: snip open <code>');

  // fetch with redirect:'manual' stops at the 302 and exposes Location
  // (Node 18+ global fetch / undici behaviour — does not follow redirects)
  let res;
  try { res = await fetch(`${BASE}/${code}`, { redirect: 'manual' }); }
  catch (e) { die(`backend unreachable — ${e.message}`); }

  if (res.status === 404) die(`unknown code: ${code}`);
  if (res.status !== 302) die(`unexpected response status ${res.status}`);

  const loc = res.headers.get('location');
  if (!loc) die('backend returned a 302 with no Location header');

  openBrowser(loc);
  console.log(`Opening ${loc}`);
}

// ── Dispatch ──────────────────────────────────────────────────────────────────

const USAGE = `\
Usage:
  snip add <url>     Shorten a URL and print the short link
  snip ls            List all short links
  snip open <code>   Open a short link in the OS default browser
  snip help          Show this message

Env:
  SNIP_API           Backend base URL (default: http://localhost:3000)
`;

switch (cmd) {
  case 'add':  add(arg).catch(e => die(e.message));  break;
  case 'ls':   ls().catch(e => die(e.message));       break;
  case 'open': open(arg).catch(e => die(e.message)); break;
  case undefined:
  case 'help':
  case '--help':
  case '-h':
    process.stdout.write(USAGE);
    break;
  default:
    process.stderr.write(`snip: unknown command '${cmd}'\n\n`);
    process.stderr.write(USAGE);
    process.exit(1);
}
