# Project Checklist — Cold Case Network (Demo Build)

> One-day build checklist. Strikethrough (~~item~~) marks completed items.

## Planning (before any code)
- ~~PRD filled out (problem, users, user stories, feature scope, data sources, ROI)~~ *carried from original*
- ~~P0/P1/P2 features defined and mapped to phases~~ *scoped to 2 demos*
- ~~Data sources confirmed accessible (CSV downloaded, Mapbox token active)~~
- ~~Open questions from PRD resolved~~
- ~~Design guidelines filled out (colors, fonts, spacing, component patterns)~~

## Repo Setup
- [ ] `git init` or repo created on GitHub
- [ ] `.gitignore` includes: node_modules, .env*, .next, claude.local.md
- [ ] `claude.local.md` added to global gitignore
- [ ] CLAUDE.md copied to repo root
- [ ] claude.local.md copied to repo root
- [ ] DESIGN-GUIDELINES.md copied to repo root
- [ ] `.env.local` created with Supabase + Mapbox keys
- [ ] `.env.example` created with placeholder values (committed)
- [ ] Initial commit: `chore(setup): initialize project with config files`

## Data Prep (Phase 0)
- [ ] Supabase project created (free tier)
- [ ] Table schema designed and created in Supabase
- [ ] SHR65_23.csv filtered to 1980-2000 (417,255 records)
- [ ] Rhode Island typo fixed in loader
- [ ] Data loaded to Supabase successfully
- [ ] Green River query verified: WA + Female + Strangulation returns 128 cases, 62 unsolved
- [ ] State reporting rates table created (51 rows)

## Build (Phases 1-7)

### Phase 1: Scaffold
- [ ] Next.js 16 project initialized with TypeScript
- [ ] Tailwind CSS v4 configured
- [ ] Zustand installed
- [ ] Supabase client set up in lib/supabase.ts
- [ ] File structure matches CLAUDE.md index
- [ ] `npm run build` passes
- [ ] `npx tsc --noEmit` passes

### Phase 2: Landing Page
- [ ] Dark splash screen with crimson/black scheme
- [ ] Headline: "COLD. CLUSTERED. CONNECTED."
- [ ] ENTER button with pulse animation
- [ ] Transition to map view
- [ ] `npm run build` passes

### Phase 3: Map View
- [ ] Mapbox dark basemap rendering
- [ ] Cluster markers from Supabase data
- [ ] Graduated marker sizing (case count)
- [ ] Amber-to-red color scale
- [ ] Live counter: cases, unsolved, clusters
- [ ] `npm run build` passes

### Phase 4: Filter Panel
- [ ] State dropdown (searchable)
- [ ] Victim Sex toggle pills
- [ ] Weapon Type dropdown
- [ ] Solve Status toggle pills
- [ ] Filters update map markers + live counter
- [ ] Data Confidence badge
- [ ] RESET ALL link
- [ ] Green River filter sequence works: WA → Female → Strangulation
- [ ] `npm run build` passes

### Phase 5: Detail Panel
- [ ] Right slide-out on cluster click (380px)
- [ ] Cluster header with county, count, date span
- [ ] 2x2 detail cards
- [ ] Generated story brief paragraph
- [ ] Mini case table
- [ ] Close button
- [ ] `npm run build` passes

### Phase 6: Insights Page
- [ ] State reporting rates visualization
- [ ] Mississippi, Florida, Iowa highlighted
- [ ] Confidence badges (green/amber/red)
- [ ] Explanatory text
- [ ] `npm run build` passes

### Phase 7: Navigation
- [ ] Persistent top nav: Map · Insights · Methodology
- [ ] Active tab indicator
- [ ] Smooth page transitions
- [ ] `npm run build` passes

## Deploy (Phase 8)
- [ ] Vercel project created
- [ ] Environment variables set in Vercel BEFORE first deploy
- [ ] First deploy successful
- [ ] Landing page loads on production URL
- [ ] Demo 1 works: Green River filter sequence → clusters appear → detail panel opens
- [ ] Demo 2 works: Insights page shows reporting gap data
- [ ] Full 3-minute script rehearsed with live app (minimum 2 run-throughs)

## Post-Deploy
- [ ] README filled out
- [ ] Production URL confirmed working in incognito
- [ ] Script printed or loaded on phone for reference during presentation
