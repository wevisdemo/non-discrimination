# Non-Discrimination — Design System

> Developer handoff document for the **Non-Discrimination** interactive experience (PunchUp).
> Source: Figma file `SCfp3fqLRloR06pFG6fCzD`, page **"Draft 2 👈 (current stage)"** (`571:7213`).

---

## 0. About this document

### What the product is

The main experience is a **"spot the discrimination" exploration game** set in one large isometric illustration of a Thai city. Users pan around the scene, find hidden **cases** (real-world discrimination stories), open a case card to read about it, and learn the legal definition behind it. Hint (`ใช้ตัวช่วย`) and answer-reveal (`ดูเฉลย`) modes help users who get stuck.

### Where the values come from

| Label          | Meaning                                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **From Figma** | Read directly from the file's local Variables and Text Styles. Treat these as the source of truth.                           |
| **Observed**   | Read from the canvas: frame names, section names, screenshots. Accurate in intent, but check exact pixel values in Dev Mode. |
| **Proposed**   | Not defined in the file. A recommended default that fills a gap in the system. Confirm with design before shipping.          |

Figma sections and their status:

| Section                                          | Status                             |
| ------------------------------------------------ | ---------------------------------- |
| ✅ Ready to Dev – Desktop Prototype (`571:8265`) | Build from this                    |
| ✅ Ready to Dev – Mobile Prototype (`571:7629`)  | Build from this                    |
| ⚠️ In progress – Desktop / Mobile                | Do not build yet                   |
| Illustration for screens (`897:5613`)            | Responsive crops of the main scene |
| Colour palettes (`571:8654`)                     | Illustration palette               |
| ❖ Components (`1013:17824`)                      | Component library                  |

---

## 1. Typography

### 1.1 Font families — _From Figma_

The system uses two Thai-first typefaces. One is a display face for headlines; the other is a looped Thai face for body text, which reads better at small sizes.

| Role                 | Family                        | Figma variable      | Weights used              |
| -------------------- | ----------------------------- | ------------------- | ------------------------- |
| **Header / Display** | **Kondolar Thai**             | `Text Style/Header` | Regular (400), Bold (700) |
| **Body / UI**        | **IBM Plex Sans Thai Looped** | `Text Style/Body`   | Regular (400), Bold (700) |

> **Font loading notes**
>
> - **IBM Plex Sans Thai Looped** is free on Google Fonts.
> - **Kondolar Thai** is a commercial typeface, so it can't be loaded from a public CDN. Self-host the licensed `.woff2` files under `/public/fonts/` and confirm the web license covers this project.
> - Always declare a Thai-capable fallback (`"Noto Sans Thai"`, `sans-serif`) so text doesn't fall back to a Latin-only font while fonts load.

### 1.2 Type scale

Only some steps of the scale exist in the file as variables or styles. The rest are proposed to make the scale complete. Every text style in the file uses **140% line height**.

| Token | Desktop  | Mobile            | Family | Line height       | Source                                           |
| ----- | -------- | ----------------- | ------ | ----------------- | ------------------------------------------------ |
| `H3`  | **60px** | 40px _(proposed)_ | Header | 120% _(proposed)_ | Size: Figma `Text Size/H3`                       |
| `H6`  | **32px** | **24px**          | Header | **140%**          | Figma text styles `Desktop/*/H6`, `Mobile/*/H6`  |
| `H7`  | **28px** | 22px _(proposed)_ | Header | 140%              | Size: Figma `Text Size/H7`                       |
| `B4`  | **18px** | 16px _(proposed)_ | Body   | 140%              | Figma `Text Size/B4`                             |
| `B5`  | **16px** | 16px              | Body   | 140%              | Figma `Text Size/B5` (default body)              |
| `B6`  | **14px** | 14px              | Body   | 140%              | Figma `Text Size/B6`                             |
| `B7`  | **12px** | 12px              | Body   | 140%              | Figma `Text Size/B7` (captions, legal footnotes) |

