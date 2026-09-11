---
name: EcoQuest Deep Forest
colors:
  surface: '#131412'
  surface-dim: '#131412'
  surface-bright: '#393937'
  surface-container-lowest: '#0e0e0d'
  surface-container-low: '#1b1c1a'
  surface-container: '#1f201e'
  surface-container-high: '#2a2a28'
  surface-container-highest: '#343533'
  on-surface: '#e4e2de'
  on-surface-variant: '#bccabb'
  inverse-surface: '#e4e2de'
  inverse-on-surface: '#30312e'
  outline: '#869486'
  outline-variant: '#3d4a3e'
  surface-tint: '#4de082'
  primary: '#6bfb9a'
  on-primary: '#003919'
  primary-container: '#4ade80'
  on-primary-container: '#005e2d'
  inverse-primary: '#006d36'
  secondary: '#a8cfb9'
  on-secondary: '#133727'
  secondary-container: '#2a4e3d'
  on-secondary-container: '#97bea8'
  tertiary: '#ffdab2'
  on-tertiary: '#472a00'
  tertiary-container: '#ffb657'
  on-tertiary-container: '#734700'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6dfe9c'
  primary-fixed-dim: '#4de082'
  on-primary-fixed: '#00210c'
  on-primary-fixed-variant: '#005227'
  secondary-fixed: '#c4ecd4'
  secondary-fixed-dim: '#a8cfb9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#2a4e3d'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#131412'
  on-background: '#e4e2de'
  surface-variant: '#343533'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  stats-number:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '800'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 80px
---

## Brand & Style
The design system centers on a "Deep Forest" narrative—an atmospheric, immersive environment that balances the seriousness of sustainability with the dopamine-driven engagement of a high-end RPG. The personality is protective yet adventurous, mimicking the feeling of exploring a bioluminescent woodland at dusk.

The visual style is a fusion of **Glassmorphism** and **Modern Corporate**, utilizing translucent layers to represent fog and depth, while maintaining the structural clarity required for a data-driven platform. Surfaces should feel like frosted glass suspended over a lush, dark canopy. Micro-interactions must be playful and bouncy, drawing inspiration from gamified learning platforms to make ecological tracking feel like a quest rather than a chore.

## Colors
The palette is rooted in the "Deep Forest" aesthetic. The primary background is the darkest green (`#062C1D`), providing a high-contrast base for the bioluminescent primary green (`#4ADE80`). 

- **Primary:** Use for interactive states, success messages, and high-level progress indicators.
- **Secondary/Surface:** Use for container backgrounds and depth layers.
- **Tertiary (Reward):** Reserved exclusively for XP, leveling up, and achievement-related highlights.
- **RPG Accents:** Purple is used for rare items, special quests, or "mystical" forest elements.
- **Text/Reading:** Warm cream (`#FDFBF7`) is used for primary text on dark backgrounds to reduce eye strain and provide a premium, organic feel.

## Typography
The typography strategy blends the friendly, rounded nature of gamified apps with a technical, "data-rich" feel. 

**Plus Jakarta Sans** provides the personality for headlines and display text—its soft terminals feel modern and approachable. **Hanken Grotesk** is used for body copy to ensure high readability against translucent surfaces. For technical data, XP counters, and item labels, **JetBrains Mono** is used to evoke a sense of "system logs" and RPG attributes. All headings should use tight letter spacing to feel impactful and punchy.

## Layout & Spacing
The layout follows a fluid-to-fixed transition. On mobile devices, a 4-column grid with 20px margins is used. On desktop, the content is centered within a 12-column grid (max-width 1280px) with 24px gutters.

The spacing rhythm is strictly based on a 4px baseline. Use wider padding (`xl`) for major section containers to allow the "Deep Forest" background imagery to breathe. Use tighter spacing (`sm` to `md`) for internal card elements to maintain the compact, "dashboard" feel of an RPG interface.

## Elevation & Depth
Depth is created through **Glassmorphism** rather than traditional shadows. 

1.  **Base Layer:** Solid `#062C1D` dark green.
2.  **Surface Layer:** Background blur (20px to 40px) with a 10% opacity fill of `#0B3D2E`.
3.  **Border Layer:** A 1px "ghost" border with 20% opacity white or light green to define the edges of the glass.
4.  **Interactive Layer:** Elements like active buttons or focused cards should emit a soft, localized glow (`box-shadow: 0 0 20px rgba(74, 222, 128, 0.2)`).

Avoid hard shadows. All depth should feel like light passing through mist or layers of foliage.

## Shapes
This design system uses **2xl (Rounded)** as its primary shape language. Containers, cards, and primary buttons must use a large corner radius (1rem / 16px) to maintain the friendly, Duolingo-esque aesthetic. 

- **Cards:** 16px (1rem)
- **Buttons:** 24px (1.5rem) or fully pill-shaped for a more playful feel.
- **Selection Indicators:** 8px (0.5rem) for smaller nested elements.
- **XP Bars:** Fully rounded (pill) to signify progress and fluidity.

## Components

### Buttons
- **Primary:** High-gloss, solid `#4ADE80` with dark text. Apply a subtle "bounce" animation on press.
- **Secondary:** Translucent glass with a 1px border.
- **Tertiary:** Ghost style, text-only with icons.

### Cards (The "Forest Fragments")
All cards must use `backdrop-filter: blur(16px)` and a thin light-green border. Content should be padded by `24px`. Headlines inside cards should be `#FDFBF7`.

### XP Bars & Progress
Use a "nested pill" approach. The container is a dark, translucent track, while the fill is a vibrant gradient from `#4ADE80` to `#A855F7` to represent growth and rarity. Add a white "shimmer" animation to the progress fill.

### Input Fields
Inputs should be dark, semi-transparent wells. The focus state should transition the border from 20% white to 100% `#4ADE80` with a soft outer glow.

### Achievement Badges
Circular containers with heavy glassmorphism. Use the Tertiary (`#F59E0B`) color for the iconography inside badges to denote value and success.

### Navigation
A bottom-bar navigation (mobile) or floating side-bar (desktop) using the same glassmorphism rules. Active states should be indicated by a glowing dot or a small leaf-shaped indicator.