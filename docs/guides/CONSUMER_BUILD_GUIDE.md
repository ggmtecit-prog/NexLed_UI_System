# NexLed Consumer Build Guide

## Required Head Block

Use this exact order on every NexLed page:

`html
<!-- 1. Load Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css" rel="stylesheet">

<!-- 2. Tailwind CDN -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- 3. NexLed Design System -->
<script src="https://ggmtecit-prog.github.io/NexLed_UI_System/src/config-cdn.js?v=1.3"></script>
<link rel="stylesheet" href="https://ggmtecit-prog.github.io/NexLed_UI_System/src/nexled.css?v=1.3">

<!-- 4. Interactive Components -->
<script src="https://ggmtecit-prog.github.io/NexLed_UI_System/src/nexled.js?v=1.3"></script>
`

## Hard Rules

- No <style> blocks
- No inline style=""
- No local CSS files
- No arbitrary Tailwind values
- No new raw colors, spacing, shadows, radii, durations, or breakpoints
- No new component APIs unless they are added to the main NexLed system first

## Formatting and Sizing Rules

- Use semantic HTML plus NexLed classes and allowed Tailwind layout utilities.
- Keep the page mobile-first.
- Use only sm, md, lg, and xl for responsive changes.
- Use the container rhythm 16 / 20 / 24 / 32 / 40.
- Treat size classes like semantic responsive tiers rather than fixed desktop dimensions.

## Page Assembly Rules

### Simple brand page

1. Header / nav bar
2. Hero intro
3. Feature or capability grid
4. One explanatory panel block
5. Primary CTA block
6. Footer

### Expansion rules

- Build store, product-detail, content/help, and contact pages from the documented recipes.
- Keep the same shell, typography rhythm, and responsive logic.
- Add animation only after the responsive foundation is stable.

## Optional Page Motion

A restrained scroll reveal system is available when `nexled.js` is loaded.

Use it only on top-level page structure:
- `data-reveal="hero"` on the main `page-header-hero`
- `data-reveal="section"` on major page sections
- `data-reveal="section"` on the page footer when needed

Rules:
- Use it on page-level blocks only, not every card, panel, button, or control.
- The shared JS reveals each target once as it enters the viewport.
- Reduced-motion users get the final visible state immediately with no animation.
- Keep the motion layer subtle and structural, not decorative.

Example:

```html
<header class="page-header-hero" data-reveal="hero">
<section id="platform" data-reveal="section">
<footer class="footer" data-reveal="section">
```
## Consumer QA Checklist

- Check 360, 480, 768, 1024, 1440, 1920
- Confirm no horizontal page scroll
- Confirm all states still work: hover, focus-visible, active, disabled, open/close
- Confirm reduced-motion behavior
- Confirm the required head block is unchanged
- Confirm only published NexLed tokens and classes were used