> **Why 140%:** Thai script stacks vowels and tone marks above and below the baseline (for example ปฏิ, ญ, ฎ). A tight line height clips these marks. Keep body text at **140% or more**, and never go below **120%**, even for large display text.

**Text styles in Figma** (4 total):

```
Desktop/Bold/H6      Kondolar Thai Bold     32 / 140%
Desktop/Regular/H6   Kondolar Thai Regular  32 / 140%
Mobile/Bold/H6       Kondolar Thai Bold     24 / 140%
Mobile/Regular/H6    Kondolar Thai Regular  24 / 140%
```

### 1.3 CSS custom properties

```css
/* fonts.css */
@font-face {
	font-family: 'Kondolar Thai';
	src: url('/fonts/KondolarThai-Regular.woff2') format('woff2');
	font-weight: 400;
	font-display: swap;
}
@font-face {
	font-family: 'Kondolar Thai';
	src: url('/fonts/KondolarThai-Bold.woff2') format('woff2');
	font-weight: 700;
	font-display: swap;
}
/* IBM Plex Sans Thai Looped, loaded from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai+Looped:wght@400;700&display=swap');
```

```css
/* tokens/typography.css */
:root {
	/* Families */
	--font-header: 'Kondolar Thai', 'Noto Sans Thai', sans-serif;
	--font-body: 'IBM Plex Sans Thai Looped', 'Noto Sans Thai Looped', 'Noto Sans Thai', sans-serif;

	/* Weights */
	--font-weight-regular: 400;
	--font-weight-bold: 700;

	/* Sizes: mobile-first */
	--text-h3: 2.5rem; /* 40px (proposed) */
	--text-h6: 1.5rem; /* 24px */
	--text-h7: 1.375rem; /* 22px (proposed) */
	--text-b4: 1rem; /* 16px (proposed) */
	--text-b5: 1rem; /* 16px */
	--text-b6: 0.875rem; /* 14px */
	--text-b7: 0.75rem; /* 12px */

	/* Line heights */
	--leading-display: 1.2; /* proposed, for H3 only */
	--leading-default: 1.4; /* Figma: 140% */
}

@media (min-width: 1024px) {
	:root {
		--text-h3: 3.75rem; /* 60px */
		--text-h6: 2rem; /* 32px */
		--text-h7: 1.75rem; /* 28px */
		--text-b4: 1.125rem; /* 18px */
	}
}

/* Semantic text classes */
.text-h3 {
	font: var(--font-weight-bold) var(--text-h3)/var(--leading-display) var(--font-header);
}
.text-h6 {
	font: var(--font-weight-bold) var(--text-h6)/var(--leading-default) var(--font-header);
}
.text-h6-regular {
	font: var(--font-weight-regular) var(--text-h6)/var(--leading-default) var(--font-header);
}
.text-h7 {
	font: var(--font-weight-bold) var(--text-h7)/var(--leading-default) var(--font-header);
}
.text-b4 {
	font: var(--font-weight-regular) var(--text-b4)/var(--leading-default) var(--font-body);
}
.text-b5 {
	font: var(--font-weight-regular) var(--text-b5)/var(--leading-default) var(--font-body);
}
.text-b6 {
	font: var(--font-weight-regular) var(--text-b6)/var(--leading-default) var(--font-body);
}
.text-b7 {
	font: var(--font-weight-regular) var(--text-b7)/var(--leading-default) var(--font-body);
}

body {
	font-family: var(--font-body);
	font-size: var(--text-b5);
	line-height: var(--leading-default);
	color: var(--color-text-secondary);
}
```

### 1.4 Tailwind config (typography)

