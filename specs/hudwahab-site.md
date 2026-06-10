=== PROJECT SPECIFICATION ===
Project: hudwahab-site v1
Date: 2026-06-09
Status: Draft — review before execution

---

```markdown
# hudwahab-site — Build Specification v1

**Date:** 2026-06-09
**Status:** Ready for execution — overwrite specs/hudwahab-site.md

---

## 1. OVERVIEW

hudwahab-site is a single-page personal portfolio and services site for Hud Wahab, AI engineer
and founder of Multimode AI LLC. It is built on Next.js 14 App Router with Tailwind CSS,
deployed to Vercel. The site does three jobs in sequence: establishes Hud as a credible solo AI
builder (Hero + Skills + Work), sells scoped consulting services via Stripe-linked CTAs
(Services), and funnels readers to the Substack newsletter (Substack + Footer). The visual model
is https://www.mohammadhameed.dev/ using exact extracted design tokens. The current state of the
repo is: Tailwind config complete, fonts loaded in layout.tsx, components/ directory empty,
page.tsx is the default Next.js scaffold. This spec covers the full ground-up build of all 8
components and the rewrite of page.tsx.

---

## 2. ACCEPTANCE CRITERIA

Each criterion is verifiable by an independent observer without asking the project owner.

### Build

- AC-01: `npm run build` completes with exit code 0 — zero TypeScript errors, zero ESLint errors.
- AC-02: `npm run lint` completes with exit code 0.
- AC-03: No `<img>` elements exist anywhere in the codebase — only `next/image` or CSS backgrounds.
- AC-04: No `"use client"` directive appears in any component file.
- AC-05: No dark mode classes (`dark:`) appear anywhere in the codebase.

### page.tsx

- AC-06: `app/page.tsx` contains exactly these 9 imports and nothing else:
  `SiteNav, HeroSection, SkillsSection, CredibilitySection, ServicesSection, WorkSection,
  SubstackSection, ContactSection, SiteFooter` — rendered in that order inside a single
  `<main>` element.
- AC-07: `app/page.tsx` contains no reference to Geist font, Next.js logo, Vercel logo,
  or any default scaffold content.

### SiteNav (components/SiteNav.tsx)

- AC-08: Nav is `position: sticky` at `top: 0` with a white background.
- AC-09: Logo text is "hud." rendered in `font-script` (Dancing Script), colored `#ff5f00`.
- AC-10: Nav contains exactly 4 links: "Home" → `href="#"`, "Work" → `href="#work"`,
  "Services" → `href="#services"`, "Contact" → `href="#contact"`.
- AC-11: "Home" link has text color `#ff5f00` (accent) as a static style — no JavaScript,
  no scroll-spy.
- AC-12: Pill CTA label is "Let's Chat" with an inline chat bubble SVG icon,
  `href="#contact"`, styled `bg-n-900 text-white rounded-full`.
- AC-13: No `"use client"` directive in SiteNav.tsx.

### HeroSection (components/HeroSection.tsx)

- AC-14: A small uppercase muted label "INTRODUCTION" appears above "Hello," — styled
  `text-xs font-semibold tracking-widest text-n-400 uppercase`.
