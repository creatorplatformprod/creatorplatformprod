# Design System Strategy: High-Energy Creator Editorial

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Kinetic Curator."** 

We are moving away from the static, boxy layouts of traditional SaaS and embracing an environment that feels automated, fluid, and high-energy. This system is designed for a world where finance meets digital expression. By leveraging intentional asymmetry, high-contrast editorial typography, and "living" layers of glass and light, we create a platform that doesn't just hold content—it amplifies it. We break the "template" look by using exaggerated corner radii and overlapping containers that suggest a workspace in constant motion.

---

## 2. Colors & Surface Philosophy
The palette is a high-octane mix of Deep Purple and Electric Cyan, anchored by a sophisticated off-white depth.

### Named Color Palette (Material Design Convention)
- **Primary:** `#5b3cdd` (Deep Purple) | **On-Primary:** `#ffffff`
- **Secondary:** `#006970` (Electric Cyan Accent) | **Secondary-Container:** `#00eefc`
- **Tertiary:** `#9100d2` (Vivid Magenta-Purple)
- **Background:** `#f8f9ff` (Off-White/Cool Tint)
- **Surface-Container-Lowest:** `#ffffff`
- **Surface-Container-High:** `#e7e8ee`

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or card definition. Boundaries must be defined solely through background color shifts or tonal transitions. To separate a main feed from a sidebar, use a shift from `surface` to `surface-container-low`. The UI must feel like it was carved from a single block of material, not stitched together with lines.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of frosted glass.
- **Base Level:** `surface` (`#f8f9ff`)
- **Section Level:** `surface-container-low` (`#f2f3f9`)
- **Active/Card Level:** `surface-container-lowest` (`#ffffff`)
- **Nesting:** When placing a functional element inside a card, use a subtle drop to `surface-container` to create an "inset" feel without using an inner shadow.

### The "Glass & Gradient" Rule
To achieve a signature premium feel, main CTAs and "Floating" Hero cards should utilize:
- **Signature Textures:** A linear gradient from `primary` (#5b3cdd) to `primary-container` (#7459f7) at a 135° angle.
- **Glassmorphism:** For floating overlays (e.g., "Success" toasts or mobile navigation), use `surface-container-lowest` at 70% opacity with a `24px` backdrop-blur.

---

## 3. Typography
We use a high-contrast pairing of **Plus Jakarta Sans** for impact and **Inter** for technical precision.

- **Display (Lg/Md/Sm):** `plusJakartaSans`. Used for hero statements. These should be tight-tracked (-2%) and bold to command attention.
- **Headline (Lg/Md/Sm):** `plusJakartaSans`. Defines major sections. Use these to create an editorial feel—large headlines should often sit asymmetrically to the left of content blocks.
- **Title (Lg/Md/Sm):** `inter`. Medium weights. Used for card headers and navigation elements.
- **Body (Lg/Md/Sm):** `inter`. Regular weight. Designed for readability. Never use pure black; use `on-surface-variant` (`#484555`) to maintain a "tech-forward" softness.
- **Label (Md/Sm):** `inter`. All-caps with +5% letter spacing for a "Fintech" automated aesthetic.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering** rather than traditional structural shadows.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background. This creates a "Natural Lift."
- **Ambient Shadows:** Shadows are reserved only for elements that truly "float" (e.g., Modals, Hovered Cards).
    - **Value:** `0px 20px 48px rgba(91, 60, 221, 0.08)` (A purple-tinted ambient shadow).
    - **Note:** Never use grey/black shadows. Always tint the shadow with the `primary` or `on-surface` color.
- **The "Ghost Border" Fallback:** If accessibility requires a container edge, use a "Ghost Border": `outline-variant` (`#c9c4d8`) at **15% opacity**.
- **Corner Radii Scale:**
    - **Default/Card:** `1rem` (16px)
    - **Large/Hero:** `2rem` (32px)
    - **Interactive/Button:** `full` (pill-shaped)

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary-container`), Pill-shaped (`9999px`), with a subtle white drop shadow on the label text for high-energy "pop."
- **Secondary:** Surface-tinted. `surface-container-high` background with `primary` text. No border.
- **Tertiary:** Pure text using `primary` color, bold weight, with a `secondary` (`#00F0FF`) underline on hover.

### Cards & Lists
- **Rule:** Forbid divider lines. Use `24px` or `32px` of vertical whitespace to separate list items.
- **Active State:** When a list item is selected, shift its background to `primary-fixed` (`#e5deff`) and change the text to `on-primary-fixed-variant`.

### Input Fields
- **Styling:** `surface-container-lowest` background with a `16px` radius. 
- **Focus State:** Instead of a thick border, use a `2px` glow of `secondary_container` (`#00eefc`) and a slight "lift" (move -2px on Y-axis).

### Selection Chips
- **Style:** Pill-shaped, `surface-container-high` background. When selected, use the `secondary` (`#00F0FF`) background with `on-secondary` text to create a high-contrast "Electric" focal point.

---

## 6. Do's and Don'ts

### Do
- **DO** use generous white space. If a layout feels "crowded," double the padding.
- **DO** overlap elements. Place a small chip or "Live" indicator so it hangs halfway off the edge of a card to break the grid.
- **DO** use the `secondary` Cyan color sparingly. It is a "laser pointer" for the user's eye—use it for the most important action on the screen only.

### Don't
- **DON'T** use 1px solid black or grey borders. This immediately destroys the "high-end editorial" feel.
- **DON'T** use standard 4px or 8px corners. This system requires the "oversized" 16px+ feel to appear modern and friendly.
- **DON'T** align everything to a rigid center. Use a "Power Left" alignment for headlines to create a sophisticated, magazine-style layout.