```js
// tailwind.config.js (excerpt)
module.exports = {
	theme: {
		extend: {
			fontFamily: {
				header: ['"Kondolar Thai"', '"Noto Sans Thai"', 'sans-serif'],
				body: [
					'"IBM Plex Sans Thai Looped"',
					'"Noto Sans Thai Looped"',
					'"Noto Sans Thai"',
					'sans-serif'
				]
			},
			fontSize: {
				// [size, lineHeight]: desktop values; use the `lg:` prefix pattern below
				h3: ['3.75rem', '1.2'], // 60
				h6: ['2rem', '1.4'], // 32
				'h6-m': ['1.5rem', '1.4'], // 24 (mobile)
				h7: ['1.75rem', '1.4'], // 28
				b4: ['1.125rem', '1.4'], // 18
				b5: ['1rem', '1.4'], // 16
				b6: ['0.875rem', '1.4'], // 14
				b7: ['0.75rem', '1.4'] // 12
			}
		}
	}
};
```

```html
<!-- Usage -->
<h2 class="font-header text-h6-m font-bold text-primary lg:text-h6">นิยามการเลือกปฏิบัติ</h2>
<p class="text-secondary font-body text-b5">…</p>
```

---

## 2. Illustration System

Illustration is the core of this product, not decoration. The main scene **is** the interface.

### 2.1 Visual style — _Observed_

| Attribute      | Description                                                                                                                                                                                                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Projection** | **Isometric**, about 30°, viewed from a high angle. The whole world sits on one square master canvas (`BG-Final`, 3241 × 3242).                                                                                                                                                                                          |
| **Line**       | Thin, even-weight **black outlines** on every object. No tapering and no sketchy strokes.                                                                                                                                                                                                                                |
| **Fill**       | **Flat colour**: no gradients, no textures. Light shading is a single darker tint on the side faces of buildings.                                                                                                                                                                                                        |
| **Characters** | Small, chibi-scale, densely packed, in the spirit of _Where's Wally_. Each one has a readable pose and action. They are drawn to show **diverse people**: different ages, genders, religions (hijab), disabilities (wheelchair users), ethnic groups (Karen), and occupations (police, monks, office workers, students). |
| **Setting**    | Recognisably **Thai everyday life**: temple chedi, school, police station, government office, bar, hospital, market stalls, taxis, buses.                                                                                                                                                                                |
| **Mood**       | Busy, observational, and lightly playful, but **never mocking**. The tone invites curiosity ("look closer") rather than blame.                                                                                                                                                                                           |

### 2.2 Illustration palette — _Observed (Colour palettes section)_

The illustration palette is separate from the UI palette. It's a set of saturated hues, each with a 5-step tint ramp from full saturation down to a very light wash.

| Hue            | Base (approximate)    | Use in the scene                                         |
| -------------- | --------------------- | -------------------------------------------------------- |
| Neutral        | `#000000` → `#C8C8C8` | Outlines, roads, pavement, buildings                     |
| Royal blue     | `#2755CD`             | Vehicles, uniforms, signage (shared with the UI primary) |
| Magenta / Pink | `#FF3DC8` → `#FFE8F7` | Interiors, highlight rooms, clothing                     |
| Lime           | `#C6E000` → `#E9EDD6` | Foliage, accents                                         |
| Yellow         | `#F0F000` → `#FFFFE8` | Taxis, rooftops, temple gold                             |
| Orange         | `#FF6A1F` → `#FFE8E0` | Buses, roof tiles, warm accents                          |
| Bright blue    | `#1E3BFF` → `#8C9CFF` | Cars, signage                                            |

> These hex values are sampled from a screenshot, so they're approximate. Export exact values from the **Colour palettes** section (`571:8654`) before you hard-code them.

### 2.3 Asset inventory — _From Figma (layer names)_

**Master scene**

| Asset      | Size        | Notes                                                         |
| ---------- | ----------- | ------------------------------------------------------------- |
| `BG-Final` | 3241 × 3242 | Full map, used as the pannable background                     |
| `image 42` | 3241 × 3242 | Alternate scene version (likely the "answers revealed" state) |

**Case cut-outs.** Each case is a transparent PNG of the characters involved, placed over the map at its hotspot.

