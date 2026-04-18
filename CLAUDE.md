# CLAUDE.md — Cold Case Network (Demo Build)

## 1. Project Overview
- **Name:** Cold Case Network
- **One-liner:** Geographic intelligence tool that surfaces unsolved homicide clusters from 48 years of FBI data, scoped to 1980-2000 for live demo performance.
- **Stack:** Next.js 16, TypeScript, Tailwind CSS v4, Zustand, Mapbox GL JS, Supabase (PostgreSQL), Python (data loader)
- **Deployment:** Vercel (frontend), Supabase (database)
- **Repo:** TBD (clean repo)
- **Branch strategy:** Feature branches only. Never merge to main until complete.
- **Branch naming:** `phase-N/short-description` (e.g., `phase-2/map-filters`)

## 2. Confidence Rule
**Do not write or change any code until you reach 95% confidence in what needs to be built.**
- Ask follow-up questions until you hit that threshold.
- State your confidence level and what is unclear before proceeding.
- If a requirement is ambiguous, stop and ask. Never guess.
- Never mock data or fabricate endpoints. If you don't know, ask.

## 3. Demo Context

This is a one-day rebuild of Cold Case Network scoped for a 3-minute solo presentation. Two demo scenarios must work flawlessly:

**Demo 1: The Green River Pattern**
- Filters: Washington State, Female, Strangulation (date range already 1980-2000)
- Expected: 128 cases, 62 unsolved
- Must show: cluster markers on map, clickable cluster opening Investigative Case File panel

**Demo 2: The Reporting Gap**
- Navigate to Insights or Methodology page
- Show state reporting rates: Mississippi 24%, Florida 48%, Iowa 59%
- Must show: visual flags for low-confidence data regions

**What does NOT need to exist:**
- Dashboard tab (skip entirely)
- User accounts or auth
- PDF export
- Mobile responsiveness
- ViCAP alerts or pattern match badges
- Age range filter
- Mini Mapbox inset in detail panel

## 4. Data Specs

- **Source:** SHR65_23.csv from Murder Accountability Project
- **Full dataset:** 894,636 records (1976-2023)
- **Demo subset:** 417,255 records (1980-2000 only)
- **Unsolved in subset:** 122,457 (29.4%)
- **Key columns:** ID, State, Agency, Ori, Solved, Year, Month, VicAge, VicSex, VicRace, VicEthnic, Weapon, Relationship, Circumstance, CNTYFIPS, MSA

**Data quality fixes in loader:**
- Rhode Island typo: 'Rhodes Island' → 'Rhode Island'
- CNTYFIPS is text ('King, WA') not numeric
- 252 unmatched ORIs → set county_fips to NULL

## 5. File Index

```
src/
├── app/
│   ├── layout.tsx          — Root layout, global providers, fonts
│   ├── page.tsx            — Landing / enter page
│   ├── map/page.tsx        — Map view (core demo screen)
│   ├── insights/page.tsx   — Reporting gap visualization (Demo 2)
│   └── methodology/page.tsx — Data methodology and sources
├── components/
│   ├── ui/                 — Reusable UI primitives (Button, Badge, etc.)
│   ├── landing/            — Enter page components (hero, enter button)
│   ├── map/                — Map components (MapContainer, ClusterMarker, FilterPanel, DetailPanel)
│   └── insights/           — Reporting rate visualizations
├── lib/
│   ├── constants.ts        — All magic numbers, URLs, config values
│   ├── supabase.ts         — Single Supabase client. ALL queries go through here.
│   ├── utils.ts            — Shared utility functions
│   └── types.ts            — Shared TypeScript types/interfaces
├── stores/
│   ├── useFilterStore.ts   — Filter state (state, weapon, sex, solve status)
│   └── useMapStore.ts      — Map viewport, selected cluster
└── styles/
    └── globals.css         — Tailwind base + custom design tokens
```

**Data loader (root level):**
```
scripts/
├── load_data.py            — Filter CSV to 1980-2000, normalize, load to Supabase
└── requirements.txt        — Python dependencies (supabase, pandas)
```

> Update this map when you add a new file or directory.

## 6. Build & Dev Commands
```bash
npm install                 # Install dependencies
npm run dev                 # Start dev server (localhost:3000)
npm run build               # Production build
npm run lint                # ESLint check
npx tsc --noEmit            # Type check (must pass before merge)
```

## 7. Coding Conventions

### Architecture
- **Separation of concerns:** No business logic in components. Components render; hooks/stores manage state; lib handles logic.
- **No inline handlers:** Extract all event handlers to named functions.
- **Centralize constants:** Every magic number, URL, and config value lives in `lib/constants.ts`.
- **One Zustand store per domain:** useFilterStore, useMapStore. Never cross-contaminate.
- **All Supabase queries through lib/supabase.ts.** Never import the Supabase client directly in components.

