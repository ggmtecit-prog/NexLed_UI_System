# NexLed UI System - Changelog

All notable changes to this project will be documented in this file.
Format follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- Shared opt-in page scroll reveal via `data-reveal="hero"` and `data-reveal="section"` for live projects using `nexled.js`.
- Reveal guidance in the consumer build guide and starter template.

---
## [1.3.0] Ã¢â‚¬â€ 2026-03-16

### Fixed
- CSS typo: `var(--color-grery-re)` corrected to `var(--color-grey-primary)` in dropdown value color
- Removed hardcoded `text-35px` and redundant `font-urbanist` span in product card (molecules.html)
- Standardized font loading across all pages to `Urbanist:wght@300;400;500;600;700` (was inconsistent)
- Fixed empty Figma link in tokens.html navigation
- Fixed UTF-8 encoding corruption in organisms.html comments

### Added
- `starter.html` Ã¢â‚¬â€ canonical boilerplate for new projects consuming NexLed via CDN
- `CLAUDE-PORTABLE.md` Ã¢â‚¬â€ drop-in AI implementation rules for external projects
- `version.json` Ã¢â‚¬â€ machine-readable version metadata
- `docs/CHANGELOG.md` Ã¢â‚¬â€ version history (this file)
- `docs/CONSUMERS.md` Ã¢â‚¬â€ registry of projects using NexLed
- `scripts/audit-compliance.js` Ã¢â‚¬â€ HTML linting tool for NexLed compliance
- `scripts/build-components-md.js` Ã¢â‚¬â€ auto-generates COMPONENTS.md from source files
- Rebuilt `COMPONENTS.md` with complete component reference and HTML snippets

---

## [1.2.0] Ã¢â‚¬â€ Prior

- Initial NexLed Design System release
- 30+ component families (atoms, molecules, organisms)
- Complete design token system (colors, spacing, typography, shadows, motion, breakpoints)
- Tailwind CDN integration via config-cdn.js
- Interactive component logic via nexled.js (accordion, dropdown, modal, stepper)
- CLAUDE.md implementation rules for AI-assisted development
- Skills system for Claude Code, Cursor, Windsurf, Continue, Qwen
