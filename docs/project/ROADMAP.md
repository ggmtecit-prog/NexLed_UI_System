# NexLed UI System â€” Global Roadmap

Current state snapshot taken 2026-03-25.

---

## Phase 0 â€” Foundation

Fix the token and responsive CSS layer before touching any component.

**Status: Partially done**

| Step | Status | Detail |
|------|--------|--------|
| Responsive rules defined | Done | `docs/guides/RESPONSIVE_RULES.md` exists with breakpoints, typography matrix, component-family rules |
| Token system | Needs fixes | Width tokens defined but not consumed by CSS. Height/font ratios unbalanced at larger sizes. No fluid/responsive button tokens |
| Base responsive CSS | Not started | No `@media` rules in `nexled.css` for any component. The responsive rules doc exists but the CSS does not implement them |

### Work

1. Fix token gaps in `config-cdn.js` (button proportions, add fluid button tokens).
2. Add responsive `@media` scaffolding in `nexled.css` for the 4 breakpoints (480, 768, 1024, 1440).
3. Add base responsive behavior for layout containers (`size-grid-inline`, `size-grid-stack`).

### Where

`src/config-cdn.js`, `src/nexled.css`

---

## Phase 1 â€” Batch 1 Components

Core interactive controls.

**Components:** Buttons, Inputs, Dropdown, Accordion, Modal, Drawer Sheet, All of them

### Cycle per component

1. **Fix** â€” structural issues, missing token connections, broken proportions.
2. **Responsive** â€” add breakpoint rules per the responsive contract.
3. **States** â€” hover, active, focus-visible, disabled, ARIA.
4. **Light polish.**

### Known issues (Buttons)

- Width tokens defined in `config-cdn.js` but never applied in CSS.
- Height-to-font ratio too spacious at LG (3.1:1) and XL (3.4:1).
- Zero responsive behavior.
- Need stacking and full-width on mobile, intrinsic sizing restored from 768 upward.

### Where

`src/nexled.css`, verified in `Atoms.html` and `molecules.html`

---

## Phase 2 â€” Batch 2 Components

Data display and navigation controls.

**Components:** Data Table, Pagination, Empty State, Tabs, Segmented Control

### Cycle per component

Same 4-step cycle as Phase 1.

### Responsive guidance

- Data tables need internal scroll, not page-level horizontal overflow.
- Tabs and segmented control need wrapping or stacked layouts below desktop.
- Pagination needs compact layout on mobile.

### Where

`src/nexled.css`, verified in `molecules.html`

---

## Phase 3 â€” Batch 3 Components

Layout and structural components.

**Components:** Carousel, Footer, Announcement Bar, Layout wrappers, Page header patterns

### Cycle per component

Same 4-step cycle as Phase 1.

### Responsive guidance

- Footer and carousel increase density progressively.
- No big one-step jumps from small to large.
- Layout wrappers follow the container rhythm (16 / 20 / 24 / 32 / 40).

### Where

`src/nexled.css`, verified in `molecules.html` and `organisms.html`

---

## Phase 4 â€” Animation

Add motion system-wide after all three batches are stable.

- Hover, open/close, enter/exit transitions.
- Use `transform` and `opacity` only.
- Respect `prefers-reduced-motion`.
- Use existing NexLed timing and easing tokens.

### Where

`src/nexled.css`

---

## Phase 5 â€” Final Global Polish

Run the full `docs/guides/DEMO_CHECKLIST.md` across every page.

### Viewports

360, 480, 768, 1024, 1440, 1920

### Pages to validate

- `Atoms.html`
- `molecules.html`
- `organisms.html`
- `tokens.html`
- `pages.html`
- `page-demos/simple-brand.html`
- `starter-kit/starter.html`
- `starter-kit/examples/simple-brand-page.html`

### Checks

- No horizontal page overflow.
- All states working (hover, active, focus-visible, disabled, open/close).
- Reduced-motion behavior.
- All tokens and classes compliant.

---

## Phase 6 â€” Expand Page Demos

Only one demo exists (`page-demos/simple-brand.html`). Four more recipes are documented in `docs/guides/PAGE_RECIPES.md`:

1. Store / Catalog Page
2. Product Detail Page
3. Content / Help Page
4. Contact / Lead Page

Build each after the component system is stable and responsive.

---

## Summary

| Phase | What | Files |
|-------|------|-------|
| 0 | Fix foundation tokens + add responsive CSS scaffolding | `config-cdn.js`, `nexled.css` |
| 1 | Fix + responsify Batch 1 (Buttons, Inputs, Dropdown, Accordion, Modal, Drawer) | `nexled.css` then `Atoms.html`, `molecules.html` |
| 2 | Fix + responsify Batch 2 (Table, Pagination, Empty State, Tabs, Segmented) | `nexled.css` then `molecules.html` |
| 3 | Fix + responsify Batch 3 (Carousel, Footer, Announcement, Layout, Headers) | `nexled.css` then `molecules.html`, `organisms.html` |
| 4 | Add animations system-wide | `nexled.css` |
| 5 | Final global polish at all viewports | All HTML files |
| 6 | Build remaining page demos | `page-demos/` |

---

## Current position

Start of Phase 0. Responsive rules are written but nothing is implemented in the actual CSS. Buttons are the first visible symptom of that gap.

