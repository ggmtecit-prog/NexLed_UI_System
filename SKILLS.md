# Skills Reference — NexLed UI System

All installed skills for this project, organized by category with usage guidance.

---

## Installation

Run these four commands to install all 25 skills:

```bash
npx skills add pbakaus/impeccable
npx skills add nextlevelbuilder/ui-ux-pro-max-skill
npx skills add wshobson/agents
npx skills add figma/mcp-server-guide
```

| Source | Skills installed |
|--------|-----------------|
| `pbakaus/impeccable` | adapt, animate, arrange, audit, bolder, clarify, colorize, critique, delight, distill, extract, frontend-design, harden, normalize, onboard, optimize, overdrive, polish, quieter, teach-impeccable, typeset |
| `nextlevelbuilder/ui-ux-pro-max-skill` | ckm-design-system, ui-ux-pro-max |
| `wshobson/agents` | design-system-patterns |
| `figma/mcp-server-guide` | create-design-system-rules |

---

## How to Invoke a Skill

Type `/skill-name` in Claude Code. Some skills accept an optional argument:

```
/audit
/audit navbar
/animate hero-section
/ui-ux-pro-max
```

---

## Category 1 — Design System Foundation

These skills are the backbone for token architecture, theming, and systematic design.

---

### `ckm-design-system`

**What it does:** Manages token architecture, component specifications, and presentation/slide generation. Implements a strict three-layer token model: Primitive → Semantic → Component.

**When to use:**
- Creating or restructuring design tokens (colors, spacing, typography)
- Generating CSS variable systems
- Performing design-to-code handoff
- Configuring Tailwind themes via tokens
- Creating brand-compliant HTML presentations/slides with Chart.js

**How to use it best:**

The skill works in three areas:

1. **Token generation** — feed it a `tokens.json` config:
   ```bash
   node scripts/generate-tokens.cjs --config tokens.json -o tokens.css
   ```

2. **Token validation** — scan your source for hardcoded values:
   ```bash
   node scripts/validate-tokens.cjs --dir src/
   ```

3. **Slide creation** — generate a full HTML presentation:
   ```
   /ckm-design-system "10-slide investor pitch for NexLed"
   ```
   All slides must import `assets/design-tokens.css` and use `var(--token-name)` exclusively.

**Token layer example:**
```css
/* Primitive */
--color-blue-600: #2563EB;

/* Semantic */
--color-primary: var(--color-blue-600);

/* Component */
--button-bg: var(--color-primary);
```

**Key rule:** Never use raw hex values in components — always reference a token.

---

### `design-system-patterns`

**What it does:** Provides architectural patterns for building scalable design systems — token hierarchies, theme switching (light/dark), multi-brand theming, component APIs, and Figma-to-code pipelines.

**When to use:**
- Setting up light/dark theme switching with CSS custom properties
- Architecting component libraries with consistent variant/size APIs
- Establishing Figma → Style Dictionary → code pipelines
- Multi-brand token systems

**How to use it best:**

Invoke it when you need to make structural decisions about the system, not just implement components. It provides:

- **CVA (class-variance-authority)** patterns for variant/size systems
- **React ThemeProvider** boilerplate with system preference detection
- **Style Dictionary** config for CSS, SCSS, iOS, and Android output
- Named token conventions (`text-primary` not `dark-gray`)

**Common pitfalls it helps avoid:**
- Token sprawl (too many tokens with no hierarchy)
- Inconsistent naming (camelCase vs kebab-case)
- Tokens missing dark mode equivalents
- Hardcoded values creeping into components

---

### `create-design-system-rules`

**What it does:** Generates custom design system rules tailored to your codebase and saves them into `CLAUDE.md` (or `AGENTS.md` / `.cursor/rules/`). Requires the Figma MCP server.

**When to use:**
- Starting a project that uses Figma designs
- Onboarding an AI agent to an existing codebase with established patterns
- Standardizing Figma-to-code workflows across the team
- Updating rules as the project evolves

**How to use it best:**

```
/create-design-system-rules
```

The skill follows a 5-step workflow:
1. Calls the Figma MCP `create_design_system_rules` tool
2. Analyzes your codebase (component structure, styling approach, tokens)
3. Generates project-specific rules (component paths, token usage, import conventions)
4. Saves them to the appropriate agent config file
5. Validates with a test component

**Pro tip:** Prefix critical rules with `IMPORTANT:` to ensure they are always respected. Be specific — "Use Button from `src/components/ui/Button.tsx` with variant `'primary' | 'secondary'`" beats "use the design system."

> **Prerequisite:** Figma MCP server must be connected and active.

---

## Category 2 — UI/UX Intelligence

---

### `ui-ux-pro-max`

**What it does:** Comprehensive design intelligence for web and mobile — 50+ UI styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, and 25 chart types. Works across 10 stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, HTML/CSS).

