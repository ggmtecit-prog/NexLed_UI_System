# Design Tokens Documentation

This document contains all design tokens used in the UI System. These tokens ensure consistency across the design system and should be referenced when creating or modifying components.

---

## 🎨 Colors

### Primary Colors
- **Green Primary**: `#03683D`
- **Green Secondary**: `#058C53`
- **Blue Primary**: `#386789`
- **Blue Secondary**: `#5B8BAA`
- **Red Primary**: `#B1242F`
- **Red Secondary**: `#C94A55`

### Neutrals
- **Black**: `#121212`
- **White**: `#FCFCFC`
- **Grey Primary**: `#878787`
- **Grey Secondary**: `#D9D9D9`
- **Grey Tertiary**: `#EDEDED`

### Interactive States
- **Green Hover Icons**: `#BEE0D2`
- **Green Hover Text**: `#E3F1EB`
- **Link Visited**: `#4C1D95`

---

## 📐 Spacing

| Token | Value |
|-------|-------|
| `4` | 4px |
| `8` | 8px |
| `10` | 10px |
| `12` | 12px |
| `16` | 16px |
| `20` | 20px |
| `24` | 24px |
| `32` | 32px |
| `40` | 40px |
| `48` | 48px |
| `56` | 56px |
| `64` | 64px |

---

## 🔤 Typography

### Font Family
- **Primary**: Urbanist, sans-serif

### Font Sizes

| Token | Desktop | Mobile |
|-------|---------|--------|
| `display` | 48px | - |
| `h1` | 36px | 30px |
| `h2` | 30px | 26px |
| `h3` | 24px | 22px |
| `body-lg` | 18px | - |
| `body` | 16px | - |
| `body-sm` | 14px | - |
| `body-xs` | 12px | - |
| `label` | 14px | - |
| `overline` | 12px | - |
| `button` | 14px | - |
| `button-lg` | 32px | - |
| `link` | 14px | - |

### Fluid Typography (Responsive)
- **H1 Fluid**: `clamp(30px, 4vw, 36px)`
- **H2 Fluid**: `clamp(26px, 3vw, 30px)`
- **H3 Fluid**: `clamp(22px, 2.5vw, 24px)`

### Line Heights

| Token | Value |
|-------|-------|
| `display` | 1 |
| `button-lg` | 40px |
| `h1` | 44px |
| `h2` | 38px |
| `h3` | 32px |
| `body-lg` | 28px |
| `body` | 24px |
| `body-sm` | 20px |
| `body-xs` | 16px |
| `label` | 18px |
| `overline` | 16px |
| `button` | 20px |
| `link` | 20px |

### Font Weights

| Token | Value |
|-------|-------|
| `light` | 300 |
| `regular` | 400 |
| `medium` | 500 |
| `semibold` | 600 |

### Typography Spacing

| Token | Value |
|-------|-------|
| `heading-top` | 32px |
| `heading-bottom` | 8px |
| `paragraph` | 16px |

---

## 🔘 Border Radius

| Token | Value |
|-------|-------|
| `none` | 0 |
| `3xs` | 2px |
| `2xs` | 4px |
| `xs` | 6px |
| `sm` | 8px |
| `md` | 12px |
| `lg` | 16px |
| `xl` | 24px |
| `btn` | 20px |
| `full` | 9999px |

---

## 🖼️ Borders

| Token | Value |
|-------|-------|
| `thin` | 1px |
| `standard` | 2px |
| `thick` | 4px |

---

## 🎭 Shadows

| Token | Value |
|-------|-------|
| `default` | `0 6px 14px rgba(135, 135, 135, 0.20)` |
| `hover` | `0 18px 36px rgba(190, 224, 210, 0.40), 0 6px 18px rgba(135, 135, 135, 0.15)` |
| `active` | `0 4px 10px rgba(0, 0, 0, 0.2)` |
| `glow` | `0 20px 40px rgba(16, 185, 129, 0.22)` |
| `hover-active` | `0 18px 36px rgba(5, 140, 83, 0.35)` |

