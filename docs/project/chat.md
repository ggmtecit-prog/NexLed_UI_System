# NexLed UI System

## Focus
Improve the UI system in the correct order so component fixes, responsive behavior, accessibility, and motion build on a stable foundation.

## Best Order
1. Define responsive and breakpoint rules.
2. Fix foundation issues in tokens, sizing, states, and layout behavior.
3. Fix core components batch by batch.
4. Make those components responsive.
5. Add or adjust interaction states and accessibility.
6. Do a light polish pass on that batch.
7. After the full system is stable, add animations.
8. Finish with one final global polish pass.

## How To Work
- Fixing is early. Polishing is late.
- Do not add animations before the system and components are stable.
- Work mobile-first and use the existing NexLed breakpoints only.
- Keep component fixes and responsive fixes together by batch.
- Do a small polish pass after each batch, then one final global polish pass at the end.

## Suggested Batch Flow
For each component batch, follow this sequence:
1. Fix broken behavior and structural issues.
2. Make the batch responsive.
3. Add or correct hover, active, focus-visible, disabled, and ARIA states.
4. Do a light polish pass.

## Suggested Core Batches
### Batch 1
- Buttons
- Inputs
- Dropdown
- Accordion
- Modal
- Drawer Sheet

### Batch 2
- Data Table
- Pagination
- Empty State
- Tabs
- Segmented Control

### Batch 3
- Carousel
- Footer
- Announcement Bar
- Layout wrappers
- Page header patterns

## System Rules
- Read `src/config-cdn.js`, `src/nexled.css`, and `COMPONENTS.md` before implementation work.
- Use only NexLed tokens, component classes, and documented patterns.
- No inline styles, local CSS files, or arbitrary Tailwind values.
- Keep responsive rules consistent across components and pages that use the UI system as a base.
- Respect reduced-motion behavior when animation work begins.

## Current Priority
Start with responsive and breakpoint rules, then foundation fixes, then Batch 1.
