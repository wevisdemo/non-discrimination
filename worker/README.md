# API for the polls and the survey

A Cloudflare Worker between the site and NocoDB (`sheets.wevis.info`, base `pjcgtwxsuwfob3r`). It
keeps the NocoDB token out of the browser and checks every value against the site's own lists
before writing.

| Request                   | Does                                                              |
| ------------------------- | ----------------------------------------------------------------- |
| `POST /votes`             | `{ "poll": "karen", "choice": "witnessed" }` adds one vote        |
| `GET /results?poll=karen` | `{ poll, total, percent: { experienced: 41.2, … } }`, cached 60 s |
| `POST /survey`            | `{ age?, gender?, occupation?, province?, satisfaction? }` (1–5)  |

`poll` is a case slug (four ชวนคุย choices) or `law` (the KP3 poll: `agree`, `unnecessary`,
`disagree`). Nothing that identifies a visitor is stored.

## Tables (already created in NocoDB)

- `poll_votes`: `poll`, `choice`, `CreatedAt`. One row per vote.
- `survey_responses`: `age`, `gender`, `occupation`, `province`, `satisfaction`, `CreatedAt`.

## Deploy (once)

```bash
cd worker
npx wrangler login
npx wrangler secret put NOCODB_TOKEN   # paste a NocoDB API token that can write this base
npx wrangler deploy                     # prints https://non-discrimination-api.<you>.workers.dev
```

Then tell the site where it is. For local builds put it in `.env.local`, for the GitHub Pages build
add a repository variable `VITE_API_URL` (Settings → Secrets and variables → Actions → Variables)
and pass it to the build step in `.github/workflows/deploy.yml`:

```
VITE_API_URL=https://non-discrimination-api.<you>.workers.dev
```

Without `VITE_API_URL` the site shows placeholder percentages and does not send anything.

## Notes

- Only `ALLOWED_ORIGINS` (in `wrangler.toml`) can call the write endpoints from a browser. Add the
  production domain there if the site moves off `wevisdemo.github.io`.
- `CASE_SLUGS` in `src/handler.ts` must list every case; `src/lib/api/worker.spec.ts` fails if it
  drifts from `src/lib/content/cases`.
- The token is revocable in NocoDB (Account → Tokens). Rotate it with `wrangler secret put` again.