---

## 🎬 Motion & Animation

### Duration
- **Default**: `400ms`

### Easing
- **Premium**: `cubic-bezier(0.16, 1, 0.3, 1)`

---

## 🎯 Interactive States

| Token | Value |
|-------|-------|
| `scale-hover` | 1.02 |
| `scale-press` | 0.98 |
| `scale-press-deep` | 0.92 |
| `lift-standard` | -3px |
| `lift-subtle` | -1px |
| `press-offset` | 1px |

---

## 👁️ Opacity

| Token | Value |
|-------|-------|
| `muted` | 0.80 |
| `semi` | 0.50 |
| `faint` | 0.10 |

---

## 🔍 Focus States

| Token | Value |
|-------|-------|
| `ring-width` | 4px |
| `ring-width-subtle` | 2px |
| `ring-color` | #121212 (black) |
| `ring-offset` | 0px |

---

## 📏 Sizing

### Buttons

| Size | Width | Height |
|------|-------|--------|
| XL | 420px | 110px |
| LG | 380px | 94px |
| MD | 320px | 72px |
| SM | 240px | 56px |

### Icon Buttons (Square)

| Size | Dimensions |
|------|------------|
| XL | 110px × 110px |
| LG | 94px × 94px |
| MD | 72px × 72px |
| SM | 56px × 56px |

### Checkboxes

| Size | Dimensions |
|------|------------|
| LG | 28px × 28px |
| MD | 22px × 22px |
| SM | 16px × 16px |

### Other Components

| Component | Value |
|-----------|-------|
| `thumb-md` | 120px |

---

## 🎨 Icons

### Sizes

| Token | Value |
|-------|-------|
| `xs` | 12px |
| `sm` | 16px |
| `md` | 20px |
| `lg` | 24px |
| `xl` | 32px |
| `xxl` | 48px |

### Stroke Widths

| Token | Value |
|-------|-------|
| `thin` | 1px |
| `default` | 1.5px |
| `bold` | 2px |

### Icon Colors

| Token | Color | Reference |
|-------|-------|-----------|
| `primary` | #03683D | green-primary |
| `secondary` | #878787 | grey-primary |
| `muted` | #D9D9D9 | grey-secondary |
| `danger` | #B1242F | red-primary |
| `success` | #03683D | green-primary |
| `on-dark` | #FCFCFC | white |

### Icon Gaps

| Token | Value |
|-------|-------|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 12px |
| `lg` | 20px |

---

## 📱 Breakpoints

| Token | Value |
|-------|-------|
| `mobile` | 480px |
| `tablet` | 768px |
| `desktop-sm` | 1024px |
| `desktop-lg` | 1440px |

---

## 📐 Layout

| Token | Value |
|-------|-------|
| `standard` | 1280px |
| `wide` | 1440px |
| `narrow` | 768px |
| `readable` | 65ch |

---

## 📚 Z-Index

| Token | Value | Usage |
|-------|-------|-------|
| `base` | 0 | Default layer |
| `dropdown` | 1000 | Dropdown menus |
| `sticky` | 1100 | Sticky elements |
| `overlay` | 2000 | Overlays |
| `modal` | 2100 | Modal dialogs |
| `popover` | 2200 | Popovers |
| `tooltip` | 3000 | Tooltips (highest) |

---

## 📝 Usage Notes

### CSS Custom Properties
All tokens are exported as CSS custom properties with the `--` prefix. For example:
- `--color-green-primary`
- `--spacing-16`
- `--radius-md`

### JavaScript Import
Tokens can be imported in JavaScript:
```javascript
import { colors } from './tokens/colors.js';
import { spacing } from './tokens/spacing.js';
import { radius } from './tokens/radius.js';
```

### Design Principles
1. **Always use tokens** instead of hardcoded values
2. **Maintain consistency** across all components
3. **Reference this document** when implementing new features
4. **Update tokens** rather than creating one-off values

---

*Last updated: January 29, 2026*
