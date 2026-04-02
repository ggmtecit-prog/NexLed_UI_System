# NexLed Skills Reference

This file is a lightweight project-facing summary of the skills used most often in NexLed work.

## Source of Truth

The live skill inventory and invocation rules are defined in:

- `AGENTS.md`
- `CLAUDE.md`

Use those files as the operational source of truth when deciding which skills must be used for a task.

## Commonly Used Skills

### System and Architecture

- `design-system-patterns`
- `ckm-design-system`
- `create-design-system-rules`

### Implementation and UX

- `frontend-design`
- `ui-ux-pro-max`
- `responsive-design`
- `normalize`
- `arrange`
- `typeset`

### Review and Hardening

- `audit`
- `polish`
- `harden`
- `optimize`

## Usage Rule

If a user explicitly names a skill, or the task clearly matches a skill's purpose, use that skill for the turn and follow its `SKILL.md` instructions.

## Project Rule

Skills are support workflows. They do not override NexLed system constraints:

- published classes only
- published tokens only
- no inline styles
- no arbitrary values
- copy existing components before inventing new structure