### Error Handling
- Every async function gets try/catch. No exceptions.
- No silent failures. Every catch block surfaces a meaningful message (console.error at minimum, user-facing toast when appropriate).
- API calls return `{ data, error }` pattern or throw with descriptive messages.

### TypeScript
- No `any`. Use `unknown` and narrow, or define a proper type.
- Shared types live in `lib/types.ts`. Component-specific types live in the component file.
- All props get an interface. No inline prop typing.

### Styling
- Tailwind utility classes only. No inline styles, no CSS modules.
- Design tokens (colors, spacing, fonts) defined in `globals.css` or `tailwind.config.ts`.
- Desktop-first. No responsive breakpoints required for demo.

### Git
- Commit messages: `type(scope): description` (e.g., `feat(filter): add date range picker`)
- Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
- One logical change per commit. No "WIP" commits on main.

## 8. Phase Protocol

### Structure
Each phase is not complete until:
1. All acceptance criteria for that phase are met
2. `npm run build` passes with zero errors
3. `npx tsc --noEmit` passes
4. I confirm the phase is done

**Never start Phase N+1 until Phase N is confirmed complete.**

### Phases for This Project
| Phase | Goal | Status |
|-------|------|--------|
| 0 | Data prep: filter CSV to 1980-2000, set up Supabase, load data, verify Green River query | [x] |
| 1 | Scaffold: Next.js project, Tailwind, Zustand, Supabase client, env vars, file structure | [x] |
| 2 | Landing page: dark splash, headline, ENTER button, transition to map | [x] |
| 3 | Map view: Mapbox dark basemap, cluster markers from Supabase, live counter | [x] |
| 4 | Filter panel: State, Victim Sex, Weapon, Solve Status. Filters update map + counter | [x] |
| 5 | Detail panel: click cluster → right slide-out with Investigative Case File layout | [x] |
| 6 | Insights page: state reporting rates visualization, low-confidence badges | [x] |
| 7 | Methodology page: algorithm formula, data sources, limitations | [x] |
| 8 | Deploy to Vercel, set env vars, verify both demos work on production URL | [ ] |

## 9. Read Before Write

Before editing any file:
1. Read its current contents first.
2. After any successful edit, the previous view is stale. Re-read before making another edit to the same file.
3. Never assume file state from memory or earlier context.

## 10. Change Protocol

When a direction change or update is needed:
1. I describe the change.
2. You confirm your understanding and list affected files.
3. I approve the direction.
4. You update all affected files (code, CLAUDE.md phase table, any docs).
5. You provide a summary of every change made.
6. You provide a detailed commit message at the end of the summary.

**No commit happens without a summary first.**

## 11. Summary & Commit Format

After every meaningful update, provide:

```
### Summary
- What changed and why
- Files added/modified/deleted
- Any open questions or follow-ups

### Commit
git add [files]
git commit -m "type(scope): concise description

- Detail 1
- Detail 2
- Detail 3"
```

## 12. Compaction Protocol (Token Optimization)

- **After 4 compactions:** Write a session summary capturing: current phase, what was completed, what is in progress, any blockers or decisions made, and the next step. Then alert me to `/clear`.
- **Between tasks:** Use `/clear` to drop stale context.
- **Keep responses tight:** No preamble, no restating the question, no filler paragraphs.
- **File index exists so you don't read everything.** Only read files relevant to the current task.

## 13. Quality Checklist (Pre-Merge)

Before any branch merges to main:
- [ ] `npm run build` passes (zero errors, zero warnings)
- [ ] `npx tsc --noEmit` passes
- [ ] No `console.log` left in production code (console.error is fine for error handlers)
- [ ] No hardcoded values (everything in constants.ts)
- [ ] No `any` types
- [ ] Error handling on all async operations
- [ ] README updated if public-facing behavior changed

## 14. Rules (Enforcement Layer)

These are non-negotiable. If any rule conflicts with a request, flag it.

1. Never mock data or guess at endpoints.
2. Never merge to main until a branch is complete and confirmed.
3. Never skip error handling, even on "simple" functions.
4. Never use `any` in TypeScript.
5. Always separate concerns: components render, hooks manage state, lib handles logic.
6. Always centralize constants.
7. Always ask before making changes you are not 95% confident about.
8. Always provide a summary and commit message after updates.
9. Always read a file before editing it.
10. Prefer targeted fixes over full rebuilds.
11. All Supabase queries go through lib/supabase.ts. No direct imports in components.
