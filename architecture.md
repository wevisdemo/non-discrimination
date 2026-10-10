# Architecture

How the Non-Discrimination site is built, and what's left to build. Visual decisions live in [design.md](design.md). This document covers the code.

## 1. Overview

The product is a single isometric illustration of a Thai city (`BG-Final`, 3241 × 3242 px) with **18 hidden discrimination cases**.

- Players pan and zoom around the map and click a spot to open a case card.
- From a case card they can read the legal definition of the matching **cause** (8 grounds of discrimination).
- **ใช้ตัวช่วย** (hint mode) filters hotspots by cause.
- **ดูเฉลย** (reveal mode) highlights every case.

The site is **fully static**, with no backend. Progress is stored in the browser, behind an interface so a backend can be added later without UI changes.

## 2. Stack

| Concern       | Choice                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------- |
| Framework     | SvelteKit 3 + Svelte 5 (runes) + TypeScript                                              |
| Output        | `adapter-static`; every route prerendered; GitHub Pages                                  |
| Styling       | Tailwind CSS v4. Tokens in `src/routes/layout.css` (`@theme`)                            |
| Accessible UI | `bits-ui` (Dialog)                                                                       |
| Pan / zoom    | `@panzoom/panzoom`                                                                       |
| Images        | `@sveltejs/enhanced-img` (AVIF/WebP + `srcset` at build time)                            |
| Content       | JSON + Markdown (`mdsvex`), validated with `zod` at build time                           |
| Fonts         | IBM Plex Sans Thai Looped (`@fontsource`); Kondolar Thai self-hosted (licensed, pending) |
| Tests         | Vitest (unit), Playwright + axe-core (e2e, accessibility)                                |
| CI/CD         | GitHub Actions: `ci.yml` (lint/check/test), `deploy.yml` (Pages)                         |

### SvelteKit 3 conventions used here

- Kit config lives inside `sveltekit({...})` in `vite.config.ts`. There is no `svelte.config.js`.
- `src/lib` is imported through the **`#lib`** alias (package.json `imports`). Import paths **include the file extension**:

  ```ts
  import { cases } from '#lib/content/index.ts';
  import Button from '#lib/components/ui/Button.svelte';
  ```

- Internal links use `resolve()` from `$app/paths`, never hard-coded strings, so the GitHub Pages base path is always applied:

  ```svelte
  <a href={resolve('/cases/[slug]', { slug })}>…</a>
  ```

## 3. Project structure

```
src/
├─ app.html                     lang="th"
├─ app.d.ts                     App.PageState { caseSlug } for shallow routing
├─ routes/
│  ├─ layout.css                Design tokens (@theme) + base styles
│  ├─ +layout.ts                prerender = true, trailingSlash = 'always'
│  ├─ +layout.svelte            Fonts, skip link, Header/Footer
│  ├─ +page.svelte              Intro
│  ├─ explore/                  The map game
│  ├─ cases/                    List of all cases (accessible alternative to the map)
│  ├─ cases/[slug]/             Single case page (share links, OG tags)
│  └─ definition/[cause]/       Definition of one cause
└─ lib/
   ├─ content/
   │  ├─ schema.ts              zod schemas, types, MAP_SIZE, CAUSE_IDS
   │  ├─ index.ts               Loads and validates everything; getCase(), getCause()
   │  ├─ causes.json            8 causes
   │  ├─ cases/*.json           18 cases
   │  └─ definitions/*.md       8 definitions
   ├─ state/
   │  ├─ game.svelte.ts         Game class: found, mode, causeFilter, progress, highlighted
   │  └─ progress.ts            ProgressStore interface; Local + Memory implementations
   ├─ components/
   │  ├─ ui/                    Button, CauseChip, Modal
   │  ├─ layout/                Header, Footer
   │  ├─ map/                   MapCanvas, Hotspot, ModeControls, CauseFilterBar
   │  ├─ case/                  CaseCard, CaseList
   │  └─ definition/            DefinitionPanel, SearchCTA
   └─ analytics.ts              trackEvent(): no-op until a provider is chosen
tests/app.e2e.ts                Playwright flows + axe on every page type
```

## 4. Data model

See `src/lib/content/schema.ts`.

