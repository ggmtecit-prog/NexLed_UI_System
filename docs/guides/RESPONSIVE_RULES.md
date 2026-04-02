# NexLed Responsive Rules

## Breakpoint Contract

Use only the published NexLed breakpoints:

- <480: small phone
- 480-767: large phone / narrow landscape
- 768-1023: tablet
- 1024-1439: desktop
- 1440+: wide desktop

Rules:

- Build mobile-first.
- 1440+ may expand layout and hero scale, but it must not make everyday components feel oversized.
- Do not invent extra breakpoints.

## Container Rhythm

Use the existing spacing tokens for page padding:

- <480: 16
- 480-767: 20
- 768-1023: 24
- 1024-1439: 32
- 1440+: 40

Use only these wrappers:

- container-standard
- container-balanced
- container-wide
- container-narrow
- container-readable

## Typography Matrix

Map typography to the current token set only.

- Meta and labels: 12 on phone, 14 from tablet upward
- Body and UI text: 14 on phone, 16 on tablet, 18 only for stronger supporting copy on desktop and wider
- Component subheads and card/form headings: 16 / 18 / 24
- Component heading tier: 22 / 24 / 30
- Section title tier: 26 / 30 / 35 / 40
- Page title tier: 30 / 36 / 40 / 45
- Hero tier: 30 / 36 / 45 / 48

## Component-Family Rules

### Buttons, inputs, dropdowns, selectors

- On narrow screens, prefer stacked layouts and allow controls to grow to the available width.
- Size classes remain public, but they behave as semantic responsive tiers, not rigid desktop outputs.
- Restore intrinsic sizing gradually from 768 upward.

### Popovers and selectors

- On phone, panels should align to the control or the container width.
- Restore anchored and more compact panels from 1024 upward.

### Modal, drawer, search overlay, toast

- Use safe insets and near-full-width surfaces on phone.
- Restore constrained widths from md and lg upward.
- Do not size these surfaces from button-width tokens.

### Data table, tabs, pagination, segmented control, stepper

- Never allow uncontrolled page-level horizontal overflow.
- Prefer internal scroll, wrapping, or stacked action layouts below desktop.

### Footer and carousel

- Increase density progressively.
- Avoid big one-step jumps from small to large desktop.

## Catalog Shell Rules

- Below 1024, the documentation shell uses a top bar plus drawer navigation.
- At 1024+, the left sidebar returns.
- Do not depend on h-screen overflow-hidden for small-screen layout.

## Acceptance Rules

Every responsive pass must verify:

- 360, 480, 768, 1024, 1440, 1920
- no horizontal page scroll outside sanctioned internal-scroll regions
- hover, active, focus-visible, disabled, and open/close states
- reduced-motion behavior
- required NexLed CDN head block
- no inline styles, local CSS files, arbitrary Tailwind values, or invented tokens
