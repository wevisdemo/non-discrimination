# Architecture

How the Non-Discrimination site is built, and what's left to build. Visual decisions live in [design.md](design.md). This document covers the code.

## 1. Overview

The product is a single isometric illustration of a Thai city (`BG-Final`, 3241 × 3242 px) with **18 hidden discrimination cases**.

- Players pan and zoom around the map and click a spot to open a case card.
- From a case card they can read the legal definition of the matching **cause** (8 grounds of discrimination).
- **ใช้ตัวช่วย** (hint mode) filters hotspots by cause.
- **ดูเฉลย** (reveal mode) highlights every case.

The site is **fully static**, with no backend. Progress is stored in the browser, behind an interface so a backend can be added later without UI changes.

### Story flow (from the Figma prototype)

Source: the prototype's flows `DE-Intro`, `DE-KP1`, `DE-KP2`, `DE-KP3`, `DE-Result` and `Mobile-Intro` (start node `571:8266`). The product's working title in the prototype is **"Spot the Discrimination: ตระหนัก เข้าใจ ไม่เลือกปฏิบัติ"**. Every stage has a ☰ menu (top right, labelled with the current stage) and a floating **อ่านเนื้อหาเต็ม** button (bottom right).

**The site is a single page.** The stages are sections of `/`, in this menu order: Intro, คำนิยามสั้น ๆ ของการเลือกปฏิบัติ (KP1), สืบหา 18 การเลือกปฏิบัติที่ซ่อนอยู่ (KP2), สาเหตุที่ยังพบเห็นการเลือกปฏิบัติ (KP3), บทสรุป (Result) and เกี่ยวกับโครงการ (About). Each is a `<section id>` (`intro`, `definition`, `explore`, `causes`, `summary`, `about`). The menu links to `/#<id>` and scrolls there, and `StageTracker` (scroll-spy) changes the pill label as you scroll. **The map game (KP2, `explore`) is the exception: it is a full-screen overlay, opened by any `#explore` link (the KP1 สำรวจเลย button, the menu, ข้ามส่วนเกริ่น) and closed by ออกจากการสำรวจ, which scrolls on to `#causes`. KP1's แนะนำการสำรวจ opens it as `#explore-tutorial`, with a four-step tour of the map controls first.** It is not in the page's scroll flow, and the sections behind it are `inert` while it is open. **KP3, Result and About are still placeholders** (`SectionPlaceholder`); the menu already scrolls to them.

