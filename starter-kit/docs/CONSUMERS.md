# NexLed Starter Kit Consumers

Use this file when auditing starter-kit-based projects.

## Starter Kit Contract

Starter-kit consumers must:

- pin NexLed assets to `?v=1.3`
- keep the published head block order intact
- load `nexled.js` when interactive NexLed components are present
- avoid local CSS overrides targeting NexLed component selectors
- pass the compliance audit with `core fail, drift warn`

## Audit Commands

```bash
node starter-kit/scripts/audit-compliance.js starter-kit/starter.html
node starter-kit/scripts/audit-compliance.js --json your-project-directory
```

## Published Starter-Kit References

- `starter-kit/version.json`
- `starter-kit/docs/COMPONENTS.md`
- `starter-kit/docs/component-registry.json`
- `starter-kit/scripts/audit-compliance.js`