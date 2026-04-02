# NexLed Demo Checklist

## Viewports

Validate every demo and page at:

- `360`
- `480`
- `768`
- `1024`
- `1440`
- `1920`

## Layout

- No uncontrolled horizontal page overflow.
- Container padding matches the active container tier.
- Dense sections remain readable on narrow screens.
- Desktop shells do not feel under-filled or over-stretched.

## Components

Check in real page context:

- navigation surfaces
- sidebar and drawer
- cards and panels
- tables and pagination
- tabs and segmented control
- overlay surfaces
- footer variants
- carousel

## States and Motion

Validate:

- hover
- active or pressed
- focus-visible
- disabled
- open and close behavior
- reduced-motion behavior

## Compliance

- Required NexLed head block is present.
- NexLed assets use `?v=1.3`.
- `nexled.js` is present when interactive components are used.
- No `<style>` blocks.
- No inline `style=""`.
- No arbitrary Tailwind values.
- No local CSS overrides targeting NexLed component selectors.

## Audit Commands

```bash
node scripts/audit-compliance.js index.html
node scripts/audit-compliance.js page-demos
node scripts/audit-compliance.js starter-kit/starter.html
```