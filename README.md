# Snip – CLI

Zero-dependency Node.js CLI for the Snip URL shortener backend.

## Requirements

Node.js 18 or later (uses built-in `fetch` and `http`/`https` modules).

## Install

```bash
npm install -g .
# or run directly:
node cli.js <command>
```

## Usage

```
snip add <url>     Shorten a URL and print the short link
snip ls            List all short links (aligned table)
snip open <code>   Open a short link in the OS default browser
snip help          Show usage
```

## Environment

| Variable  | Default                  | Purpose                       |
|-----------|--------------------------|-------------------------------|
| `SNIP_API`| `http://localhost:3000`  | Backend base URL              |

## Examples

```bash
snip add https://github.com/SolidWen/snip-demo
# https://localhost:3000/aB3xZ9

snip ls
# CODE    HITS  URL
# ─────────────────────────────────────────
# aB3xZ9     2  https://github.com/SolidWen/snip-demo

snip open aB3xZ9
# Opening https://github.com/SolidWen/snip-demo
```

## Shell wrappers

| File       | Platform          |
|------------|-------------------|
| `snip`     | Linux / macOS     |
| `snip.cmd` | Windows (cmd.exe) |
| `snip.ps1` | Windows (PowerShell) |

Errors print to `stderr` and exit with code `1`.
