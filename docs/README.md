# NexLed Documentation

NexLed ships two documentation layers:

- `docs/` is the canonical project documentation.
- `starter-kit/docs/` contains mirrored release-facing copies for starter-kit consumers.

## Live Guidance

These files describe the current NexLed 1.3 system and should be kept in sync with the codebase:

- `docs/guides/RESPONSIVE_RULES.md`
- `docs/guides/CONSUMER_BUILD_GUIDE.md`
- `docs/guides/PAGE_RECIPES.md`
- `docs/guides/DEMO_CHECKLIST.md`
- `docs/project/ROADMAP.md`
- `docs/project/CHANGELOG.md`
- `docs/project/CONSUMERS.md`
- `docs/project/PROMPT_TEMPLATE.md`
- `docs/project/SKILLS.md`

## Historical Records

These files are preserved for reference only and are not normative implementation guidance:

- `docs/project/PHASE5_AUDIT_REPORT.md`
- `docs/project/chat.md`

## Canonical Sources of Truth

When docs, tooling, or release metadata change, update these files first:

- `version.json`
- `COMPONENTS.md`
- `component-registry.json`
- `scripts/build-components-md.js`
- `scripts/audit-compliance.js`

## Sync Rule

Root files are canonical.

- `docs/` and `scripts/` are the source of truth.
- `starter-kit/docs/` and `starter-kit/scripts/` must be updated in the same change set.
- `COMPONENTS.md` and `component-registry.json` are generated artifacts and must be regenerated after component or registry changes.