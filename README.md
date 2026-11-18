# Spot the Discrimination (ไม่เลือกปฏิบัติ)

A scroll-through story and game about everyday discrimination in Thailand. A visitor scrolls through the introduction and the definition, searches an isometric Thai city for **18 hidden cases**, reads each one (what happened, who did it, who was affected, where to report it), answers polls, and ends with a short survey. Built by WeVis with สำนักงาน กสม. (the National Human Rights Commission) and the Friedrich Naumann Foundation.

- **Live:** https://wevisdemo.github.io/non-discrimination/
- **Design system:** [design.md](design.md)
- **Architecture & roadmap:** [architecture.md](architecture.md)

## What is on the site

One page, `/`, made of sections in this order (`src/lib/components/sections/`):

| Section    | What it is                                                                             |
| ---------- | -------------------------------------------------------------------------------------- |
| Intro      | The opening story over the map                                                         |
| Definition | What discrimination is, and how to play                                                |
| Explore    | The map game: pan, zoom, find the 18 cases, open a case card, a hint mode, a reveal    |
| Causes     | Why discrimination still happens, with a poll on a law against it                      |
| Summary    | The e-learning link and a survey (all five questions are needed before it can be sent) |
| About      | About the project                                                                      |

Two kinds of page exist for sharing and search: `/cases/<slug>/` (one case) and `/definition/<cause>/` (one ground of discrimination). All pages are prerendered.

## Getting started

Requires Node ≥ 22.15 and pnpm 11.

```sh
pnpm install
pnpm dev
```

Optional: copy `.env.example` to `.env.local` and set `VITE_NOCODB_TOKEN` to try the polls and survey against the real backend (see [Backend](#backend-for-polls-and-the-survey)). Without it the site works, with placeholder poll percentages, and the survey sends nothing.

## Scripts

| Command                | What it does                                             |
| ---------------------- | -------------------------------------------------------- |
| `pnpm dev`             | Dev server at http://localhost:5173                      |
| `pnpm build`           | Static build to `build/` (set `BASE_PATH` for a subpath) |
| `pnpm preview`         | Serve the production build at http://localhost:4173      |
| `pnpm check`           | Type-check Svelte and TypeScript                         |
| `pnpm lint` / `format` | Prettier + ESLint                                        |
| `pnpm test:unit`       | Vitest (content validation, game state, API client)      |
| `pnpm test:e2e`        | Playwright flows + axe accessibility checks              |

Before the first e2e run, install the browser once: `pnpm exec playwright install chromium`.

CI (`.github/workflows/ci.yml`) runs lint, check, unit and e2e tests on every push.

## Editing content

All content lives in `src/lib/content/` and is validated at build time (`schema.ts`), so a mistake fails the build instead of reaching users.

- `cases/<slug>.json`: one file per case (title, what happened, causes, dimension, forms, who did it, who was affected, an optional note, and the hotspot on the map). `slug` must match the file name and the Figma layer `case-<slug>`.
- `causes.json`: the 9 grounds of discrimination
- `definitions/<cause>.md`: the definition text for each ground (Markdown)
- `intro.ts`, `kp1.ts`, `survey.ts`, `reporting.ts`, `cameras.ts`: the intro, the definition section, the survey options, the reporting channels, and the map camera steps

## Backend for polls and the survey

The site is static. The case polls, the law poll and the survey talk to NocoDB (`sheets.wevis.info`) straight from the browser (`src/lib/api/client.ts`), using the build variable `VITE_NOCODB_TOKEN`.

- That token ends up in the published JavaScript, so anyone can read it. Use a token from a dedicated NocoDB account that is an **Editor on this base only**, never a personal or Creator token.
- Tables: `poll_votes`, `law_votes`, `survey_responses`. Every row carries `CreatedAt` (UTC), `created_at_th` (Thai time, UTC+7) and, if the visitor accepted cookies, `visitor_id` (a random id per browser, so one visitor's votes and answers can be matched).
- Every call fails quietly: if NocoDB is down the visitor can still use the page.

## Analytics and cookies

- **Plausible** (cookieless) is loaded in `src/app.html`. `trackEvent()` in `src/lib/analytics.ts` sends the custom events (`case_found`, `case_opened`, `mode_changed`, `definition_viewed`, `poll_answered`, `survey_submitted`). Create a Goal with the same name in Plausible to see each one.
- The WeVis cookie banner asks once. Until a visitor accepts the "Functionality" cookies the site writes none (`src/lib/state/cookie.ts`): they only remember that this browser has voted or answered, and hold the random `visitor_id`.

## Deployment

Every push to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.

- In the repository settings, set **Pages → Source** to **GitHub Actions**.
- Add the Actions secret `NOCODB_TOKEN` (the Editor-only token above). Without it the deployed site shows placeholder poll percentages.
