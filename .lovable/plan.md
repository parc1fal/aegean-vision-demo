

# Aegean Browser Interactive Demo

## Overview
A single-page interactive demo showcasing Aegean Browser — an AI-powered browser for autonomous agents. The demo targets investors and early users through an immersive, three-section experience with premium visual design.

---

## Section 1: Landing Hero
- Full-viewport animated gradient background using the exact baunov/gradients-bg implementation (SVG goo filter, 5 gradient blobs + mouse-interactive blob)
- Color palette adapted to Aegean blues (#5f71e3, #4a5dc4, #7b8ef5)
- Centered hero content overlay: bold headline "The Browser Built for AI Agents", subheading, and a glass-morphism "See the Difference" CTA button
- Clicking CTA smoothly scrolls to Section 2 with fade-out transition

## Section 2: Command Selection
- Clean #fafbff background, three horizontally-centered glass-morphism command bubbles
- Commands: "Book a flight to Rome under $200", "Find and compare hotel prices in Tokyo", "Monitor 10 websites for price changes"
- Hover states with lift and glow effects
- On click: unselected bubbles fade out, selected bubble transitions into the browser interface (Section 3)
- A glass-morphism "Reset" button appears to return here

## Section 3: Browser Interface Demo
- **Top bar**: Glass-morphism header with Reset button (left), toggle slider "Current Tools ↔ Aegean Browser" (center), and Aegean logo placeholder (right)
- **Left sidebar** (250px): Agent list with status indicators (green = active, orange = needs input)
- **Main content area**: Cross-fades between two views based on toggle state

### Section 3A: "Current Tools" View
- Dark terminal-style container showing a struggling agent with line-by-line animated output
- Realistic errors (rate limits, element not found, retries)
- Timer counting up, ending with "Process failed after 8 minutes" in red

### Section 3B: "Aegean Browser" View (Default)
- Animated progress panel with sequential checkmarks and spinners
- Sites searched panel with chips fading in sequentially
- Live flight results panel with realistic cards (Delta $189, United $195, American $199)
- Completion state at ~12s: all checkmarks, success banner "Completed in 12 seconds"

---

## Design System
- **Colors**: Primary #5f71e3, Secondary #4a5dc4, Tertiary #7b8ef5, Background #fafbff, Success #10b981, Warning #f59e0b
- **Typography**: Playfair Display or Montserrat Bold for headings, Inter for body, JetBrains Mono for terminal
- **Glass morphism**: backdrop-blur, semi-transparent whites, subtle blue-tinted borders
- **Animations**: Smooth 300–800ms transitions, CSS transforms for 60fps performance
- **Desktop-optimized** (1440px+), proportional scaling for smaller viewports

## Technical Notes
- No backend needed — all content and animations are client-side
- Gradient background uses exact SVG filter + CSS keyframe + JS mouse-tracking implementation from spec
- All text content is final (no placeholders)

