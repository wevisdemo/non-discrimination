# ไม่เลือกปฏิบัติ (Non-Discrimination)

An interactive "spot the discrimination" game: explore an isometric Thai city, find 18 hidden cases, and learn the legal definition behind each one.

- **Design system:** [design.md](design.md)
- **Architecture & roadmap:** [architecture.md](architecture.md)
- **Live:** https://wevisdemo.github.io/non-discrimination/

## Getting started

Requires Node ≥ 22.15 and pnpm 11.

```sh
pnpm install
pnpm dev
```

## Scripts

| Command                | What it does                                             |
| ---------------------- | -------------------------------------------------------- |
| `pnpm dev`             | Dev server at http://localhost:5173                      |
| `pnpm build`           | Static build to `build/` (set `BASE_PATH` for a subpath) |
| `pnpm preview`         | Serve the production build at http://localhost:4173      |
| `pnpm check`           | Type-check Svelte and TypeScript                         |
| `pnpm lint` / `format` | Prettier + ESLint                                        |
| `pnpm test:unit`       | Vitest (content validation, game state)                  |
| `pnpm test:e2e`        | Playwright flows + axe accessibility checks              |

Before the first e2e run, install the browser once: `pnpm exec playwright install chromium`.

## Editing content

All content lives in `src/lib/content/` and is validated at build time, so a mistake fails the build instead of reaching users.

- `causes.json`: the 8 grounds of discrimination
- `cases/<slug>.json`: one file per case; `slug` must match the file name and the Figma layer `case-<slug>`
- `definitions/<cause>.md`: the definition page for each cause (Markdown)

## Deployment

Every push to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.
In the repository settings, set **Pages → Source** to **GitHub Actions**.
