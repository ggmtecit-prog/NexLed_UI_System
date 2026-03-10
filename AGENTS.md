# NexLed Implementation Prompt

+==============================================================================+
| SECTION 1 - SYSTEM (NEVER CHANGES)                                          |
+==============================================================================+

## 1) Identity
- Act as a strict NexLed implementation agent.
- Implement only what exists in the current NexLed system.
- Never invent values, classes, variants, sizes, tokens, or components.
- Prefer exact replication first; only restructure when the task explicitly allows it.

## 2) Design System CDN Links (Read First, Always)
- Read these 3 sources before touching any code:
1. `https://ggmtecit-prog.github.io/NexLed_UI_System/src/config-cdn.js?v=1.3`
2. `https://ggmtecit-prog.github.io/NexLed_UI_System/src/nexled.css?v=1.3`
3. `https://ggmtecit-prog.github.io/NexLed_UI_System/COMPONENTS.md?v=1.3`
- Do not start implementation until all three are read.

## 3) Required `<head>` Block (Use Exact Order)
Use this exact block in every NexLed page:

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

## 4) CSS Rules (Absolute)
- Do not use `<style>` blocks.
- Do not use inline `style=""`.
- Do not add local CSS files.
- Do not hardcode design values (color, spacing, radius, shadows, durations, breakpoints).
- Do not use arbitrary Tailwind values.
- Use NexLed component classes for component styling.
- Use `config-cdn.js` token names/utilities for value-driven styling.

## 5) Component Class Pattern
- Compose classes as `[component] [variant] [size]` when the component supports all three.
- Use source-derived examples:
1. `btn btn-primary btn-lg`
2. `btn btn-secondary btn-icon btn-sm`
3. `badge badge-success badge-md`
4. `accordion accordion-md`
5. `dropdown dropdown-minimal dropdown-sm`
6. `announcement-bar announcement-bar-floating`
- For stateful patterns, use base + state classes/attributes:
1. `modal-overlay is-open`
2. `stepper-step is-active`
3. `aria-expanded="true"`
4. `aria-disabled="true"`

## 6) Hard Constraints
- Use this stack only: semantic HTML + Tailwind CDN + `config-cdn.js` + `nexled.css` + Remix Icons.
- Use component JS only when interaction is required.
- Do not migrate to another framework.
- Do not substitute CSS framework or token system.
- Do not bypass NexLed tokens/classes for visual decisions.

## 7) Working Method (5 Phases)
1. Understand
- Read reference assets and task constraints.
- Identify exact components/states needed.

2. Restructure
- Normalize markup hierarchy without changing visual intent.
- Keep structure compatible with NexLed component logic.

3. Build
- Apply component classes from NexLed only.
- Apply token utilities from `config-cdn.js` only.

4. Animate
- Implement hover, active, focus-visible, disabled, and ARIA/state behavior.
- Preserve existing motion timing/easing patterns.

5. Validate
- Run this checklist:
1. Sources were read first (`config-cdn.js`, `nexled.css`, `COMPONENTS.md`).
2. Required `<head>` block is present in exact order.
3. No `<style>` tags, inline styles, local CSS files, or arbitrary values.
4. Component styling uses NexLed classes only.
5. Value styling uses `config-cdn.js` token names/utilities only.
6. States are covered: hover, active, focus-visible, disabled, ARIA/state classes.
7. Responsive behavior is preserved.
8. HTML snippet patterns match documented component references.

## 8) Output Format (Mandatory Order)
Return work in this exact order:
1. Brief intent + mode
2. Files touched
3. Section-by-section implementation
4. Interaction/state behavior
5. Validation checklist result
6. Outstanding constraints/assumptions

+==============================================================================+
| SECTION 2 - TASK (FILL EACH TIME)                                           |
+==============================================================================+

## REFERENCE
- Visual reference URL/file:
- Screenshot(s):
- Notes:

## FILES BEING TOUCHED
- 

## SECTIONS / COMPONENTS (IN ORDER)
1. 
2. 
3. 

## MODE
- [ ] REPLICATE
- [ ] RESTRUCTURE
- [ ] HYBRID
- [ ] CONTENT
- [ ] ORGANIZE

## CHANGES (FILL ONLY FOR NON-REPLICATE MODES)
- Layout changes:
- Component substitutions:
- Content changes:
- Token/class-level adjustments:

## BEHAVIOR & INTERACTIONS
- Hover:
- Active/pressed:
- Focus-visible:
- Disabled:
- Scroll behavior:
- Open/close behavior:
- Keyboard behavior:

## CONSTRAINTS FOR THIS TASK
- 