| Stage                           | Start node  | Menu label                          | What happens                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------- | ----------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Intro**                       | `571:8266`  | Intro                               | Scroll-driven story over the faded map. Opens with "คุณเห็นความผิดปกติในภาพนี้หรือไม่ ?", then the map comes into full colour. Thought bubbles point out cases (for example "มีคนไม่ได้ขึ้นเป็นหัวหน้างานเพราะเป็นผู้หญิง"). Then text cards say discrimination is an "abnormality" hidden in everyday life, caused by ignorance or prejudice (อคติ), and it's time to see and understand the right not to be discriminated against. Ends on the title lock-up and a **คลิกเพื่อดูต่อ** CTA. A **ข้ามส่วนเกริ่น ▶** button skips the whole Intro.                                                                                                                                                                                                                                                                                           |
| **KP1: what discrimination is** | `571:10659` | คำนิยามสั้น ๆ ของการเลือกปฏิบัติ    | Scroll-driven explainer on the map. First, "การมี**ภาพจำที่ลดคุณค่า**คนบางกลุ่ม" (holding stereotypes that devalue some groups), with bubbles such as "คนเพศนี้เป็นผู้นำไม่ได้". Second, these stereotypes "นำไปสู่การ**แบ่งแยก-กีดกัน-จำกัดสิทธิ**ต่อคนกลุ่มนั้น" (lead to separating, excluding and restricting the rights of that group), shown with bubbles such as "เลิกจ้าง". Third, "นั่นคือ**การเลือกปฏิบัติ**". Ends with the game-start popup **"สืบหา 18 การเลือกปฏิบัติที่ซ่อนอยู่"**. It has instructions (pan and zoom the city to find 18 spots, then click one to read it), a **สำรวจเลย!** CTA, and an **แนะนำการสำรวจ** link.                                                                                                                                                                                             |
| **KP2: the game**               | `588:6601`  | สืบหา 18 การเลือกปฏิบัติที่ซ่อนอยู่ | The full-colour, pannable map. Controls on the right: **ออกจากการสำรวจ** (exit and continue the story), **เฉลยตำแหน่งภาพ** (reveal positions), **เจาะดูทีละภาพ** (step through cases one by one). Bottom left: **เปิดตัวช่วย** (hint drawer). Opening a case shows the case card (see below).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **KP3: why it persists**        | `571:10724` | สาเหตุที่ยังพบเห็นการเลือกปฏิบัติ   | An article page on a white background. First, "เราทุกคนมีสิทธิที่จะไม่ถูกเลือกปฏิบัติ", backed by three sources: the UDHR, international human rights law, and the 2017 (B.E. 2560) Constitution sections 4 and 27. Then "แต่ทำไมการเลือกปฏิบัติจึงยังมีให้เห็นอยู่?", answered with two cards: ① stereotypes that go unchallenged, ② no **specific** anti-discrimination law (data as of Nov 2026 / B.E. 2569). Then a note that parliament is considering the **พ.ร.บ. ขจัดการเลือกปฏิบัติต่อบุคคล** (drafts from the public, political parties and the cabinet), and a **Parliament Watch** link ("คลิกที่นี่"). Ends with an **opinion poll** ("แล้วคุณคิดยังไง กับการมีกฎหมายขจัดการเลือกปฏิบัติต่อบุคคล 'เป็นการเฉพาะ'?", options ดีเลย / ไม่เห็นจำเป็น / ไม่เห็นด้วย, marked as collecting no personal data) and **คลิกเพื่อดูต่อ**. |
| **Result: conclusion**          | `1069:5176` | บทสรุป                              | Closing cards over the map. Closing gaps in the law must go together with dismantling stereotypes, and everyone can start "วันนี้ ตอนนี้". Then **ขอบคุณที่อยู่ด้วยกันจนจบ!** and an **anonymous survey**: age, gender, occupation, province, and a 5-face satisfaction scale, with a **ส่งคำตอบ** button. The data is for กสม. only. Then share buttons (copy link, Facebook, X), a promo for **E-Learning "The Inclusion Lab"** (กสม. × MovED × มูลนิธิเพื่อสิทธิความหลากหลาย), and กสม. contact channels: Facebook, complaints.nhrc.or.th, hotline 1377, and nhrc.or.th.                                                                                                                                                                                                                                                                 |

**Case card** (opened from the map or via เจาะดูทีละภาพ). Top to bottom:

- Cut-out illustration and a counter (`13/18`) with ‹ › controls
- Title, for example "ผู้ติดเชื้อ HIV เป็นตำรวจไม่ได้", and the story text
- Three labelled facts:
  - **สาเหตุแห่งการเลือกปฏิบัติ** (cause chip)
  - **มิติแห่งการเลือกปฏิบัติ** (dimension, e.g. การจ้างงาน)
  - **รูปแบบของการเลือกปฏิบัติ** (form, e.g. เชิงโครงสร้าง)
- A **ชวนคุย** poll with 4 choices: เคยโดนกับตัว / เคยเห็นกับตา / เคยได้ยินมา / ไม่เคยโดนกับตัว. After voting it shows **the percentage of all voters** for each choice.
- กสม. contact channels

**Definition panel** (อ่านเนื้อหาเต็ม). One shared overlay, not a page per cause. It has three tabs: **คำนิยาม**, **ใครมักถูกเลือกปฏิบัติ** and **กรณีที่พบบ่อย**. The คำนิยาม tab defines discrimination as citing a "เหตุ", with three accordions:

- **เหตุ**: the 13 grounds in Constitution section 27, plus "เหตุอื่นใดที่ไม่เป็นธรรม"
- **มิติ**: employment, work, access to education, access to goods and services, and social participation (source: กสม. 2017 / B.E. 2560 research)
- **รูปแบบ**: direct, indirect, harassment, by association, and structural

