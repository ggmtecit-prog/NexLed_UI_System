# NexLed Demo Checklist

## Viewports

Validate every page demo at:

- 360
- 480
- 768
- 1024
- 1440
- 1920

## Layout

- No uncontrolled horizontal page overflow
- Container padding matches the current tier
- Sidebar becomes top bar plus drawer below 1024
- Dense sections remain readable at phone width

## Typography

- Headline tiers step through the approved responsive matrix
- Body text does not stay at desktop size on phone
- Supporting copy increases only when the breakpoint contract allows it

## Components

Check in real page context:

- buttons
- inputs
- dropdowns and selectors
- accordion
- modal, drawer, search overlay, and toast
- data table
- tabs, segmented control, pagination, and stepper
- footer
- carousel

## States and Motion

- Hover
- Active / pressed
- Focus-visible
- Disabled
- Open / close transitions
- Reduced motion

## Compliance

- Required NexLed head block is present
- No inline styles
- No <style> blocks
- No local CSS files
- No arbitrary Tailwind values
- No invented tokens, variants, or breakpoints
