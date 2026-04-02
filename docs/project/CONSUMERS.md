# NexLed Consumer Projects

Projects using NexLed via CDN should be tracked here.

## Registry

| Project | Version | Last Audit | Status | Notes |
| --- | --- | --- | --- | --- |
| UI System (this repo) | 1.3.0 | 2026-04-02 | Compliant | Canonical reference implementation |

## Required Consumer Contract

- Use NexLed CDN assets pinned to `?v=1.3`.
- Use published NexLed classes and published container tiers.
- Load `nexled.js` when interactive NexLed components are present.
- Pass the compliance auditor with `core fail, drift warn` enforcement.

## Audit Workflow

```bash
node scripts/audit-compliance.js path-to-project
node scripts/audit-compliance.js --json path-to-project
```

Recommended audit targets:

- page entry HTML files
- demo directories
- project-level HTML, CSS, and JS surfaces

## Adding a Consumer Project

When a new project adopts NexLed, add a row with:

- project name
- pinned NexLed version
- last audit date
- current status
- any consumer-specific notes

## Release Update Workflow

When NexLed publishes a new compatible release:

1. confirm `docs/project/CHANGELOG.md`
2. update CDN asset pins
3. rerun the compliance audit
4. update this registry