```
case-cambodian-husband       case-hiv-police
case-age-limit-job           case-ex-con-job
case-elderly-mobile-banking  case-marriage-remarry
case-transgender-bar         case-hate-speech
case-karen                   case-katoey-police
case-disability-judge        case-gender-promotion
case-disabled-police         case-hijab-school
case-prison-corruption       case-housework-gender
case-hiv-test-job            case-social-security
```

**Responsive crops** (section _Illustration for screens_): Standard Desktop, iPad Pro 11", iPad Mini 8.3", iPhone 17 Pro Max, Android Compact, and a dedicated **Mobile intro screen**. The scene is **re-cropped** for each device, not scaled down.

### 2.4 Usage guidelines

1. **One world.** Every case lives inside the same isometric city. Don't add stand-alone spot illustrations in a different style.
2. **Scene states:**
   - **Default:** full-colour scene.
   - **Focused (modal or panel open):** dim the scene with a white overlay (about 60–70% opacity, _observed_) so the case card stands out.
   - **Hint mode (`ใช้ตัวช่วย`):** scene stays visible, and the cause filters (see §4.4) appear at the bottom.
   - **Reveal (`ดูเฉลย`):** found or answer cases are highlighted on the dimmed scene.
3. **Case cut-outs** reuse the scene's exact drawing. When a case opens in a card, show its cut-out at the top as the visual anchor.
4. **Formats:** export the master map as **WebP/AVIF at 2×**, with a 1× fallback. It's large, so use responsive `srcset` per device crop. Export case cut-outs as **transparent WebP/PNG**. Keep icons as **SVG**.
5. **Accessibility:** the scene is decorative (`alt=""`). Each hotspot is a real `<button>` with an `aria-label` that names the case, for example `aria-label="กรณี: นักเรียนสวมฮิญาบ"`. Every case must also be reachable by keyboard and through a list view, not only by hunting visually.
6. **Representation check:** every new character or case needs review for respectful portrayal. Never make a protected characteristic the joke.

---

## 3. Main Page Layout

### 3.1 Screen inventory — _Observed (✅ Ready to Dev – Desktop)_

```
Intro / Onboarding ─► KP1 ─► KP2 (with animation) ─► KP3 ─► Result
                       │
                       ▼
                 Default Screen (map)
                   ├─ Case / Info Navigation (case card modal)
                   ├─ ดูเฉลย   (reveal answers)
                   ├─ ใช้ตัวช่วย (hint mode + cause filters)
                   └─ Definition panel (KP1, KP3, Result) / (KP2 variant)
```

"KP" refers to the key-point stages of the story flow. KP2 has its own animation sequence (section `KP2-Animation`).

### 3.2 Breakpoints & grid

| Breakpoint | Reference frame                                                            | Columns | Margin    | Gutter   | Source                          |
| ---------- | -------------------------------------------------------------------------- | ------- | --------- | -------- | ------------------------------- |
| Mobile     | 320–440 (frames `m-2` 320×480, iPhone 17 Pro Max, Android Compact 412×917) | 4       | 16 (`m`)  | 16 (`m`) | Frames observed; grid proposed  |
| Tablet     | 744–834 (iPad Mini 8.3, iPad Pro 11)                                       | 8       | 32 (`l`)  | 16 (`m`) | Frames observed; grid proposed  |
| Desktop    | **1280** (`Screen` variable)                                               | 12      | 64 (`xl`) | 32 (`l`) | Width from Figma; grid proposed |

```css
:root {
	--screen-max: 1280px; /* Figma: Screen */
	--bp-tablet: 744px;
	--bp-desktop: 1024px;
}
```

**Layout rule:** the **map is full-bleed** and ignores the grid. The grid applies only to UI layered over the map (header, cards, panels) and to text-heavy pages (Intro, Definition).

### 3.3 Spacing — _From Figma_

The spacing scale doubles at each step (a geometric ×2 scale). Use only these values.

