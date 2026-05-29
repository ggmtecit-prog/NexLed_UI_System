# NexLed Button Motion

Use this as the motion reference when replicating NexLed buttons in another project. The rules below come from `src/nexled.css`, `src/config-cdn.js`, `src/nexled.js`, and `COMPONENTS.md`.

## Motion Tokens

Buttons use the fast motion token for direct interaction feedback:

```css
--motion-duration-fast: 150ms;
--motion-ease-premium: cubic-bezier(0.16, 1, 0.3, 1);
--lift-standard: -3px;
--press-offset: 1px;
```

Related shadows:

```css
--shadow-btn-default: 0 6px 14px rgba(135, 135, 135, 0.20);
--shadow-btn-hover: 0 18px 36px rgba(190, 224, 210, 0.40), 0 6px 18px rgba(135, 135, 135, 0.15);
--shadow-btn-active: 0 4px 10px rgba(0, 0, 0, 0.2);
--shadow-btn-hover-active: 0 18px 36px rgba(5, 140, 83, 0.35);
```

## Base Transition

Every `.btn` starts with `--shadow-btn-default` and transitions only the interactive properties:

```css
.btn {
  box-shadow: var(--shadow-btn-default);
  transition:
    transform var(--motion-duration-fast) var(--motion-ease-premium),
    box-shadow var(--motion-duration-fast) var(--motion-ease-premium),
    background-color var(--motion-duration-fast) var(--motion-ease-premium),
    border-color var(--motion-duration-fast) var(--motion-ease-premium),
    color var(--motion-duration-fast) var(--motion-ease-premium),
    opacity var(--motion-duration-fast) var(--motion-ease-premium);
}
```

There is also a broader shared rule on `.btn` with `transition: all var(--motion-duration-default) var(--motion-ease-premium)`, but the later `.btn` block overrides it with the fast, property-specific transition above.

## Interaction States

Hover:

```css
.btn:hover {
  transform: translateY(var(--lift-standard));
  box-shadow: var(--shadow-btn-hover);
}
```

Active or pressed by pointer:

```css
.btn:active {
  transform: translateY(var(--press-offset));
  box-shadow: var(--shadow-btn-active);
}
```

Keyboard focus:

```css
.btn:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-color);
  outline-offset: var(--focus-ring-offset);
}
```

Disabled:

```css
.btn:disabled,
.btn[aria-disabled="true"] {
  pointer-events: none;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
```

## Variant Motion

The physical motion is shared across `btn-primary`, `btn-secondary`, `btn-ghost`, and `btn-danger`. Variants only change colors and border colors on hover or active.

- `btn-primary`: hover and active shift to green secondary.
- `btn-secondary`: hover changes text and border to green tones; active adds a green-tinted background.
- `btn-ghost`: hover keeps `box-shadow: none`; active keeps the shared press transform but also keeps `box-shadow: none`.
- `btn-danger`: hover and active shift to red secondary.

## Toggle And Icon Buttons

Toggle buttons use `aria-pressed="true"` as the persistent active state.

```css
.btn-icon[aria-pressed="true"],
.btn-toggle[aria-pressed="true"] {
  background: var(--color-green-primary);
  color: var(--color-white);
  border-color: var(--color-green-primary);
  box-shadow: var(--shadow-btn-active);
}

.btn-icon[aria-pressed="true"]:hover,
.btn-toggle[aria-pressed="true"]:hover {
  background: var(--color-green-secondary);
  box-shadow: var(--shadow-btn-hover-active);
}
```

In `src/nexled.js`, any `[data-toggle-pressed]` element gets `type="button"` and defaults to `aria-pressed="false"` when missing. On click, the script flips `aria-pressed` between `true` and `false`.

## Replication Checklist

- Use `transition` on `transform`, `box-shadow`, `background-color`, `border-color`, `color`, and `opacity`.
- Use `150ms` with `cubic-bezier(0.16, 1, 0.3, 1)` for direct button feedback.
- Use `translateY(-3px)` on hover.
- Use `translateY(1px)` on active.
- Keep focus as an outline, not a transform.
- Remove transform and shadow for disabled or `aria-disabled="true"`.
- Drive persistent selected state with `aria-pressed="true"`, not a separate visual-only class.
