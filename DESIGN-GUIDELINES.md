# Design Guidelines — Cold Case Network (Demo Build)

> Visual and UX decisions for this project. Reference this before building any UI component.
> Hand this to Claude Code alongside CLAUDE.md so it builds to spec, not defaults.

## Brand / Visual Direction

**Mood:** Law enforcement intelligence tool meets data journalism platform. Dark, dense, authoritative. This must feel like something that could appear in a court exhibit or a ProPublica investigation. No startup aesthetics. No rounded friendly corners. No gradients.

**References:** ProPublica data projects, The Marshall Project interactives, Bloomberg Terminal (density), Palantir Gotham (command center feel)

## Colors

| Role | Value | Usage |
|------|-------|-------|
| Primary | #DC2626 (crimson red) | Cluster markers, accent text, active states, ENTER button |
| Background | #0A0A0A | Page background |
| Surface | #141414 | Cards, panels, filter panel background |
| Surface Elevated | #1A1A1A | Detail panel, modals |
| Text Primary | #FFFFFF | Headlines, key stats |
| Text Secondary | #A0A0A0 | Labels, captions, metadata, body text |
| Text Muted | #666666 | Tertiary info, disabled states |
| Success / Solved | #22C55E | Solved case indicators |
| Warning / Low Confidence | #F59E0B (amber) | Low-reporting state badges, small clusters |
| Error / Unsolved | #DC2626 | Unsolved case indicators |
| Cluster Amber | #F59E0B | Small cluster markers |
| Cluster Red | #DC2626 | Large/high-unsolved cluster markers |
| Border | #2A2A2A | Dividers, card edges, panel borders |
| State Boundaries | #333333 | Faint US state outlines on map |

> Define these as CSS variables in globals.css. No hardcoded hex in components.

## Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Display / Hero | Bebas Neue | 700 | 48-72px |
| Headings | Bebas Neue | 700 | 24-36px |
| Body | DM Sans | 400 | 14-16px |
| Data / Stats | JetBrains Mono | 400 | 13-14px |
| Labels / Captions | DM Sans | 500 | 12px |
| Navigation | DM Sans | 600 | 14px |

> Load via `next/font/google`. Three families max.

## Landing Page

- Full-screen dark splash, background: #0A0A0A
- Optional: subtle spiral or radial pattern behind headline (CSS only, no images)
- Headline: "COLD. CLUSTERED. CONNECTED." with "CONNECTED." in crimson red
- Subtitle: "What the data sees. What detectives missed. The map they never made."
- Data provenance line: "894,636 RECORDS · 1976-2023 · FBI SUPPLEMENTARY HOMICIDE REPORTS" (small, muted text)
- ENTER button: crimson red, pulse animation, uppercase, Bebas Neue
- Transition: fade-to-black when entering the app

## Map View Layout

```
┌─────────────────────────────────────────────────────────┐
│  Navigation Bar (Map · Insights · Methodology)          │
├──────────┬──────────────────────────────┬───────────────┤
│          │                              │               │
│  Filter  │                              │   Detail      │
│  Panel   │       Mapbox Dark Basemap    │   Panel       │
│  240px   │                              │   380px       │
│          │                              │   (hidden     │
│          │                              │    until       │
│          │                              │    cluster     │
│          │       Live Counter (top-right)│    click)     │
│          │                              │               │
├──────────┴──────────────────────────────┴───────────────┤
```

### Filter Panel (Left, 240px)
- Fixed position, dark surface background
- Filters stacked vertically with clear labels
- Filter controls: State (searchable dropdown), Victim Sex (toggle pills), Weapon Type (dropdown), Solve Status (toggle pills)
- Toggle pills: active = crimson red fill + white text, inactive = dark bg + gray border + gray text
- Data Confidence badge at bottom: green/amber based on selected state's reporting rate
- RESET ALL text link at bottom

### Map Display
- Mapbox dark basemap (mapbox://styles/mapbox/dark-v11 or similar)
- Cluster markers: graduated glowing circles, size = case count, color = amber (small) to red (large)
- Faint state boundary outlines (#333 stroke)
- Live counter top-right: "X cases · X unsolved · X clusters" in JetBrains Mono

### Detail Panel (Right slide-out, 380px)
- Slides in from right on cluster click
- Header: county name, case count (red), date span
- 2x2 card grid: Time of Day, Weapon/Cause, Victim Profile, Location
- Generated Story Brief: templated narrative paragraph
- Close button (X) top-right
- Mini case table: Year, Victim Age, Weapon, Solved (Y/N), Agency

## Insights Page
- State reporting rates displayed as horizontal bar chart or card grid
- Each state card shows: state name, reporting rate percentage, confidence badge (green/amber/red)
- Highlight low-reporting states: Mississippi (24%), Florida (48%), Iowa (59%)
- Dark background consistent with rest of app
- Brief explanatory text about what reporting rates mean for data reliability

## Spacing System

- Component padding: `p-4` (16px) standard, `p-6` (24px) for larger containers
- Section gaps: `gap-6` (24px) between major sections
- Element gaps: `gap-2` (8px) between related elements
- Filter controls: `gap-4` (16px) between each filter group

## Accessibility Baseline

- Color contrast: minimum 4.5:1 for body text
- All interactive elements keyboard-accessible
- Focus rings visible on tab navigation
- Alt text on the ENTER button