| Token  | Value | Typical use                                             |
| ------ | ----- | ------------------------------------------------------- |
| `xxs`  | 2px   | Hairline offsets, icon nudges                           |
| `xs`   | 4px   | Icon-to-label gap, chip inner gap                       |
| `s`    | 8px   | Inside buttons and chips, list-item gap                 |
| `m`    | 16px  | Card padding (mobile), standard gap, mobile page margin |
| `l`    | 32px  | Card padding (desktop), gap between sections in a card  |
| `xl`   | 64px  | Desktop page margin, vertical gap between page sections |
| `xxl`  | 128px | Hero and section separation on long scroll pages        |
| `xxxl` | 256px | Intro storytelling scroll gaps                          |

```css
:root {
	--space-xxs: 2px;
	--space-xs: 4px;
	--space-s: 8px;
	--space-m: 16px;
	--space-l: 32px;
	--space-xl: 64px;
	--space-xxl: 128px;
	--space-xxxl: 256px;
}
```

### 3.4 Component placement

#### A. Header — _Observed_

- Height: **80px** on mobile (frame `Head`, 320×80). Proposed: the same 80px on desktop, or 64px.
- Logo or wordmark on the left; navigation and actions on the right.
- Background `--color-bg-white`. It stays fixed over the map.

#### B. Default Screen (map)

```
┌──────────────────────────────────────────────┐
│ Header (fixed)                               │
├──────────────────────────────────────────────┤
│                                              │
│      Isometric map: full-bleed, pannable     │
│      • hotspot buttons over each case        │
│      • floating counter / progress (top-right)│
│                                              │
│   [ ใช้ตัวช่วย ]                  [ ดูเฉลย ] │  ← floating actions
└──────────────────────────────────────────────┘
```

- The map fills `100vw × (100dvh − header)`. Support drag-to-pan, and pinch or wheel zoom.
- In hint mode, a **horizontal row of cause chips** appears at the bottom (8 categories, colour-coded; see §4.4). It scrolls horizontally on mobile.

#### C. Case / Info Navigation (case card)

```
        ┌──────────────────────┐
        │   [case cut-out]     │
        │   Case title (H7)    │
        │   Story text (B5)    │
        │ ┌──────────────────┐ │  ← info rows on ui-secondary (#DDE6FF)
        │ │ Cause · Law · …  │ │
        │ └──────────────────┘ │
        │  ‹ prev     next ›   │
        └──────────────────────┘
```

- A centred modal over the dimmed map. Proposed width: **about 420px on desktop**, full width minus 2 × 16px on mobile.
- Padding `l` (32px) on desktop and `m` (16px) on mobile. Background `--color-ui-modal`.
- Prev and next controls step through cases without closing the card.

#### D. Definition panel (KP1 / KP3 / Result, plus a KP2 variant)

A long, single-column reading panel. Top to bottom:

1. **Tab bar** (primary blue): switches between definitions.
2. **Section header**: a band on `--color-ui-primary` (pink) with an H6 title.
3. **Definition blocks**: cards on `--color-ui-secondary` (light blue) with an icon or cut-out and body text.
4. **Search CTA card**: magnifier icon plus prompt, inviting users back to the map to find more cases.
5. **Footer**: on `--color-bg-primary` or pink, with partner and organisation logos and share links.

Max reading width: proposed **640px** (about 60–70 Thai characters per line).

#### E. Intro / Onboarding

A tall storytelling scroll. A hero crop of the map sits at the top, the background fades through a colour gradient, scattered case vignettes appear on scroll, and the page ends with the title lock-up and a **primary CTA** to enter the map. Vertical rhythm uses `xxl` and `xxxl`.

### 3.5 Shared components

