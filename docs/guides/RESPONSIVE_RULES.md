# NexLed Responsive Rules

These rules describe the current responsive contract implemented by NexLed 1.3.

## Validation Viewports

Always validate pages and demos at:

- `360`
- `480`
- `768`
- `1024`
- `1440`
- `1920`

## Breakpoints

NexLed uses these breakpoint tiers from `src/config-cdn.js`:

- `sm`: `480px`
- `md`: `768px`
- `lg`: `1024px`
- `xl`: `1440px`

## Container Tiers

Use the published container tiers instead of inventing page widths:

- `container-narrow`
- `container-standard`
- `container-balanced`
- `container-wide`
- `container-readable`

Use `container-balanced` when `container-standard` feels too constrained and `container-wide` feels too stretched.

## Container Padding Rhythm

Use the shared container padding rhythm:

- base: `16`
- `sm`: `20`
- `md`: `24`
- `lg`: `32`
- `xl`: `40`

## Mobile-First Rule

Build from the smallest layout first.

- Stack first, then split.
- Let cards, panels, and controls grow with available width.
- Restore denser or multi-column patterns only when the breakpoint contract allows it.

## Component Expectations

### Navigation and Sidebar

- Header navigation must remain usable below desktop.
- Sidebar flows can convert to top bar plus drawer on smaller screens.
- Flyout and drawer surfaces must keep keyboard access and focus-visible states.

### Cards and Panels

- Card and panel content must reflow without page-level horizontal overflow.
- Actions may stack on smaller widths.
- Decorative density should increase only at larger widths.

### Data and Controls

- Tables use internal overflow handling, not page overflow.
- Pagination, segmented control, tabs, and steppers must remain usable in narrower layouts.
- Dropdown, accordion, modal, drawer, search overlay, and toast keep their open/close behavior at all sizes.

### Footer

- Footer columns may stack or reflow on smaller widths.
- Bottom-bar and layered footer variants must keep clean edges and no page overflow.
- Footer links and headings must preserve hierarchy without crowding adjacent columns.

## Motion and States

Responsive validation is not only layout validation. Confirm:

- hover
- active
- focus-visible
- disabled
- ARIA/state classes
- reduced-motion behavior
- open and close behavior for interactive surfaces

## Failure Conditions

A page is not responsive-complete if any of the following are true:

- page-level horizontal overflow appears
- layout depends on arbitrary values or inline styles
- text stays locked to an obviously desktop-only scale on phone widths
- controls lose focus-visible or keyboard access at any viewport
- interactive surfaces break because `nexled.js` is missing