```ts
Cause { id: CauseId; labelTh; labelEn }

Case {
  slug;                 // = Figma layer name without "case-"
  titleTh; summaryTh;
  causes: CauseId[];    // at least one
  hotspot: { x, y, w, h };   // px on the master map (3241 × 3242)
  kp?: 1 | 2 | 3;       // story stage, pending design confirmation
  law: { name, section, url? }[];
  sources: { label, url }[];
}
```

- **Hotspots use master-map pixels.** They were taken from each `case-*` layer's position relative to `BG-Final` in Figma. `Hotspot.svelte` converts them to percentages, so one set of data works for every crop and zoom level.
- **Validation runs at import time.** It checks the schema, that each slug matches its file name, that hotspots lie inside the map, and that every cause has a definition. Any failure stops `pnpm build`.

## 5. State & interaction

- **`Game`** (`game.svelte.ts`) is created per visit to `/explore`.
  - It holds `found` (a reactive `SvelteSet`), `mode` (`default | hint | reveal`) and `causeFilter`.
  - `progress`, `isComplete` and `highlighted` are derived from those.
  - Saved progress is loaded in `onMount` via `restore()`, so the prerendered HTML matches hydration.
- **`ProgressStore`** is an interface. `LocalProgressStore` wraps every `localStorage` call in try/catch, and the game still works if storage is blocked. To add a backend later, implement the same interface.
- **Shallow routing for the case card.**
  - Clicking a hotspot marks the case found and calls `pushState('/cases/<slug>/', { caseSlug })`. A modal then opens over the map.
  - The URL is shareable: opening it directly loads the full prerendered `/cases/<slug>/` page.
  - Browser **Back** closes the modal.
- **Scene states** follow design.md §2.4. A 70% white overlay sits behind the modal; hint mode shows the cause filter bar; reveal mode highlights every hotspot.

## 6. Accessibility & performance targets

- Every hotspot is a `<button>` with `aria-label="กรณี: …"`.
- `/cases/` lists every case without needing the map.
- The page has a skip link. `:focus-visible` shows a 2px `primary` ring, and `prefers-reduced-motion` is respected, including panzoom animation.
- **axe runs in e2e on every page type. Zero violations is a CI gate.**
- Colours that fail AA as body text (`muted`, `info`, `accent`) are commented in `layout.css`. Don't use them for body copy.
- Lighthouse mobile targets: Performance ≥ 85, Accessibility ≥ 95.
- Image targets: the map ships as AVIF per breakpoint, and case images are lazy-loaded (M3/M5).

## 7. Deployment

- `deploy.yml` builds with `BASE_PATH=/<repo-name>` and publishes `build/` to GitHub Pages.
- **One-time setup:** go to Repository → Settings → Pages → Source and choose **GitHub Actions**.
- `static/.nojekyll` stops GitHub's Jekyll processing from hiding the `_app/` directory.
- `404.html` is the SPA fallback for unknown URLs.

## 8. Roadmap

| #      | Scope                                                                                                   | Status        |
| ------ | ------------------------------------------------------------------------------------------------------- | ------------- |
| **M0** | Scaffold, tokens, content schema + placeholders, component skeletons, tests, CI/CD                      | ✅ Done       |
| **M1** | Final UI components against Figma; Kondolar Thai; logo; `/styleguide` dev page                          | Next          |
| **M2** | Real content for 18 cases and 8 definitions; confirm cause mapping and `kp`                             | Needs content |
| **M3** | Master map art, responsive crops, panzoom polish (bounds, initial view, keyboard pan)                   | Needs assets  |
| **M4** | Case card art, Definition panel layout, Intro storytelling, KP1–3/Result flow, KP2 animation            |               |
| **M5** | Performance, OG images, SEO, analytics provider                                                         |               |
| **M6** | Cross-device QA (Figma frames: desktop, iPad Pro 11, iPad Mini 8.3, iPhone 17 Pro Max, Android Compact) |               |

## 9. Blocked on design / content

1. **Assets export** from Figma: `BG-Final`, 18 `case-*` cut-outs, icons, logo, OG image.
2. **Kondolar Thai** `.woff2` files and web license. Drop them in `static/fonts/` and uncomment `@font-face` in `layout.css`.
3. **KP1 / KP2 / KP3 / Result**: what each stage contains and which cases belong to it.
4. **Cause mapping per case.** The current `causes` in `cases/*.json` are **guesses from layer names** and must be confirmed.
5. **Copy** for all cases and definitions. Each currently says `รอเนื้อหาจากทีม content`.