It ends with the "สืบหา 18…" CTA.

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
│  ├─ +page.svelte              The single page: all six sections, in menu order
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
   │  ├─ stage.svelte.ts        StageTracker: scroll-spy for the current section (drives the ☰ pill)
   │  ├─ explore.svelte.ts      Whether the map overlay is open (hash `#explore`, or a case card over it)
   │  └─ progress.ts            ProgressStore interface; Local + Memory implementations
   ├─ components/
   │  ├─ ui/                    Button, CauseChip, Modal
   │  ├─ layout/                Header, Footer
   │  ├─ sections/              IntroSection, DefinitionSection, ExploreSection, SectionPlaceholder
   │  ├─ map/                   MapScene, MapCamera, MapCanvas, Hotspot, ExploreNav, HintDrawer
   │  ├─ story/                 ScrollStory (sticky map + scroll steps), StoryCard, ThoughtBubble, ContinueLink, Balloons, GameThumbnail
   │  ├─ case/                  CaseCard, CasePanel, CasePoll, ReportingChannels, CaseList
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

- **`Game`** (`game.svelte.ts`) is created by `ExploreSection`.
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

| #      | Scope                                                                                                           | Status        |
| ------ | --------------------------------------------------------------------------------------------------------------- | ------------- |
| **M0** | Scaffold, tokens, content schema + placeholders, component skeletons, tests, CI/CD                              | ✅ Done       |
| **M1** | Final UI components against Figma; Kondolar Thai; logo; `/styleguide` dev page                                  | Next          |
| **M2** | Real content for 18 cases and 8 definitions; confirm cause mapping and `kp`                                     | Needs content |
| **M3** | ~~Master map art~~ (done: `scripts/extract-map-assets.js`); panzoom polish (bounds, initial view, keyboard pan) | In progress   |
| **M4** | ~~Intro, KP1~~ (done); KP3, Result pages; case card art; Definition panel; KP2 animation                        | In progress   |
| **M5** | Performance, OG images, SEO, analytics provider                                                                 |               |
| **M6** | Cross-device QA (Figma frames: desktop, iPad Pro 11, iPad Mini 8.3, iPhone 17 Pro Max, Android Compact)         |               |

## 9. Blocked on design / content

1. **Assets export** from Figma: ~~`BG-Final`, 18 `case-*` cut-outs~~ (done: run `node scripts/extract-map-assets.js "<Group 63>.svg"` after any map change), ~~icons, WeVis logo, "Spot the Discrimination" logo~~ (done: `src/lib/assets/intro/`, from Figma node `571:8266`), OG image.
2. ~~**Intro bubbles.**~~ Done: the three bubbles (blue, orange, yellow) from Figma frame `m-2` are in `introBubbles` in `src/lib/content/intro.ts`. The Intro's bubble layout is tuned for desktop; on narrow phones the right-hand bubbles run off screen (check in M6).
3. **Kondolar Thai** `.woff2` files and web license. Drop them in `static/fonts/` and uncomment `@font-face` in `layout.css`.
4. ~~**KP1 / KP2 / KP3 / Result**~~: resolved from the prototype (see §1 Story flow).
   Cases are all part of KP2, so `kp` on `Case` is no longer needed.
5. **Backend for polls and the survey.** The case poll and the KP3 poll show aggregated percentages, and the Result survey submits data for กสม. All three need shared storage, which conflicts with the "no backend" decision in M0.
6. **Gaps between the M0 scaffold and the prototype:**
   - `Case` needs `dimension` and `form` fields.
   - Definitions should be one tabbed panel, not 8 per-cause pages.
   - KP3, Result and About need their sections (`SectionPlaceholder` stands in; Intro and KP1 are done with `ScrollStory`; KP3 is a plain article page).
   - The game needs a เจาะดูทีละภาพ mode (step through cards with ‹ ›) and an exit to KP3.
7. **Cause mapping per case.** The current `causes` in `cases/*.json` are **guesses from layer names** and must be confirmed.
8. **Copy** for all cases and definitions. Each currently says `รอเนื้อหาจากทีม content`.