- AC-15: "Hello," renders in `text-accent` (#ff5f00).
- AC-16: Name/title line renders verbatim: "My name is Hud Wahab. I'm an ML engineer
  building AI at the intersection of defense systems and autonomous AI — and I help
  businesses ship AI that actually works through Multimode AI LLC."
- AC-17: Body paragraph renders verbatim: "10+ years from materials science research labs
  to active federal AI contracts. I have 20+ peer-reviewed publications (200+ citations), defense work with
  DOD, DTRA, and SpaceWERX, and I've built production ML systems that run in the real world.
  Multimode AI is my consulting practice for founders and operators who want the same."
- AC-18: Location line renders: "CO"
- AC-19: GitHub icon (SVG) links to `https://github.com/hududed`, `target="_blank"`,
  `rel="noopener noreferrer"`.
- AC-20: LinkedIn icon (SVG) links to `https://linkedin.com/in/hudwahab`, `target="_blank"`,
  `rel="noopener noreferrer"`.
- AC-21: Photo placeholder is a grey rect: `w-full max-w-xs aspect-[3/4] rounded-2xl bg-n-200`.
  No text, no `<img>`, no `<Image>` — pure CSS div.
- AC-22: Layout is `flex flex-col md:flex-row` — stacked on mobile, two-column on ≥ md.

### SkillsSection (components/SkillsSection.tsx)

- AC-23: Section renders exactly 4 cards in a `grid grid-cols-1 md:grid-cols-2` layout.
- AC-24: Each card has: uppercase muted "SKILL" label → SVG icon (~28px) → title → body text.
  In that exact vertical order.
- AC-25: Card styles: `bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow`.
- AC-26: Card 1 — icon: bot/circuit SVG, title: "AI Agent Engineering",
  body: "Building production-grade autonomous agents: RAG pipelines, tool use, memory systems,
  multi-agent coordination. Deployed for real business operations, not demos."
- AC-27: Card 2 — icon: beaker/flask SVG, title: "Research & Applied ML",
  body: "10+ years from academic research to production: Bayesian optimization, NLP, experiment
  design. Federally funded work (DOD, ONR, NIST, NASA)."
- AC-28: Card 3 — icon: layers/server SVG, title: "Systems Architecture",
  body: "End-to-end design — private data pipelines, API integrations, cloud and edge deployment.
  Built for accountability and operator control."
- AC-29: Card 4 — icon: compass SVG, title: "Strategic AI Advisory",
  body: "Roadmapping AI adoption for founders and operators. Cutting through hype to identify
  what actually moves the needle in your specific context."
- AC-30: SVG icons are inline (not `<Image>`), 28×28px, `stroke-current`, no fill,
  `stroke-width="1.5"` — consistent across all 4.

### CredibilitySection (components/CredibilitySection.tsx)

- AC-31: Section renders exactly 3 stat callout items in a horizontal row (`flex flex-row`),
  wrapping to single column on mobile.
- AC-32: Each item has: a large bold number/label, and a short descriptor below it.
- AC-33: Item 1 — stat: "20+", label: "peer-reviewed publications" — Carbon, Physical Review B, Ceramics International, IJCAI.
- AC-34: Item 2 — stat: "DOD · DTRA · SpaceWERX", label: "active federal AI contracts".
- AC-35: Item 3 — stat: "10+", label: "years from research lab to production".
- AC-36: Items are separated by a vertical divider (`border-r border-n-200`) except the last.
- AC-37: No card wrapper — this section is open/flat, no `bg-white` container.
- AC-38: Stat text uses `text-3xl font-bold text-n-900`; label uses `text-sm text-n-500`.

### ServicesSection (components/ServicesSection.tsx)

- AC-39: Section has `id="services"`.
- AC-40: Section contains exactly 3 cards using the card-in-card CTA pattern.
- AC-41: Outer card: `bg-white rounded-3xl shadow-card`. Inner CTA card:
  `border border-n-200 rounded-2xl`. Inner card layout: CTA label text at top,
  large `↗` arrow SVG (20×20, stroke-based) alone at bottom — NOT inline with the label text.
- AC-42: Card 1 — outer label: "AI AGENT SPRINT" (uppercase, `text-n-400 text-xs tracking-widest`),
  description: "You have a workflow that needs to run itself. I scope, build, and deploy a custom
  agent in two weeks.", inner CTA label: "Get started", arrow SVG, `href="#"`.
- AC-43: Card 2 — outer label: "STRATEGY SESSION", description: "90 minutes. I audit your AI
  setup and hand you a prioritized roadmap you can act on immediately.",
  inner CTA label: "Book a session", arrow SVG, `href="#"`.
- AC-44: Card 3 — outer label: "RETAINER", description: "Ongoing AI engineering and strategy,
  monthly. I'm on your team — shipping, reviewing, staying ahead.",
  inner CTA label: "Apply", arrow SVG, `href="#"`.

### WorkSection (components/WorkSection.tsx)

- AC-45: Section has `id="work"`.
- AC-46: Section renders exactly 4 work items — no more, no fewer.
- AC-47: Item 1 — title: "ProWasl", description: "Agentic ops platform for SMBs —
  WhatsApp agents, bookings, halal-vendor verification, and run-level auditing for
  trustworthy AI-mediated transactions.", `href="#"`.
- AC-48: Item 2 — title: "Bayanlab", description: "Community data backbone for Muslim events,
  halal businesses, and halal eateries — aggregating 6+ sources into a canonical,
  deduplicated API. Starting in CO, expanding nationwide.", `href="#"`.
- AC-49: Item 3 — title: "Autolabmate", description: "Bayesian optimization engine for
  automated experiment design. Built from published research — 108 citations in Carbon (2020).",
  `href="#"`.
- AC-50: Item 4 — title: "mm-cli", description: "Provider-agnostic CLI harness and prompt kit
  platform for AI builders — runs on Claude, GPT, or local Ollama. Distributed via Substack.",
  `href="https://multimodeai.substack.com"`,
  `target="_blank"`, `rel="noopener noreferrer"`.
- AC-51: Each item visually indicates it is a link (arrow or external indicator).

### SubstackSection (components/SubstackSection.tsx)

- AC-52: Single card using card-in-card CTA pattern (same structure as ServicesSection cards).
- AC-53: Outer label: "NEWSLETTER" (uppercase muted).
- AC-54: Description: "Prompt kits and field notes from a builder shipping with AI. No fluff."
- AC-55: Inner CTA label: "Subscribe", arrow SVG, `href="https://multimodeai.substack.com"`,
  `target="_blank"`, `rel="noopener noreferrer"`.

### ContactSection (components/ContactSection.tsx)

- AC-56: Section has `id="contact"`.
- AC-57: Single card using card-in-card CTA pattern.
- AC-58: Outer label: "WORK TOGETHER?" (uppercase muted).
- AC-59: Description: "If you're building something worth building, reach out directly."
- AC-60: Inner CTA label: "Get in touch", arrow SVG, `href="mailto:hudwahab@gmail.com"`.
- AC-61: No form element, no server action, no input fields — mailto only.

### SiteFooter (components/SiteFooter.tsx)

- AC-62: Logo text "hud." in `font-script`, centered, matching nav logo style.
- AC-63: Two columns rendered side by side: column 1 label "PAGES" with links Home (`href="#"`),
  Work (`href="#work"`), Services (`href="#services"`), Contact (`href="#contact"`);
  column 2 label "LINKS" with GitHub icon → `https://github.com/hududed`,
  LinkedIn icon → `https://linkedin.com/in/hudwahab`,
  text link "Substack" → `https://multimodeai.substack.com`.
  All external links have `target="_blank" rel="noopener noreferrer"`.
- AC-64: Copyright line renders: "© 2026 Hud Wahab. All rights reserved."

### Layout & Shared Container

- AC-65: Every section uses a shared container class pattern:
  `max-w-5xl mx-auto px-6` for width-capping and horizontal padding.
- AC-66: Every section (Hero, Skills, Credibility, Services, Work, Substack, Contact) has
  vertical padding of `py-16` minimum.
- AC-67: `globals.css` contains `html { scroll-behavior: smooth }` and
  `body { background-color: #fafafa; color: #171717; }` — unchanged from current state.
- AC-68: No horizontal scroll occurs at viewport width 375px or wider.

---

## 3. CONSTRAINT ARCHITECTURE

### Must Do

- Implement all 9 components as pure server components (no `"use client"` anywhere).
- Use only Tailwind utility classes for all styling — no inline `style={{}}` objects,
  no CSS modules, no styled-components.
- Use the exact custom Tailwind tokens defined in `tailwind.config.ts`:
  `accent`, `n-50` through `n-900`, `shadow-card`, `shadow-card-hover`,
  `font-sans`, `font-script`.
- Use inline SVGs (not `next/image`, not external icon libraries) for all icons.
- All SVG icons: 28×28 for skill cards, 20×20 for arrow CTAs, `stroke-current`,
  `fill="none"`, `strokeWidth={1.5}`.
- Rewrite `app/page.tsx` completely — strip all default scaffold content.
- Place anchor `id` attributes on the section wrapper element of WorkSection (`id="work"`),
  ServicesSection (`id="services"`), ContactSection (`id="contact"`).
- Every external link must have `target="_blank" rel="noopener noreferrer"`.
- `npm run build` must pass with zero errors before the task is considered done.

### Must Not Do

- Do not introduce dark mode — no `dark:` Tailwind variants anywhere.
- Do not add `"use client"` to any component.
- Do not use `<img>` — use `next/image` `<Image>` for real images;
  for the photo placeholder, use a plain `<div>` with Tailwind classes only.
- Do not add any CSS framework, icon library (Heroicons, Lucide, FontAwesome),
  or UI component library (shadcn, Radix, etc.).
- Do not add a second `layout.tsx` inside any subdirectory.
- Do not add authentication, database, CMS, server actions, or API routes.
- Do not add scroll-spy, `IntersectionObserver`, or any JavaScript-driven active state.
- Do not modify `tailwind.config.ts`, `app/layout.tsx`, `app/globals.css`,
  or `next.config.mjs` — these are correct as-is.
- Do not add any dependency to `package.json` — all required packages are already installed.
- Do not commit `.env.local`.

### Prefer

- Prefer `flex` layouts over `grid` when rendering a single row or column.
- Prefer `grid grid-cols-1 md:grid-cols-2` for 2-column responsive layouts.
- Prefer `group` + `group-hover:` for card hover states rather than JavaScript.
- When multiple valid Tailwind spacing values exist, prefer the one closest
  to the reference site's visual weight (generous padding, not tight).
- Prefer semantic HTML: `<nav>`, `<main>`, `<section>`, `<footer>`, `<ul>/<li>` for lists.

### Escalate

- Stop and surface to the user if `npm run build` fails due to a TypeScript error
  that requires changing the type signature of an existing file
  (layout.tsx, tailwind.config.ts) rather than the new components.
- Stop and surface if any acceptance criterion requires contradictory implementations
  (e.g., two ACs that cannot both be true simultaneously).

---

## 4. TASK DECOMPOSITION

### Task 0 — Rewrite app/page.tsx

- **Input:** Current `app/page.tsx` (default Next.js scaffold at app/page.tsx)
- **Output:** `app/page.tsx` containing exactly the 8-component composition specified in AC-06
- **Acceptance criteria:** AC-06, AC-07
- **Dependencies:** None — do this first so the import map is established.
  Build will fail until all 9 components exist, but the file can be written now.
- **Estimated scope:** 5 minutes

---

### Task 1 — components/SiteNav.tsx

- **Input:** Design tokens from `tailwind.config.ts`; anchor targets `#`, `#work`,
  `#services`, `#contact`; logo text "hud."; CTA "Let's Chat" → `#contact`
- **Output:** `components/SiteNav.tsx` — sticky nav with logo, 4 links, pill CTA
- **Acceptance criteria:** AC-08 through AC-13
- **Implementation notes:**
  - Outer wrapper: `<nav className="sticky top-0 z-50 bg-white border-b border-n-200">`
  - Inner container: `<div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">`
  - Logo: `<span className="font-script text-2xl text-accent">hud.</span>`
  - Link list: `<ul className="hidden md:flex items-center gap-8">` — links in `text-n-600`,
    Home in `text-accent`
  - Pill CTA: `<a className="flex items-center gap-2 bg-n-900 text-white text-sm font-medium
    rounded-full px-5 py-2.5 hover:opacity-90 transition-opacity">`
  - Chat bubble SVG: 16×16, stroke-current, simple speech bubble path
- **Dependencies:** Task 0 (import exists in page.tsx)
- **Estimated scope:** 20 minutes

---

### Task 2 — components/HeroSection.tsx

- **Input:** All copy from AC-14 through AC-22; photo placeholder spec; social link URLs
- **Output:** `components/HeroSection.tsx`
- **Acceptance criteria:** AC-14 through AC-22
- **Implementation notes:**
  - Section wrapper: `<section className="py-20">`
  - Inner container: `<div className="max-w-5xl mx-auto px-6">`
  - Two-column: `<div className="flex flex-col md:flex-row items-center gap-12">`
  - Left col (text): grows to fill — `flex-1`
  - "INTRODUCTION" label: `<p className="text-xs font-semibold tracking-widest text-n-400
    uppercase mb-4">INTRODUCTION</p>`
  - "Hello,": `<h1 className="text-5xl font-bold text-accent mb-2">Hello,</h1>`
  - Name line: `<h2 className="text-2xl font-bold text-n-900 mb-6">`
  - Body: `<p className="text-n-600 leading-relaxed mb-4">`
  - Location: `<p className="text-n-500 text-sm mb-6">Ottawa, Canada</p>`
  - Social icons row: `<div className="flex items-center gap-4">`
  - GitHub SVG: 22×22, standard GitHub mark path, stroke-based
  - LinkedIn SVG: 22×22, standard LinkedIn mark path, stroke-based
  - Right col: `<div className="w-full max-w-xs aspect-[3/4] rounded-2xl bg-n-200 flex-shrink-0">`
- **Dependencies:** Task 0
- **Estimated scope:** 25 minutes

---

### Task 3 — components/SkillsSection.tsx

- **Input:** 4 skill card specs from AC-26 through AC-29; icon descriptions from AC-30
- **Output:** `components/SkillsSection.tsx`
- **Acceptance criteria:** AC-23 through AC-30
- **Implementation notes:**
  - Section wrapper: `<section className="py-16">`
  - Inner container: `<div className="max-w-5xl mx-auto px-6">`
  - Grid: `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">`
  - Card: `<div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover
    transition-shadow p-8">`
  - Inside card (top to bottom):
    1. `<p className="text-xs font-semibold tracking-widest text-n-400 uppercase mb-4">SKILL</p>`
    2. SVG icon 28×28, `className="text-n-900 mb-4"`, inline
    3. `<h3 className="text-lg font-bold text-n-900 mb-2">`
    4. `<p className="text-n-600 text-sm leading-relaxed">`
  - Bot/circuit SVG: rectangular grid with connecting nodes (circuit board aesthetic)
  - Beaker/flask SVG: flask outline with liquid line
  - Layers/server SVG: three stacked horizontal rectangles
  - Compass SVG: circle with N/S/E/W needle marks
- **Dependencies:** Task 0
- **Estimated scope:** 30 minutes

---

### Task 4 — components/ServicesSection.tsx

- **Input:** 3 service card specs from AC-34 through AC-36; card-in-card pattern from AC-33
- **Output:** `components/ServicesSection.tsx`
- **Acceptance criteria:** AC-31 through AC-36
- **Implementation notes:**
  - Section wrapper: `<section id="services" className="py-16">`
  - Inner container: `<div className="max-w-5xl mx-auto px-6">`
  - Cards stack vertically: `<div className="flex flex-col gap-6">`
  - Outer card: `<div className="bg-white rounded-3xl shadow-card hover:shadow-card-hover
    transition-shadow p-8 flex flex-col md:flex-row items-start md:items-center
    justify-between gap-8">`
  - Left side (text): `<div className="flex-1">`
    1. Uppercase label: `<p className="text-xs font-semibold tracking-widest text-n-400
       uppercase mb-3">`
    2. Description: `<p className="text-xl font-semibold text-n-900 max-w-md">`
  - Inner CTA card (right side): `<a className="border border-n-200 rounded-2xl p-6 flex
    flex-col justify-between min-w-[180px] min-h-[120px] hover:border-n-400
    transition-colors group">`
    - Top: `<span className="text-sm font-semibold text-n-900">[CTA label]</span>`
    - Bottom: `↗` arrow SVG 20×20, `className="self-end text-n-900
      group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"`
  - Arrow SVG path: northeast arrow — `M4 16 L16 4 M8 4 H16 V12`
- **Dependencies:** Task 0
- **Estimated scope:** 30 minutes

---

### Task 5 — components/WorkSection.tsx

- **Input:** 4 work items from AC-39 through AC-42
- **Output:** `components/WorkSection.tsx`
- **Acceptance criteria:** AC-37 through AC-43
- **Implementation notes:**
  - Section wrapper: `<section id="work" className="py-16">`
  - Inner container: `<div className="max-w-5xl mx-auto px-6">`
  - Section heading: `<h2 className="text-2xl font-bold text-n-900 mb-8">Selected Work</h2>`
    [ASSUMPTION: section heading label is "Selected Work" — not explicitly stated by user]
  - Items list: `<ul className="flex flex-col divide-y divide-n-200">`
  - Each item: `<li><a className="flex items-start justify-between py-6 group
    hover:opacity-70 transition-opacity" href="...">`
    - Left: title `<h3 className="font-semibold text-n-900">` + description
      `<p className="text-n-600 text-sm mt-1 max-w-lg">`
    - Right: `↗` arrow SVG 20×20, `text-n-400 group-hover:text-n-900 transition-colors`
  - mm-cli is the only external link (`target="_blank" rel="noopener noreferrer"`)
- **Dependencies:** Task 0
- **Estimated scope:** 20 minutes

---

### Task 6 — components/SubstackSection.tsx

- **Input:** Copy from AC-45 through AC-47; card-in-card pattern (same as Task 4)
- **Output:** `components/SubstackSection.tsx`
- **Acceptance criteria:** AC-44 through AC-47
- **Implementation notes:**
  - Reuse the exact same card-in-card markup structure from ServicesSection (Task 4).
  - Single card, not a list — no wrapper div needed beyond the section container.
  - Section wrapper: `<section className="py-16">`
  - `target="_blank" rel="noopener noreferrer"` on the CTA link.
- **Dependencies:** Task 4 (copy the card-in-card pattern, don't reinvent it)
- **Estimated scope:** 10 minutes

---

### Task 7 — components/ContactSection.tsx

- **Input:** Copy from AC-50 through AC-52; card-in-card pattern; `id="contact"`
- **Output:** `components/ContactSection.tsx`
- **Acceptance criteria:** AC-48 through AC-53
- **Implementation notes:**
  - Reuse card-in-card pattern from Task 4.
  - Section wrapper: `<section id="contact" className="py-16">`
  - CTA href is `mailto:hudwahab@gmail.com` — no `target="_blank"` needed on mailto.
  - Outer label: "WORK TOGETHER?" — note the question mark is part of the label string.
- **Dependencies:** Task 4
- **Estimated scope:** 10 minutes

---

### Task 8 — components/SiteFooter.tsx

- **Input:** Footer spec from AC-54 through AC-56; icon URLs
- **Output:** `components/SiteFooter.tsx`
- **Acceptance criteria:** AC-54 through AC-56
- **Implementation notes:**
  - Wrapper: `<footer className="border-t border-n-200 py-12">`
  - Container: `<div className="max-w-5xl mx-auto px-6">`
  - Logo: centered `font-script text-2xl text-n-900` — matches nav but neutral color
    [ASSUMPTION: footer logo uses `text-n-900` not `text-accent` — footer is quieter than nav]
  - Two-column layout: `<div className="flex justify-center gap-24 mt-8 mb-8">`
  - Column header: `<p className="text-xs font-semibold tracking-widest text-n-400 uppercase mb-4">`
  - Page links: plain `<a>` in `text-n-600 hover:text-n-900 text-sm`
  - Link icons (GitHub, LinkedIn): inline SVG 18×18, same stroke style, beside text
  - Copyright: `<p className="text-center text-n-400 text-xs mt-8">`
- **Dependencies:** Task 0
- **Estimated scope:** 20 minutes

---

### Task 9 — Verification pass

- **Input:** Completed codebase with all 9 components
- **Output:** Confirmation that `npm run build` exits 0 and all ACs pass
- **Acceptance criteria:** AC-01, AC-02, and a manual check of AC-03 through AC-60
- **Process:**
  1. Run `npm run build` — fix any TypeScript errors in new component files only.
  2. Scan for `<img>` tags: `grep -r "<img" components/ app/` — must return empty.
  3. Scan for `"use client"`: `grep -r "use client" components/` — must return empty.
  4. Scan for `dark:` classes: `grep -r "dark:" components/ app/` — must return empty.
  5. Verify all 3 anchor IDs exist: `grep -r 'id="work"' components/`
     `grep -r 'id="services"' components/` `grep -r 'id="contact"' components/`
- **Dependencies:** Tasks 0–8 all complete
- **Estimated scope:** 15 minutes

---

## 5. EVALUATION CRITERIA

1. **Build integrity:** `npm run build` passes with zero errors — binary pass/fail.
2. **Copy fidelity:** All text strings in AC-16, AC-17, AC-18, AC-34 through AC-36,
   AC-46, AC-51 are verbatim matches — character-level, including em-dashes and punctuation.
3. **Token compliance:** Every color, shadow, and font reference uses the Tailwind custom token
   name (e.g., `text-accent`, `shadow-card`, `font-script`) — not raw hex values in class strings.
4. **Link correctness:** All 9 external URLs (GitHub ×2, LinkedIn ×2, Substack ×3, mailto ×1,
   mm-cli Substack) are present and correctly attributed to the right components.
5. **Anchor completeness:** `id="work"`, `id="services"`, `id="contact"` are present and
   on section-level wrapper elements.
6. **Server component purity:** Zero `"use client"` directives in any component file.
7. **No forbidden elements:** Zero `<img>` tags, zero `dark:` variants, zero external
   CSS/icon library imports.
8. **Structural consistency:** All sections use `max-w-5xl mx-auto px-6` container and
   minimum `py-16` vertical padding.
9. **Card-in-card pattern consistency:** ServicesSection, SubstackSection, and ContactSection
   all use the same outer/inner card structure — visually consistent when rendered.
10. **Mobile layout:** At 375px viewport, no section overflows horizontally; all
    two-column layouts stack to single column.

---

## 6. FAILURE PATTERN ANALYSIS

### Context Degradation — APPLIES
**Where:** This build has 9 sequential tasks across 8 files. By Task 6–8, the agent may
have drifted from the exact copy strings specified in earlier group answers, silently
substituting paraphrased text.
**Mitigation:** AC-16, AC-17, AC-34–36, AC-46, AC-51 are verbatim string requirements.
The verification pass (Task 9) includes a manual grep/review of rendered text. Copy strings
are quoted exactly in this spec — the agent must copy-paste, not paraphrase.

### Specification Drift — APPLIES
**Where:** The card-in-card CTA pattern is defined once and reused in 3 components
(Tasks 4, 6, 7). An agent working across a long session may implement it slightly
differently each time — e.g., putting the arrow inline with the CTA label instead of
alone at the bottom.
**Mitigation:** Task 6 and Task 7 explicitly reference Task 4 as the pattern source
("reuse the exact same card-in-card markup structure from ServicesSection"). The inner
card structure is specified in AC-33 with explicit layout language: "CTA label text at top,
large ↗ arrow SVG alone at bottom — NOT inline with the label text."

### Sycophantic Confirmation — APPLIES
**Where:** The build constraint says "do not modify tailwind.config.ts." If a TypeScript
error surfaces during the build (e.g., a type incompatibility), an agent prone to this
pattern might modify the config to make the error go away rather than fixing the component.
**Mitigation:** Escalate constraint is explicit: stop and surface to the user if the build
error requires modifying layout.tsx, tailwind.config.ts, or globals.css. Fix errors in the
new component files only.

### Tool Selection Errors — DOES NOT APPLY
This build uses no overlapping tools. The only file operations are writes to components/
and a rewrite of page.tsx. No ambiguity between tools.

### Cascade Failure — APPLIES
**Where:** Task 0 (page.tsx rewrite) establishes all 8 import paths. If any component
filename is spelled incorrectly (e.g., `SiteNavigation.tsx` instead of `SiteNav.tsx`),
the build will fail at the end — but only at Task 9. The error won't surface until
all components are written.
**Mitigation:** The exact filenames are specified in the Component Inventory table.
Task 0 should be written first, and the agent should verify filenames match the import
paths in page.tsx before proceeding to Task 1. Filename canonical list:
`SiteNav.tsx`, `HeroSection.tsx`, `SkillsSection.tsx`, `CredibilitySection.tsx`,
`ServicesSection.tsx`, `WorkSection.tsx`, `SubstackSection.tsx`, `ContactSection.tsx`,
`SiteFooter.tsx`.

### Silent Failure — APPLIES
**Where:** Two specific cases: (1) anchor IDs are easy to omit — the page renders
correctly and nav links just don't scroll anywhere; (2) the photo placeholder `<div>`
might be given zero height if `aspect-[3/4]` isn't applied correctly with a width
constraint — it renders as an invisible element.
**Mitigation:** AC-21 specifies the complete class string for the photo placeholder.
AC-55 and the anchor ID grep commands in Task 9 catch missing IDs. The verification
pass explicitly checks for all 3 anchor IDs.

---

## 7. CONTEXT & REFERENCE

### Codebase state at time of spec
- `app/layout.tsx` — complete and correct. Loads Plus Jakarta Sans as `--font-jakarta`,
  Dancing Script as `--font-dancing`. Sets metadata. Do not modify.
- `app/globals.css` — complete. Sets `scroll-behavior: smooth`, body `#fafafa`.
  Do not modify.
- `tailwind.config.ts` — complete. Custom tokens `accent`, `n-50`–`n-900`,
  `shadow-card`, `shadow-card-hover`, `font-sans`, `font-script` all defined. Do not modify.
- `app/page.tsx` — default Next.js scaffold. Full rewrite required (Task 0).
- `components/` — empty directory. All 8 files must be created from scratch.
- `specs/` — empty directory. This spec file is saved here.

### Design reference
Visual model: https://www.mohammadhameed.dev/ — a Webflow personal site.
Key structural observations from fetched content:
- "INTRODUCTION" label sits above "Hello," in the hero
- Skill cards have SKILL label → icon → title → body (top-to-bottom)
- Service cards use card-in-card: description left, CTA card right with label top + arrow bottom
- "Work together?" uses the same card-in-card for the contact section
- Nav: script logo left, links center, pill CTA right

### Installed packages (relevant)
`next@14.2.33`, `react@18`, `typescript@5`, `tailwindcss@3.4.1`.
`gray-matter`, `react-markdown`, `remark-gfm`, `jose` are installed but not used in v1.

### What v1 explicitly defers
- Real Stripe links (all service CTAs use `href="#"`)
- Real headshot photo (grey placeholder div)
- Scroll-spy nav active states
- Mobile nav menu/hamburger
- Contact form
- Analytics beyond Vercel built-in
- Canonical domain decision (multimodeai.com vs hudwahab.com)

---

## 8. DEFINITION OF DONE

The project is done when:

1. All 9 component files exist in `components/` with the exact filenames specified.
2. `app/page.tsx` has been fully rewritten to the 9-component composition.
3. `npm run build` exits with code 0.
4. `npm run lint` exits with code 0.
5. All 68 acceptance criteria are verifiable as true.
6. No `<img>` tags, no `"use client"` directives, no `dark:` variants exist
   anywhere in `components/` or `app/page.tsx`.
7. All 3 nav anchor IDs (`work`, `services`, `contact`) are present in the codebase.
8. All external links have `target="_blank" rel="noopener noreferrer"`.

There is no partial done state. The site either builds and satisfies all 60 ACs, or it is not done.
```

---

**SPECIFICATION QUALITY CHECK:**

Two areas are thin due to items not explicitly confirmed:

1. **SkillsSection body copy** — The four card descriptions in AC-26 through AC-29 were drafted by me based on the CLAUDE.md descriptions and Hud's background. The user provided card titles and icon types but did not dictate exact body copy. These are flagged `[ASSUMPTION]` implicitly — *confirm or replace the body text for all four skill cards before execution.*

2. **WorkSection heading label** — AC-37 / Task 5 notes `[ASSUMPTION: section heading label is "Selected Work"]`. The user provided item content but never specified whether the section has a heading or what it says. Confirm: is there a `<h2>` heading on the Work section, and if so, what does it say?

3. **Mobile nav behavior** — The spec says nav links `hidden md:flex`. This means on mobile, only the pill CTA is visible. The user said no hamburger menu for v1, but this was inferred from "no scroll-spy, no useEffect" rather than an explicit call. Confirm: is a mobile nav with links hidden acceptable for v1, or should the links be visible in a stacked row?

---

**DECOMPOSITION NOTE:**

All tasks are under 30 minutes. No further decomposition needed. The longest is Task 3 (SkillsSection, ~30 min) due to 4 custom inline SVGs. If the agent struggles with SVG path construction, Task 3 can be split: 3a writes the card structure with placeholder SVG rects, 3b replaces placeholders with real icon paths.

---

**TO USE THIS SPEC:**

1. Start a **fresh Claude Code session** — do not continue from this interview session.
2. Save this spec to `specs/hudwahab-site.md` in the project root (overwriting the draft).
3. Open the session in the `hudwahab-site` project directory.
4. Paste this prompt:

```text
Read specs/hudwahab-site.md in full. Then execute the tasks in order: Task 0 through Task 9.
After each task, verify its acceptance criteria before moving to the next task.
Do not ask clarifying questions — all decisions are in the spec.
After Task 9, report which acceptance criteria passed and flag any that did not.
```

5. After execution, run `npm run build` yourself to confirm the exit code, and spot-check 5–10 acceptance criteria from Section 2 against the rendered output at `localhost:3000`.
