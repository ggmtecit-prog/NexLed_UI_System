# Phase 5 Project Audit Report

Date: 2026-03-27
Scope: `index.html`, `Atoms.html`, `molecules.html`, `organisms.html`, `pages.html`, `tokens.html`, `src/nexled.css`, `src/nexled.js`
Policy sources: `CLAUDE.md`, `docs/project/ROADMAP.md`, `docs/guides/RESPONSIVE_RULES.md`, repo-local mirrors of `src/config-cdn.js`, `src/nexled.css`, `COMPONENTS.md`

## Executive Summary

The NexLed system is structurally close to a usable Phase 5 demo system, but it is not fully Phase 5 compliant yet.

What is working well:
- All top-level HTML demo pages keep a consistent docs shell structure.
- No audited root HTML page contains `<style>` blocks or inline `style=""` attributes.
- The shared CSS uses the published breakpoint contract (`480 / 768 / 1024 / 1440`) consistently.
- Newer organism work in `src/nexled.css` and `src/nexled.js` shows stronger ARIA, focus, and reduced-motion discipline than the earlier demo layers.

What is blocking full compliance:
- Every audited HTML page still fails the strict required `<head>` block rule.
- The shared JS layer is inconsistent across components; `Search Overlay` is styled and demoed but not implemented in `src/nexled.js`.
- Some older demos still depend on inline JS handlers.
- One filename/link mismatch (`Atoms.html` vs `atoms.html`) is a real deployment risk on case-sensitive hosting.
- The built-in checker in `scripts/audit-compliance.js` is too lenient and currently reports false positives (`PASS`) against stricter Phase 5 rules.

Overall verdict: **Partially aligned, not release-clean**.

## Severity Summary

### High
1. All audited HTML pages violate the exact required CDN-only `<head>` block.
2. `Search Overlay` has shared CSS and demo markup but no shared JS controller.
3. Accordion JS only initializes inside `#accordion`, so it is not a truly shared component script.
4. Hover-trigger dropdowns have no touch-safe fallback.
5. `Atoms.html` filename casing does not match the linked `atoms.html` references used across the docs shell.

### Medium
1. Older demos still rely on inline `onclick` and `onerror` handlers.
2. Accordion open state uses a fixed `max-height` that can truncate real content.
3. Reduced-motion coverage is incomplete for accordion and dropdown families.
4. `body { overflow-x: hidden; }` can mask responsive overflow defects instead of exposing them.
5. `scripts/audit-compliance.js` does not enforce the true Phase 5 `<head>` rule.

### Low / Process
1. `.impeccable.md` is still missing, which limits full use of the skill stack that expects persistent design context.
2. Phase 5 requires validation at `360, 480, 768, 1024, 1440, 1920`; this audit is code-based and does not replace browser verification.

## Cross-Page Compliance Matrix

| Page | Exact CDN-only head block | Local fallback assets in head | Inline `style` / `<style>` | Inline JS handlers | `atoms.html` case risk | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `index.html` | Fail | Yes | Pass | `onerror` only | Yes | Shell structure is otherwise consistent |
| `Atoms.html` | Fail | Yes | Pass | `onerror` + multiple `onclick` | Yes | Highest demo-level rule drift |
| `molecules.html` | Fail | Yes | Pass | `onerror` + `onclick` | Yes | Demo surface still mixes old and new patterns |
| `organisms.html` | Fail | Yes | Pass | `onerror` + `onclick` | Yes | Organism layer stronger than legacy demos, but not fully clean |
| `pages.html` | Fail | Yes | Pass | `onerror` only | Yes | Minimal page shell, same head issue |
| `tokens.html` | Fail | Yes | Pass | `onerror` only | Yes | Good structure, same head issue |

## Detailed Findings

### 1. Exact `<head>` block is not implemented on any audited HTML page
Severity: High

