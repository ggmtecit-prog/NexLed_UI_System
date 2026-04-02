# NexLed Consumer Build Guide

Use this guide when building a project that consumes NexLed via CDN.

## Required Head Block

Consumer projects should use this exact CDN block in this order:

```html
<!-- 1. Load Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css" rel="stylesheet">

<!-- 2. Tailwind CDN -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- 3. Configure Tailwind -->
<script src="https://ggmtecit-prog.github.io/NexLed_UI_System/src/config-cdn.js?v=1.3"></script>
<link rel="stylesheet" href="https://ggmtecit-prog.github.io/NexLed_UI_System/src/nexled.css?v=1.3">
```

Load `nexled.js` only when the page uses interactive NexLed components such as nav flyouts, dropdowns, accordion, drawer sheet, modal, search overlay, toast, carousel, or similar runtime-driven surfaces.

```html
<script src="https://ggmtecit-prog.github.io/NexLed_UI_System/src/nexled.js?v=1.3"></script>
```

## Required Version

Consumer projects must pin NexLed `1.3` assets.

- `config-cdn.js?v=1.3`
- `nexled.css?v=1.3`
- `nexled.js?v=1.3` when required

## Hard Rules

- No `<style>` blocks.
- No inline `style=""`.
- No arbitrary Tailwind values.
- No invented component classes, variants, sizes, tokens, or breakpoints.
- No local CSS overrides targeting NexLed component selectors.

## Build Contract

- Use semantic HTML.
- Use published NexLed component classes.
- Use published container tiers.
- Keep the page mobile-first.
- Validate at `360 / 480 / 768 / 1024 / 1440 / 1920`.

## Compliance Audit

Run the compliance tool against project files or directories:

```bash
node scripts/audit-compliance.js index.html
node scripts/audit-compliance.js page-demos
node scripts/audit-compliance.js --json .
```

The default enforcement model is `core fail, drift warn`.

- Errors fail the audit.
- Warnings document softer drift that should be cleaned up.

## Published References

- Tokens: `src/config-cdn.js`
- CSS: `src/nexled.css`
- Runtime: `src/nexled.js`
- Human reference: `COMPONENTS.md`
- Machine registry: `component-registry.json`