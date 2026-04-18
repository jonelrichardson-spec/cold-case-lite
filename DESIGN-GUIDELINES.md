# Design Guidelines — Cold Case Network (Demo Build)

> Locked visual reference for Claude Code. Follow these values exactly.
> This is pulled from the original production build. Do not deviate without Jo's approval.

---

## Design Philosophy

Dark intelligence dashboard. Serious, credible, surgical. FBI case file meets data journalism. Nothing playful, nothing startup-y. Information surfaces from the dark.

---

## Color Tokens

```css
--bg:        #0C0C0E   /* Page background */
--bg2:       #111216   /* Panel backgrounds, nav */
--bg3:       #16181D   /* Elevated surfaces, headers */
--border:    #1F2430   /* All borders, dividers */

--red:       #C8102E   /* Primary accent — active states, alerts, CTAs */
--red-glow:  rgba(200,16,46,0.25)
--red-dim:   rgba(200,16,46,0.12)

--amber:     #E8A020   /* Secondary accent — data values, warnings */
--amber-dim: rgba(232,160,32,0.12)

--ice:       #F0F2F5   /* Primary text */
--muted:     #5A6070   /* Secondary text, labels */
--muted2:    #8A929F   /* Tertiary text, descriptions */

--green:     #22C55E   /* Reliability indicators only */
```

Define as CSS variables in globals.css. No hardcoded hex in components.

---

## Typography

```css
--font-display: 'Bebas Neue', sans-serif;    /* Headlines, stats, location names */
--font-mono:    'IBM Plex Mono', monospace;   /* Data values, labels, badges, filters */
--font-body:    'DM Sans', sans-serif;        /* Body copy, descriptions */
```

Load via next/font/google. Three families only. Never use Inter, Roboto, Arial, or system-ui.

| Element | Font | Size | Weight | Letter-spacing |
|---|---|---|---|---|
| Page headline | Bebas Neue | clamp(52px, 8vw, 88px) | — | 3px |
| Section title | Bebas Neue | 22-30px | — | 2px |
| Stat numbers | Bebas Neue | 28-52px | — | 1-2px |
| Filter labels | IBM Plex Mono | 11px | 400 | 2.5px |
| Data values | IBM Plex Mono | 10-12px | 500 | 1px |
| Eyebrow labels | IBM Plex Mono | 8-9px | 400 | 2.5-3px, uppercase |
| Body / descriptions | DM Sans | 12-14px | 300-400 | 0.3px |

---

## Border Radius Rules

```
Panels, cards, buttons:  2px (sharp, not friendly)
Chips / badges:          2px
Cluster nodes:           50% (circles only)
```

Never use rounded corners larger than 4px.

---

## Navigation (Top Nav)

```
Height:        64px
Position:      fixed, top 0, z-index 50
Background:    #111216 (--bg2)
Border-bottom: 1px solid #1F2430

Left side:     Red dot (9px) + "COLD CASE" (white) "NETWORK" (red) — Bebas Neue 18px
               Nav tabs: MAP · INSIGHTS · METHODOLOGY

Tab font:      IBM Plex Mono, 11px, letter-spacing 2.5px, uppercase
Tab active:    color #F0F2F5, border-bottom 2px solid #C8102E
Tab inactive:  color #5A6070, border-bottom 2px solid transparent

All pages add padding-top: 64px to prevent content behind fixed nav.
```

No Dashboard tab in the demo build. Tabs are: Map, Insights, Methodology.

---

## Landing Page

### Layout
- Full viewport, overflow hidden
- Background: #0C0A0A (slightly warmer than --bg)
- All content centered both axes

### Layer Order (bottom to top)

**Layer 1 — Bullseye Background Grid (z-index 0)**
- 16 columns × 12 rows of concentric-ring circles
- Client component: components/landing/BullseyeBackground.tsx
- Position absolute, inset -60px
- Each cell 58px with 4 concentric rings
- Ring colors based on distance from grid center:
```js
const cols = 16, rows = 12;
const cx = (cols - 1) / 2, cy = (rows - 1) / 2;
const maxDist = Math.sqrt(cx*cx + cy*cy);
const dist = Math.sqrt((col-cx)**2 + (row-cy)**2);
const proximity = 1 - (dist / maxDist);
const r = Math.round(55 + proximity * 80);
const g = Math.round(8 + proximity * 10);
const b = Math.round(10 + proximity * 12);
const alpha = 0.55 + proximity * 0.40;
```
Center cells = rich dark red-brown. Edges = deep dark red. NOT grey.

**Layer 2 — Radial Fade Overlay (z-index 1)**
```css
background: radial-gradient(ellipse at center,
  rgba(12,10,10,0) 0%, rgba(12,10,10,0) 35%,
  rgba(12,10,10,0.45) 60%, rgba(12,10,10,0.80) 78%,
  rgba(12,10,10,0.95) 92%);
```

**Layer 3 — Center Glow (z-index 2)**
- 900px × 600px
```css
background: radial-gradient(ellipse at center,
  rgba(180,20,30,0.22) 0%, rgba(140,12,20,0.14) 40%,
  rgba(80,8,12,0.06) 65%, transparent 80%);
```