**When to use:**
- Designing new pages (landing, dashboard, admin, SaaS, mobile app)
- Choosing color schemes, typography, or style direction
- Reviewing UI for accessibility, usability, or visual consistency
- Adding dark mode, charts, navigation patterns, or animation

**How to use it best:**

**Step 1 — Generate a complete design system for a project:**
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness service" --design-system -p "Serenity Spa"
```

**Step 2 — Persist it for future sessions (master + per-page overrides):**
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "fintech dashboard" --design-system --persist -p "MyApp" --page "dashboard"
```
Creates `design-system/MASTER.md` and `design-system/pages/dashboard.md`.

**Step 3 — Search specific domains for detail:**

| Need | Command |
|------|---------|
| Style options | `--domain style "glassmorphism dark"` |
| Color palettes | `--domain color "entertainment vibrant"` |
| Font pairings | `--domain typography "elegant luxury"` |
| Chart types | `--domain chart "real-time dashboard"` |
| UX best practices | `--domain ux "animation accessibility"` |
| React/Next.js perf | `--domain react "rerender memo list"` |

**Priority rule checklist (highest to lowest):**
1. Accessibility — contrast 4.5:1, keyboard nav, ARIA
2. Touch & interaction — 44×44px min targets, loading feedback
3. Performance — WebP, lazy loading, CLS < 0.1
4. Style consistency — no emoji as icons, consistent icon family
5. Layout — mobile-first, no horizontal scroll
6. Typography & color — 16px base, semantic tokens
7. Animation — 150–300ms, transform/opacity only
8. Forms & feedback — visible labels, error near field
9. Navigation — predictable back, bottom nav ≤ 5 items
10. Charts & data — legends, tooltips, accessible colors

---

## Category 3 — Build & Create

---

### `frontend-design`

**What it does:** Creates distinctive, production-grade frontend interfaces. Avoids generic "AI slop" aesthetics. Requires confirmed design context before proceeding.

**When to use:**
- Building new pages, components, posters, or applications
- Any task that will change how something looks, feels, or moves

**How to use it best:**

Always requires project design context. It will:
1. Check your loaded instructions for a `## Design Context` section
2. Check `.impeccable.md` in the project root
3. If neither exists, run `teach-impeccable` before proceeding

**Core aesthetic rules:**
- Commit to a bold direction (brutally minimal, maximalist, retro-futuristic, etc.)
- Use `oklch()` and `color-mix()` for perceptually uniform palettes
- Never use pure `#000` or `#fff` — always tint
- Avoid: gray text on colored backgrounds, gradient text on headings, glass cards as decoration, identical card grids
- Typography: avoid Inter/Roboto/Arial — pick distinctive display + refined body pairing
- Motion: `transform`/`opacity` only, `ease-out` for entering, `ease-in` for exiting

**The AI slop test:** If someone could guess "AI made this" immediately — redesign it.

---

## Category 4 — Refinement Skills

These skills refine and improve existing interfaces. Most require project design context (`teach-impeccable` first).

---

### `teach-impeccable`

**What it does:** One-time setup that gathers design context for the project and saves it to `.impeccable.md`. Required by most refinement skills before they can run.

**When to use:** Before running any refinement skill on a project that has no established design context.

**How to use it:**
```
/teach-impeccable
```
It scans the codebase, asks focused questions about users, brand personality, and aesthetic direction, then writes a `## Design Context` section to `.impeccable.md`.

---

### `audit`

**What it does:** Systematic quality scan across accessibility, performance, theming, and responsive design. Generates a report with severity ratings. Does NOT fix — documents issues for other skills to address.

**When to use:** Pre-launch review, after a major feature build, or when quality feels off but the problem is unclear.

**Example:**
```
/audit
/audit checkout-flow
```

---

### `critique`

**What it does:** Holistic design critique from a UX director perspective — visual hierarchy, information architecture, emotional resonance, and overall design effectiveness.

**When to use:** When you need honest feedback on whether an interface actually works as a designed experience.

---

### `normalize`

**What it does:** Brings a feature or page into alignment with the established design system — components, tokens, spacing, typography, patterns.

**When to use:** After fast-iteration work that drifted from the design system, or when onboarding a new page to match the rest of the product.

---

### `polish`

**What it does:** Final pre-ship quality pass. Fixes alignment, spacing, consistency, and micro-detail issues.

**When to use:** Right before a feature ships. Catches the small things that separate good from great.

---

### `harden`

**What it does:** Makes interfaces resilient — error handling, i18n support, text overflow, extreme inputs (very long names, empty states, RTL text, emojis).

**When to use:** Before shipping any user-facing input surface, form, or content area.

---

### `optimize`

**What it does:** Fixes performance issues — loading speed, rendering, animations, images, bundle size, Core Web Vitals (LCP, CLS, INP).

**When to use:** When a page feels slow, janky, or scores poorly in Lighthouse.

---

### `adapt`

**What it does:** Adapts existing designs to work across different screen sizes, devices, or platforms (mobile, tablet, desktop, print).

**When to use:** When a design works on desktop but breaks on mobile, or needs to work across multiple contexts.