| Component            | Spec (from tokens)                                                                                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Primary button**   | bg `ui-primary` → hover `hover-primary` → active border `active-secondary`; text `text-Black`, B5 bold; padding `s m`; radius `999px` _(proposed, the design shows pill shapes)_ |
| **Secondary button** | bg `ui-secondary` → hover `hover-secondary`; text `text-Primary`                                                                                                                 |
| **Disabled**         | bg `ui-disable`, text `text-info-2`, `cursor: not-allowed`                                                                                                                       |
| **Link**             | `link-primary` (black), hover `link-Hover` (blue) + underline                                                                                                                    |
| **Card / Modal**     | bg `ui-modal`, padding `m`/`l`, radius 16px _(proposed)_                                                                                                                         |
| **Tab (active)**     | border-bottom or bg `active-primary` (#2755CD), text white                                                                                                                       |
| **Cause chip**       | bg = the matching `Causes/*` colour, text black, B6, padding `xs s`                                                                                                              |
| **Focus ring**       | 2px `border-primary` + 2px offset _(proposed, for keyboard users)_                                                                                                               |

---

## 4. Colours & Design Tokens

All values in this section are **from Figma** (`Collection 1`). Paint styles are empty; Variables are the only source of truth.

### 4.1 Brand: primary & secondary

The UI palette pairs **soft pink** (warmth, approachability) with **royal blue** (trust, information, law). Both are kept separate from the louder illustration colours so UI elements stay readable on top of the scene.

| Role                        | Token                                                               | Hex       | Swatch use                                     |
| --------------------------- | ------------------------------------------------------------------- | --------- | ---------------------------------------------- |
| **Primary: Blue**           | `text-Primary` / `border-primary` / `active-primary` / `link-Hover` | `#2755CD` | Headings, links on hover, active tabs, borders |
| **Primary: Pink surface**   | `ui-primary`                                                        | `#F6C9E8` | Primary buttons, section bands                 |
| Pink hover                  | `hover-primary`                                                     | `#FFB1ED` | Primary button hover                           |
| Pink accent                 | `border-secondary` / `active-secondary`                             | `#FF76D4` | Active and selected states, accent borders     |
| Pink background             | `background-primary`                                                | `#FFF1FB` | Page tint, footer                              |
| **Secondary: Blue surface** | `ui-secondary`                                                      | `#DDE6FF` | Secondary buttons, info blocks                 |
| Blue hover                  | `hover-secondary`                                                   | `#7FA0F4` | Secondary button hover                         |

### 4.2 Neutrals & text

| Token                                                                        | Hex       | Use                                                         |
| ---------------------------------------------------------------------------- | --------- | ----------------------------------------------------------- |
| `text-Black` / `link-primary`                                                | `#000000` | High-emphasis text, default links                           |
| `text-Secondary`                                                             | `#4C4C4C` | **Default body text**                                       |
| `text-info-2`                                                                | `#858585` | Meta text, captions (large or non-essential only, see §4.5) |
| `ui-disable`                                                                 | `#D9D9D9` | Disabled surfaces, dividers                                 |
| `text-White` / `text-inverse` / `ui-white` / `ui-modal` / `background-white` | `#FFFFFF` | Surfaces, text on blue                                      |

### 4.3 Feedback

| Token       | Hex       | Use                         |
| ----------- | --------- | --------------------------- |
| `text-info` | `#FE6D69` | Alerts, notes, "new" badges |

### 4.4 Discrimination causes (category palette)

Each **ground of discrimination** has its own colour. Use these for filter chips, case tags, and map hotspot highlights.

| Token                                | Thai label                  | English                     | Hex       |
| ------------------------------------ | --------------------------- | --------------------------- | --------- |
| `Causes/เชื้อชาติ`                   | เชื้อชาติ                   | Race                        | `#FF8080` |
| `Causes/เพศ`                         | เพศ                         | Sex / Gender                | `#F6C9E8` |
| `Causes/อายุ`                        | อายุ                        | Age                         | `#93FFDD` |
| `Causes/ความเชื่อทางศาสนา`           | ความเชื่อทางศาสนา           | Religious belief            | `#FAFD56` |
| `Causes/สภาพทางกายหรือสุขภาพ`        | สภาพทางกายหรือสุขภาพ        | Physical condition / Health | `#EDD165` |
| `Causes/สถานะของบุคคล`               | สถานะของบุคคล               | Personal status             | `#CBE79A` |
| `Causes/สถานะทางสังคม`               | สถานะทางสังคม               | Social status               | `#BBCEFE` |
| `Causes/เผ่าพันธุ์แห่งชาติหรือสังคม` | เผ่าพันธุ์แห่งชาติหรือสังคม | National or social origin   | `#FFB703` |

> All cause colours are light or mid-tone. Always put **black text** on them, never white. Because colour alone can't carry the meaning, every chip and tag must also show its **text label**.

### 4.5 Contrast check (WCAG 2.2)

| Foreground / Background | Ratio     | Result                                                                               |
| ----------------------- | --------- | ------------------------------------------------------------------------------------ |
| `#2755CD` on `#FFFFFF`  | 6.43 : 1  | ✅ AA                                                                                |
| `#2755CD` on `#FFF1FB`  | 5.88 : 1  | ✅ AA                                                                                |
| `#2755CD` on `#DDE6FF`  | 5.15 : 1  | ✅ AA                                                                                |
| `#2755CD` on `#F6C9E8`  | 4.42 : 1  | ⚠️ AA only for large or bold text (≥ 24px, or ≥ 18.66px bold)                        |
| `#4C4C4C` on `#FFFFFF`  | 8.59 : 1  | ✅ AAA                                                                               |
| `#FFFFFF` on `#2755CD`  | 6.43 : 1  | ✅ AA                                                                                |
| `#000000` on `#F6C9E8`  | 14.44 : 1 | ✅ AAA                                                                               |
| `#858585` on `#FFFFFF`  | 3.69 : 1  | ❌ Fails for body text. Use only for ≥ 18.66px bold, or switch to `#4C4C4C`          |
| `#FE6D69` on `#FFFFFF`  | 2.76 : 1  | ❌ Fails. Use as an icon or badge **background** with black text, not as text colour |
| `#FF76D4` on `#FFFFFF`  | 2.39 : 1  | ❌ Use for borders and fills only, never text                                        |

### 4.6 Spacing & layout tokens

See §3.3 (spacing) and §3.2 (`Screen = 1280`).

### 4.7 Complete token file (CSS)

```css
/* tokens/colors.css: generated from Figma "Collection 1" */
:root {
	/* Text */
	--color-text-primary: #2755cd;
	--color-text-secondary: #4c4c4c;
	--color-text-black: #000000;
	--color-text-white: #ffffff;
	--color-text-inverse: #ffffff;
	--color-text-info: #fe6d69;
	--color-text-info-2: #858585;

	/* Backgrounds */
	--color-bg-white: #ffffff;
	--color-bg-primary: #fff1fb;

	/* UI surfaces */
	--color-ui-primary: #f6c9e8;
	--color-ui-secondary: #dde6ff;
	--color-ui-white: #ffffff;
	--color-ui-disable: #d9d9d9;
	--color-ui-modal: #ffffff;

	/* States */
	--color-hover-primary: #ffb1ed;
	--color-hover-secondary: #7fa0f4;
	--color-active-primary: #2755cd;
	--color-active-secondary: #ff76d4;

	/* Borders */
	--color-border-primary: #2755cd;
	--color-border-secondary: #ff76d4;

	/* Links */
	--color-link: #000000;
	--color-link-hover: #2755cd;

	/* Discrimination causes */
	--color-cause-race: #ff8080; /* เชื้อชาติ */
	--color-cause-gender: #f6c9e8; /* เพศ */
	--color-cause-age: #93ffdd; /* อายุ */
	--color-cause-religion: #fafd56; /* ความเชื่อทางศาสนา */
	--color-cause-health: #edd165; /* สภาพทางกายหรือสุขภาพ */
	--color-cause-personal-status: #cbe79a; /* สถานะของบุคคล */
	--color-cause-social-status: #bbcefe; /* สถานะทางสังคม */
	--color-cause-origin: #ffb703; /* เผ่าพันธุ์แห่งชาติหรือสังคม */
}
```

### 4.8 Complete Tailwind config

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}'],
	theme: {
		screens: {
			sm: '412px',
			md: '744px',
			lg: '1024px',
			xl: '1280px' // Figma: Screen
		},
		spacing: {
			0: '0',
			xxs: '2px',
			xs: '4px',
			s: '8px',
			m: '16px',
			l: '32px',
			xl: '64px',
			xxl: '128px',
			xxxl: '256px'
		},
		extend: {
			colors: {
				text: {
					primary: '#2755CD',
					secondary: '#4C4C4C',
					black: '#000000',
					white: '#FFFFFF',
					inverse: '#FFFFFF',
					info: '#FE6D69',
					'info-2': '#858585'
				},
				bg: {
					white: '#FFFFFF',
					primary: '#FFF1FB'
				},
				ui: {
					primary: '#F6C9E8',
					secondary: '#DDE6FF',
					white: '#FFFFFF',
					disable: '#D9D9D9',
					modal: '#FFFFFF'
				},
				hover: {
					primary: '#FFB1ED',
					secondary: '#7FA0F4'
				},
				active: {
					primary: '#2755CD',
					secondary: '#FF76D4'
				},
				border: {
					primary: '#2755CD',
					secondary: '#FF76D4'
				},
				link: {
					DEFAULT: '#000000',
					hover: '#2755CD'
				},
				cause: {
					race: '#FF8080',
					gender: '#F6C9E8',
					age: '#93FFDD',
					religion: '#FAFD56',
					health: '#EDD165',
					'personal-status': '#CBE79A',
					'social-status': '#BBCEFE',
					origin: '#FFB703'
				}
			},
			fontFamily: {
				header: ['"Kondolar Thai"', '"Noto Sans Thai"', 'sans-serif'],
				body: [
					'"IBM Plex Sans Thai Looped"',
					'"Noto Sans Thai Looped"',
					'"Noto Sans Thai"',
					'sans-serif'
				]
			},
			fontSize: {
				h3: ['3.75rem', '1.2'],
				h6: ['2rem', '1.4'],
				'h6-m': ['1.5rem', '1.4'],
				h7: ['1.75rem', '1.4'],
				b4: ['1.125rem', '1.4'],
				b5: ['1rem', '1.4'],
				b6: ['0.875rem', '1.4'],
				b7: ['0.75rem', '1.4']
			},
			maxWidth: {
				screen: '1280px',
				prose: '640px'
			}
		}
	}
};
```

> **Naming note:** In Tailwind, `text-text-primary` reads awkwardly. If you prefer, flatten the keys (`primary`, `secondary`, …) and rely on the utility prefix instead (`text-primary`, `bg-ui-primary`, `border-primary`).

---

## 5. Open questions for design

These gaps were found while extracting tokens. Resolving them will make the system complete.

1. **Type scale gaps:** Only H3, H6, H7, and B4–B7 exist. Confirm H1, H2, H4, H5, and B1–B3, and the mobile sizes for H3, H7, and B4.
2. **No radius or shadow tokens:** Add `radius/*` and `elevation/*` variables. Corner radii in the design are currently hard-coded.
3. **Grid not defined:** No layout grid styles exist in the file. Confirm the column, margin, and gutter values proposed in §3.2.
4. **Contrast failures:** `text-info` (#FE6D69) and `text-info-2` (#858585) fail AA as body text (§4.5). Darker variants are needed.
5. **Duplicate tokens:** `text-White`, `text-inverse`, `ui-white`, `ui-modal`, and `background-white` all resolve to `#FFFFFF`. Keep them only if they're planned for dark mode or theming; otherwise consolidate them.
6. **Variable collection name:** `Collection 1` should be renamed (for example `Tokens`), and variables could be split into `Primitives` and `Semantic` collections.
7. **Purple hero exploration:** A purple, semi-realistic illustrated landing page sits inside the ❖ Components section. Confirm whether it's a reference or a future direction, because it doesn't match the current pink and blue token set.