Observed pattern on all audited pages:
- local `src/config-cdn.js`
- local `src/nexled.css`
- local `src/nexled.js`
- `onerror` fallbacks to CDN URLs

This preserves rough load order but does **not** match the exact required Phase 5 CDN-only block.

Examples:
- `index.html:21`, `index.html:23`, `index.html:27`
- `Atoms.html:21`, `Atoms.html:22`, `Atoms.html:25`
- `molecules.html:21`, `molecules.html:23`, `molecules.html:27`
- `organisms.html:21`, `organisms.html:22`, `organisms.html:25`
- `pages.html:21`, `pages.html:22`, `pages.html:25`
- `tokens.html:21`, `tokens.html:22`, `tokens.html:25`

Impact:
- Fails the current documented contract.
- Keeps inline event attributes (`onerror`) in the head.
- Makes the docs pages diverge from the consumer guidance.

### 2. Search Overlay is incomplete in the shared bundle
Severity: High

The component exists in demo markup and CSS:
- `organisms.html:1824`
- `organisms.html:1985`
- `src/nexled.css:7299`
- `src/nexled.css:7487`

But `src/nexled.js` has no `search-overlay` / `data-search-overlay-*` controller.

Impact:
- No shared open/close behavior.
- No shared Escape handling.
- No focus-management guarantee.
- No shared trigger-state sync despite CSS expecting `[data-search-overlay-target][aria-expanded="true"]`.

### 3. Accordion JS is not generalized
Severity: High

The initializer is scoped to `#accordion .accordion-trigger`:
- `src/nexled.js:6`

Impact:
- Any accordion rendered outside that id misses the shared behavior.
- The component is documented as a shared system primitive but implemented like a page demo.

### 4. Hover-trigger dropdowns are not touch-safe
Severity: High

The dropdown script removes hover-dropdowns from the click-initialized set and wires them only to `mouseenter` / `mouseleave`:
- `src/nexled.js:122`
- `src/nexled.js:124`
- `src/nexled.js:128`

Impact:
- This is a responsive interaction gap on touch devices.
- The component becomes mode-dependent in a way the shared API does not surface clearly.

### 5. `Atoms.html` casing mismatch will break on case-sensitive hosting
Severity: High

Repo file:
- `Atoms.html`

Linked path used across the docs shell:
- `atoms.html`

Examples:
- `index.html:70`
- `molecules.html:68`
- `organisms.html:60`
- `pages.html:67`
- `tokens.html:60`

Impact:
- Works locally on Windows.
- Can fail in production on Linux/static hosting.

### 6. Inline JS handlers remain in demo pages
Severity: Medium

Examples:
- `Atoms.html:222` through `Atoms.html:290` (`onclick` toggle demos)
- `molecules.html:331`, `343`, `355`, `385`, `534`
- `organisms.html:979`

Impact:
- Older demos still bypass the shared JS layer.
- Increases inconsistency and makes compliance harder to audit.

### 7. Accordion open state can truncate content
Severity: Medium

Shared CSS:
- `src/nexled.css:3833`
- `src/nexled.css:3843`

Current pattern:
- closed: `max-height: 0; overflow: hidden;`
- open: `max-height: var(--size-btn-xl-w)`

Impact:
- Content taller than the tokenized cap can be clipped.
- This is a systemic component limitation, not a one-off demo issue.

### 8. Reduced-motion coverage is incomplete for older component families
Severity: Medium

Reduced-motion block begins here:
- `src/nexled.css:8088`

Accordion and dropdown transition families are defined earlier here:
- `src/nexled.css:3833`
- `src/nexled.css:4337`

But those selector families are not part of the reduced-motion override set.

Impact:
- Users requesting reduced motion still receive some open/close transforms and rotations.

### 9. Global horizontal overflow is being hidden, not always solved
Severity: Medium

Shared CSS:
- `src/nexled.css:9777`

Current rule:
- `body { overflow-x: hidden; }`

