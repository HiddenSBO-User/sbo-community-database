# sbo-community-database

Sword Blox Online: Rebirth Community Database

A fan-made community database containing:

- Weapon list
- Gear list
- Blacksmith crafting tracker
- Material tracking
- EXP Calculator

Created by HiddenSBO-User

Not affiliated with Sword Blox Online: Rebirth or its developers.
Community project created for informational purposes.

## Beta branch: what's different from main

This branch is a UI/UX rework of the site. The data (weapons, gear, blacksmith
recipes) is the same as main — the changes here are all in how the site looks
and how it holds up on a phone.

- **New design system.** Styling is now split into `css/tokens.css` (colors,
  fonts, spacing), `css/layout.css` (page structure), and `css/components.css`
  (cards, buttons, inputs), instead of one large stylesheet. Consistent
  typography (Sora/Inter/JetBrains Mono), a proper color palette, and reusable
  component styles across every page.

- **Actually responsive on mobile.** Main's nav just switches to a vertical
  column of links that stays permanently expanded at the top of every page,
  pushing all real content down. Beta replaces it with a collapsible sidebar
  on desktop that turns into a slide-out drawer behind a hamburger button on
  mobile, so the nav doesn't eat screen space until you open it.

- **Touch-friendly by default.** Tap targets sized to platform minimums,
  16px form inputs (prevents iOS Safari's zoom-in-on-focus), safe-area insets
  for notched phones, and no more accidental double-tap-zoom or grey tap
  flash on buttons.

- **New home page layout.** Hero section, a unified search bar that covers
  weapons/gear/materials in one place, and a stats grid instead of a plain
  list of links.
