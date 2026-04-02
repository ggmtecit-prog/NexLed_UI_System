# NexLed UI System Roadmap

Current state snapshot: 2026-04-02.

## Current System State

The NexLed 1.3 system is implemented and published.

- shared tokens are live in `src/config-cdn.js`
- shared CSS is live in `src/nexled.css`
- shared runtime is live in `src/nexled.js`
- responsive foundation is implemented in the system CSS
- atoms, molecules, organisms, page shells, and demo pages are in active maintenance

## Active Workstream

The current workstream is documentation, compliance, and release hardening.

### Priority 1

- keep root docs aligned with the current system
- keep starter-kit mirror docs aligned with the root docs
- keep version metadata, human docs, and machine registry aligned

### Priority 2

- strengthen compliance auditing for `HTML + CSS + JS`
- enforce current NexLed `1.3` CDN usage
- detect outdated or unknown component usage against the generated registry

### Priority 3

- expand page demos that reuse published components exactly
- audit consumer projects against the current release contract

## Near-Term Delivery Rules

- root `docs/` and `scripts/` are canonical
- starter-kit copies are mirrors and must be updated in the same change set
- component registry and `COMPONENTS.md` are generated artifacts, not hand-maintained docs

## Success Criteria

The current hardening phase is complete when:

- live docs no longer contradict the current system
- historical docs are clearly marked as historical
- the compliance tool audits files or directories recursively
- the compliance tool inspects `HTML + CSS + JS`
- root and starter-kit metadata agree on version and registry paths
- registry generation produces both human and machine outputs consistently