---

### `animate`

**What it does:** Adds purposeful animations and micro-interactions — hover states, transitions, entrance/exit effects, loading states.

**When to use:** When a UI feels static or lacks feedback on interaction.

**Rules it enforces:**
- Only `transform` and `opacity` — never `width`, `height`, `top`, `left`
- Duration 150–300ms for micro-interactions
- Respect `prefers-reduced-motion`

---

### `typeset`

**What it does:** Improves typography — font choices, hierarchy, sizing, weight consistency, and readability. Turns default-looking text into intentional, polished type.

**When to use:** When text feels generic, uses system defaults (Inter/Roboto/Arial), has muddy hierarchy, or inconsistent sizing.

---

### `arrange`

**What it does:** Improves layout, spacing, and visual rhythm. Fixes monotonous card grids, arbitrary spacing, and weak hierarchy through intentional composition.

**When to use:** When the layout feels "off" despite correct colors/fonts — cramped, too sparse, too repetitive, or lacking visual rhythm.

---

### `overdrive`

**What it does:** Pushes interfaces past conventional limits with technically ambitious implementations — View Transitions, scroll-driven animation, WebGL shaders, virtual scrolling, spring physics, Web Workers, WASM.

**When to use:** When you want to make users ask "how did they do that?" — for a specific feature or interaction that should feel extraordinary.

> **Note:** Always proposes 2-3 directions before building. Requires browser automation for visual iteration.

---

## Category 5 — Visual Direction Adjustments

These skills shift the visual direction of an existing design. All require `teach-impeccable` first.

---

### `bolder`

**What it does:** Amplifies safe or boring designs — adds impact, personality, and visual energy while maintaining usability.

**When to use:** When the design feels generic, forgettable, or too safe for the brand.

---

### `quieter`

**What it does:** The opposite of `bolder` — tones down overly aggressive or visually noisy designs.

**When to use:** When a design feels overwhelming, too intense, or out of tone with the product.

---

### `colorize`

**What it does:** Introduces strategic color to monochromatic or visually flat designs.

**When to use:** When a UI is too gray, cold, or lacks brand expression.

---

### `distill`

**What it does:** Strips designs to their essence — removes unnecessary elements, complexity, and visual noise.

**When to use:** When a feature has grown cluttered or has too many competing visual elements.

---

### `delight`

**What it does:** Adds moments of joy, personality, and unexpected touches — Easter eggs, micro-animations, playful copy, satisfying interactions.

**When to use:** When a functional product needs more emotional resonance and memorability.

---

### `clarify`

**What it does:** Improves UX copy — error messages, labels, instructions, microcopy, empty states.

**When to use:** When users are confused by interface text, or when error messages are vague.

---

## Category 6 — System Building

---

### `extract`

**What it does:** Identifies repeated patterns, hard-coded values, and inconsistent implementations, then extracts them into reusable design system components and tokens.

**When to use:** When a codebase has grown organically and needs to be systematized — multiple button implementations, inconsistent spacing, hardcoded colors.

---

### `onboard`

**What it does:** Designs or improves first-time user experiences — onboarding flows, empty states, zero-data states.

**When to use:** When new users struggle to understand the product or reach the "aha moment."

---

## Quick Decision Guide

| Situation | Skill to Use |
|-----------|-------------|
| Starting a new project, need design foundation | `teach-impeccable` → `ui-ux-pro-max` |
| Building a new page or component | `frontend-design` |
| Need design tokens / token architecture | `ckm-design-system` or `design-system-patterns` |
| Connect Figma designs to codebase rules | `create-design-system-rules` |
| Design feels generic or safe | `bolder` |
| Design feels too loud or aggressive | `quieter` |
| Design is too gray / lacks color | `colorize` |
| Design is too cluttered | `distill` |
| UI text is confusing | `clarify` |
| Interface needs more joy / personality | `delight` |
| Pre-launch quality check (report only) | `audit` |
| Fix identified quality issues | `polish` + `harden` + `optimize` |
| Design drifted from the system | `normalize` |
| Desktop design needs mobile/tablet support | `adapt` |
| UI feels static, needs motion | `animate` |
| Typography feels generic or inconsistent | `typeset` |
| Layout feels off, crowded, or monotonous | `arrange` |
| Push a feature past conventional browser limits | `overdrive` |
| Honest UX feedback on a feature | `critique` |
| Consolidate repeated patterns into system | `extract` |
| New users are confused / drop off | `onboard` |
| Full UI/UX intelligence for color, type, style | `ui-ux-pro-max` |

---

## Notes

- Skills that modify visual design require project context — run `/teach-impeccable` once per project to set this up.
- `create-design-system-rules` requires the Figma MCP server to be active.
- `ui-ux-pro-max` domain search commands require Python 3 installed locally.
- `ckm-design-system` slide features require Chart.js loaded via CDN in the output HTML.
- Skills marked `user-invokable` can be called directly with `/skill-name`.
