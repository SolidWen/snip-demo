# Snip – Design Tokens
> Sourced from lovable.dev's visual language (colours, shapes, type, spacing).
> Paste this file into any future styling prompt to reproduce the system.

---

## Colour palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#f5f2ed` | Page background (warm off-white / parchment) |
| `--surface` | `#ffffff` | Card & input panel background |
| `--text` | `#1a1a1a` | Primary text, headings, action button fill |
| `--muted` | `#8b8b8b` | Sub-headings, placeholders, secondary text |
| `--border` | `rgba(0,0,0,0.09)` | Card & input borders |
| `--shadow` | `0 2px 12px rgba(0,0,0,0.07)` | Card elevation |
| `--code-bg` | `#f0eee9` | Monospace code chip background |

### Accent gradient (hero glow)
```
linear-gradient(135deg, #ff6b9d 0%, #c85af5 45%, #7b9ff5 100%)
```
Rendered as a blurred radial blob (`filter: blur(60px); opacity: 0.18`) sitting
behind / below the hero section. Colours: coral pink → magenta purple → soft blue.

---

## Typography

| Token | Value |
|-------|-------|
| `--font` | `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` |
| `--text-hero` | `clamp(2.8rem, 5vw, 4rem)` · weight 800 · tracking −0.03em |
| `--text-lg` | `1.25rem` · weight 400 (tagline / subline) |
| `--text-md` | `1rem` · weight 400 (body, input) |
| `--text-sm` | `0.875rem` · weight 400 (table, labels) |
| `--text-label` | `0.8rem` · weight 600 · uppercase · tracking 0.08em (card headers) |

---

## Spacing scale

| Token | Value |
|-------|-------|
| `--space-xs` | `0.5rem` |
| `--space-sm` | `0.75rem` |
| `--space-md` | `1.25rem` |
| `--space-lg` | `2rem` |
| `--space-xl` | `3.5rem` |

---

## Border radius

| Token | Value | Usage |
|-------|-------|-------|
| `--r-pill` | `999px` | Send/action buttons |
| `--r-xl` | `20px` | Cards, input panel |
| `--r-lg` | `14px` | Inner notices |
| `--r-md` | `10px` | Inline chips |

---

## Component mapping

| Snip element | Design system role |
|--------------|--------------------|
| `<h1>Snip</h1>` + tagline | **Hero headline** — bold, centred, full viewport width, gradient glow below |
| URL `<form>` + `<input>` | **Chat-style input panel** — large white `--r-xl` card, borderless input inside, dark pill send-button at right |
| Error / success notices | **Inline notice** — tinted background chip inside the input card |
| All-links `<section>` | **Content card** — white `--r-xl` surface, subtle border & shadow, labelled with `--text-label` |
| Short-code cells | Monospace chip on `--code-bg` |
| URL column | Truncated, `--muted` colour |
| Hits column | Centred, `--muted`, tabular nums |