Impact:
- Can hide page-level overflow instead of forcing proper internal scroll regions.
- Makes responsive regressions easier to miss during manual QA.

### 10. The built-in compliance checker is too lenient for Phase 5
Severity: Medium

Relevant logic:
- `scripts/audit-compliance.js:97`
- `scripts/audit-compliance.js:142`

Current behavior:
- checks for presence/order of Tailwind, `config-cdn.js`, `nexled.css`
- does **not** enforce the exact CDN-only head block
- does **not** fail the current local/fallback pattern

Observed result:
- `node scripts/audit-compliance.js index.html Atoms.html molecules.html organisms.html pages.html tokens.html`
- output: all 6 files `PASS`

Impact:
- The project can report compliance while still violating the stricter Phase 5 rules.

## General Critique

### What the system is doing well
- The project has moved toward a stronger catalog structure with consistent docs shells and clearer demo organization.
- The shared component work in later passes is meaningfully better than the legacy layer: more `aria-*`, more `inert`, more state synchronization, and more deliberate motion handling.
- The breakpoint system itself is coherent. I did not find invented breakpoint values in the shared CSS.
- The design system is visibly converging on one interaction language instead of many isolated demos.

### Where the system still feels structurally uneven
- The project is currently half design system, half demo harness. Some components are implemented as real shared primitives; others are still page-scoped examples with inline behavior.
- Compliance policy and actual tooling are out of sync. The docs now demand the exact CDN-only head block, but the pages and the checker still tolerate the old local-fallback pattern.
- A few older implementation shortcuts are still present in the foundation layer, especially around accordion sizing, hover-only interaction, and global overflow suppression.
- The system is stronger at component styling than at end-to-end operational rigor. Phase 5 now needs cleanup, verification discipline, and tooling alignment more than more component invention.

## Recommended Priority Order

### P0: Make the docs pages truthful and deploy-safe
1. Normalize all audited HTML pages to the exact required CDN-only head block.
2. Resolve the `Atoms.html` vs `atoms.html` filename/path mismatch.
3. Remove inline event handlers from demo markup where shared JS should own the interaction.

### P1: Fix shared interaction gaps
1. Implement a shared Search Overlay controller in `src/nexled.js`.
2. Generalize accordion initialization beyond `#accordion`.
3. Add a touch-safe/click fallback for hover-trigger dropdowns.

### P2: Harden foundation behavior
1. Replace fixed accordion max-height behavior with content-measured expansion or another non-truncating pattern.
2. Extend reduced-motion overrides to older accordion/dropdown transitions.
3. Remove or narrow global `body { overflow-x: hidden; }` and re-verify sanctioned overflow regions.

### P3: Make the audit tooling match the policy
1. Tighten `scripts/audit-compliance.js` to enforce the exact required head block.
2. Add checks for inline event handlers in demo HTML.
3. Add a case-sensitivity/path validation step for linked pages.

### P4: Close the Phase 5 process gaps
1. Browser-verify at `360, 480, 768, 1024, 1440, 1920`.
2. Run reduced-motion QA explicitly.
3. If the team wants the full skill workflow to work as intended, create `.impeccable.md` through the proper guided process.

## Validation Notes

This report is based on:
- source inspection
- targeted grep/search checks
- `node --check src/nexled.js`
- `node scripts/audit-compliance.js ...`

This report does **not** include:
- browser rendering verification at the required breakpoints
- touch-device manual interaction testing
- visual regression testing
- Lighthouse/Core Web Vitals measurement
- Figma-based design rule generation via MCP

## Appendix: Key Audit Commands Used

- `node --check src/nexled.js`
- `node scripts/audit-compliance.js index.html Atoms.html molecules.html organisms.html pages.html tokens.html`
- project-wide searches for:
  - `<style` / `style="`
  - `onclick=` / `onerror=`
  - `aria-*`
  - responsive `@media` rules
  - `prefers-reduced-motion`
  - `search-overlay`
  - `atoms.html`
