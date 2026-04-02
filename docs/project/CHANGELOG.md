# NexLed UI System Changelog

All notable changes to NexLed are documented here.

## [Unreleased]

### Added

- Canonical root `version.json` metadata for release and compliance tooling.
- Machine-readable `component-registry.json` generation alongside `COMPONENTS.md`.
- Directory-aware compliance auditing for `HTML + CSS + JS`.
- JSON output mode for the compliance auditor.

### Changed

- Refreshed `docs/` to reflect the current NexLed 1.3 system state.
- Aligned `starter-kit/version.json` with starter-kit-local docs and registry paths.
- Reclassified historical docs so they are no longer treated as live guidance.

### Fixed

- Broken Markdown fences in the consumer build guide.
- Encoding corruption and stale statements across project docs.
- Starter-kit script drift for component-registry generation.

## [1.3.0] - 2026-03-16

### Added

- `starter-kit/starter.html` as the canonical NexLed consumer starter page.
- Published `COMPONENTS.md` reference generated from the current system sources.
- `scripts/audit-compliance.js` for NexLed compliance checks.
- `scripts/build-components-md.js` for published component documentation generation.

### Fixed

- Standardized Urbanist font loading across system pages.
- Corrected dropdown color token typo in the shared CSS.
- Fixed empty Figma link references in `tokens.html`.
- Fixed UTF-8 corruption in system page comments.

## [1.2.0] - Prior

- Initial published NexLed design system release.
- Token, component, and runtime foundation established.