**Layer 4 — Landing Content (z-index 3)**
- Eyebrow: "INTELLIGENCE PLATFORM" — IBM Plex Mono, 10px, letter-spacing 4px, color #8A929F
- Headline: "COLD CASE" (white) + line break + "NETWORK." (red #C8102E) — Bebas Neue, clamp(52px, 8vw, 88px)
- Subtext: "What the data sees. What detectives missed." / "The map they never made." — DM Sans 14px, weight 300, color #8A929F
- Stat: "237,000+" (Bebas Neue 52px, white) + "UNSOLVED HOMICIDES SINCE 1980" (IBM Plex Mono 9px, color #5A6070)
- Enter button: "ENTER" — Bebas Neue 14px, letter-spacing 4px, transparent bg, 1px solid #C8102E border. Hover: red fill slides in from left.

Staggered fadeUp animation (0.1s increments per element).

---

## Filter Panel (Left, 260px)

```
Width:         260px fixed
Background:    #111216 (--bg2)
Border-right:  1px solid #1F2430

Header:        "< FILTERS" + "RESET ALL" (red)
Bottom:        "✓ ADEQUATE REPORTING COVERAGE" green badge
```

### Filter Controls
| Filter | Control | Options |
|---|---|---|
| Date Range | Dual range slider | 1976-2023, amber thumbs |
| State/Region | Dropdown | All States / [each state] |
| Victim Sex | Dropdown | All / Female / Male |
| Weapon Type | Dropdown | All Weapons / Strangulation / Handgun / Knife / Blunt Object / Unknown |
| Victim Race | Dropdown | All Races / White / Black / Asian-PI / Native American |
| Solve Status | Dropdown | All / Unsolved Only / Solved Only |
| Min Cluster Size | Stepper (- val +) | Default 10, min 5, max 50, step 5 |

### Dropdown Style (custom div-based, not native select)
```
Trigger bg:    #16181D
Border:        1px solid #1F2430
Font:          IBM Plex Mono, 12px
Color:         #F0F2F5
Focus border:  rgba(200,16,46,0.5)
Border-radius: 2px

Option hover:  background #C8102E, color #F0F2F5
Option selected: background rgba(200,16,46,0.15), left border 2px solid #C8102E
```

---

## Map Page Layout

```
grid-template-columns: 260px 1fr
```

- Left: Filter Panel (260px, same controls)
- Right: Mapbox dark basemap (dark-v11), fills remaining viewport

### Stats Bar (top-right float)
```
Background:  rgba(11,13,18,0.90), backdrop-filter blur(6px)
Border:      1px solid #1F2430
Format:      [N] cases · [N unsolved, red] · [N] clusters
Font:        IBM Plex Mono
```

### Cluster Markers on Map
```
Hot (low solve rate):
  Background: rgba(200,16,46,0.12), border rgba(200,16,46,0.35)
  Inner: rgba(200,16,46,0.65), border #C8102E
  Glow: box-shadow 0 0 28px rgba(200,16,46,0.15)

Warm (moderate solve rate):
  Background: rgba(232,160,32,0.08), border rgba(232,160,32,0.25)
  Inner: rgba(232,160,32,0.50), border #E8A020
```

### State Boundary Highlight
- Amber (#E8A020) line on selected state
- Fade in 600ms, fade out 400ms

### Reset View Button (bottom-right, amber circle)
- 52x52px circle, amber color scheme
- Click: flyTo default US view + clear state filter

---

## Detail Panel (Right Slide-out, 340px)

Slides in from right on cluster click.

```
Background:  #111216 (--bg2)
Border-left: 1px solid #1F2430

Header:      Red top border (3px solid #C8102E)
             Eyebrow: IBM Plex Mono 8px, red, uppercase
             Title: Bebas Neue 22px, white

Stats:       Bebas Neue for numbers, IBM Plex Mono for labels
             Red = unsolved/low solve, Amber = data values, White = totals

CTA:         "OPEN CASE FILE →" full width, red fill slide-in hover
```

---

## Insights Page

```
Max-width:   1100px, centered
Padding:     40px 32px 60px
Eyebrow:     "DATA INSIGHTS" — IBM Plex Mono 9px, red
Headline:    "WHAT THE DATA SEES" — Bebas Neue 30px
```

### Finding Cards (2-column grid, gap 20px)
```
Background:  #111216
Border:      1px solid #1F2430, border-radius 2px
```

**Finding 01 — Racial Solve Rate Gap**
- 4 decade rows, Black bar (#C8102E), White bar (#5A6070)
- Gap label: amber #E8A020, "+Xpp"

**Finding 02 — Jurisdictional Accountability**
- DC 34.2%, San Mateo 32.9%, LA 38.3%
- Red bars on dark track

**Finding 03 — National Trend**
- 2022 peak vs 2024, proportional bars
- Decline label: amber "▼ 22%"

**Finding 04 — Data Reliability by State**
- MS 24% (red), FL 48% (red), IA 59% (amber), WA 92% (green), VA 100% (green)
- This is the key visual for Demo 2

---

## Methodology Page

```
Max-width:   900px, centered
Eyebrow:     "METHODOLOGY" — red
Headline:    "HOW IT WORKS" — Bebas Neue 30px
```

### Section 1 — Algorithm (Cluster Detection)
- Formula block with conditions in amber
- Condition 1: total_cases >= min_cluster_size
- Condition 2: solve_rate <= 0.33

### Section 2 — Data Sources
- 4 source cards in 2-column grid
- SHR65_23.csv, UCR65_23a.sav, State_Reporting_Rates, expanded-homicide-2024

### Section 3 — Limitations
- Red dot bullets
- Low-confidence states, unmatched ORIs, Rhode Island typo, solve rate definition

---

## Animation Standards

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes pulseRing {
  0%   { transform: scale(1);   opacity: 0.6; }
  70%  { transform: scale(1.5); opacity: 0;   }
  100% { transform: scale(1.5); opacity: 0;   }
}
```

Staggered delays: 0.1s increments per element.

---

## Scrollbar

```css
::-webkit-scrollbar       { width: 3px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #1F2430; border-radius: 2px; }
```