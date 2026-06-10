# CLAUDE.md

Project instructions for Claude Code when working on hudwahab-site.

## Project Overview

hudwahab-site is the personal portfolio and services site for Hud Wahab, founder of Multimode AI LLC. It is a Next.js 14 App Router site deployed on Vercel. The site consolidates personal brand (proof of work, background, identity) with service packages (Stripe-linked) in a single destination — inspired closely by the visual design of https://www.mohammadhameed.dev/.

The site will eventually live at multimodeai.com (replacing the current site) OR hudwahab.com — TBD. The canonical domain decision is deferred until after the build is complete and reviewed.

## Design Reference

Source design: https://www.mohammadhameed.dev/ (Webflow — not replicable, but design tokens extracted)

Exact extracted design tokens:
- **Page background:** `#fafafa` (--neutral-50)
- **Card background:** `#ffffff`
- **Card shadow:** `0 1px 5px 3px rgba(0,0,0,0.05)` (Tailwind: `shadow-card`)
- **Card hover shadow:** `0 3px 15px 3px rgba(0,0,0,0.08)` (Tailwind: `shadow-card-hover`)
- **Border radius (cards):** `1rem` / `1.5rem` (Tailwind: `rounded-2xl` / `rounded-3xl`)
- **Border radius (pills):** `10rem` (Tailwind: `rounded-full`)
- **Accent (orange):** `#ff5f00` (--accent-1-500) — used for "Hello," heading and nav active state
- **Heading text:** `#171717` (--neutral-900)
- **Body text:** `#525252` (--neutral-600)
- **Secondary text:** `#737373` (--neutral-500)
- **Label/muted text:** `#a3a3a3` (--neutral-400)
- **Divider/border:** `#e5e5e5` (--neutral-200)
- **Body font:** Plus Jakarta Sans (Google Fonts, via `next/font/google`)
- **Brand/logo font:** **Wreath** Medium (500) — Adobe Fonts (Typekit). Loaded via `<link href="https://use.typekit.net/kia8fkx.css">` in `app/layout.tsx`; Tailwind `font-script` → `["wreath","cursive"]`. The reference uses "Kingsman" (demo, personal-use only) — Wreath is the licensed lookalike (covered by the active Creative Cloud subscription; keep CC active or the kit stops serving).

Reference screenshots saved at `/tmp/mohammadhameed_*.png` for visual comparison.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Fonts:** `next/font/google` — Plus Jakarta Sans + Dancing Script
- **Deployment:** Vercel (auto-deploys from `main` branch)
- **Node version:** managed by Vercel (LTS)

## Architecture

**Two pages** (mirrors mohammadhameed.dev: minimal Home + detailed About me):

```
app/
  layout.tsx         — root layout, fonts (Jakarta + Wreath/Typekit), metadata
  page.tsx           — HOME: Hero → Skills → MoreAboutMe pill → ServicesTeaser → Contact → Footer
  about-me/page.tsx  — ABOUT: Hero(river photo) → Background → Credibility → Work → Services(Stripe) → Contact → Footer
  globals.css        — Tailwind base, body: #fafafa

components/
  SiteNav.tsx        — sticky nav: Wreath logo | Home/About me (active prop) | "Let's Chat" pill
  HeroSection.tsx    — reusable; props: label/greeting/heading/meta/imageSrc/imageAlt/imagePosition
  SkillsSection.tsx  — 2×2 grid of white capability cards
  MoreAboutMe.tsx    — pill button → /about-me (home only)
  ServicesTeaser.tsx — single funnel card on home, CTA "See packages" → /about-me#services
  ServicesSection.tsx — 3 service cards w/ LIVE Stripe links (deposit-first); about-me only
  CredibilitySection.tsx — stats row: $3M+ grants · 20+ pubs · 10+ yrs
  WorkSection.tsx    — selected proof-of-work (ProWasl, Bayanlab, mm-cli — real links)
  BackgroundSection.tsx — "My Background" prose card (about-me)
  ContactSection.tsx — contact card
  FadeIn.tsx         — ONLY "use client" component; scroll fade-in (1.2s)
  SiteFooter.tsx     — Wreath name + PAGES (Home/About me/Contact) + LINKS (GitHub/LinkedIn/Substack icons)

specs/               — spec files for mm harness verify

public/token-burn/   — static Token Burn dashboard (vanilla HTML/JS), light-themed to match
                       the site; linked from Selected Work at /token-burn/index.html.
                       SNAPSHOT of local-log token usage — refresh with `npm run refresh:burn`
                       (source repo: ~/Developments/token-burn-dashboard). data.json is a
                       scrubbed aggregate; eyeball byProject for client names before pushing.
```

**Photos: served from Cloudinary** (cloud `nmcore`), NOT committed to git (`/public/*.{png,jpg,jpeg}` is gitignored). `next.config.mjs` allows `res.cloudinary.com/nmcore/**` in `images.remotePatterns`.
- home hero  = `https://res.cloudinary.com/nmcore/image/upload/hud_rerofh`
- about hero = `https://res.cloudinary.com/nmcore/image/upload/hud-river_qg866f`

Use Next `<Image>` (never `<img>`). To add a new photo: upload to Cloudinary (`nmcore`) and reference its delivery URL — don't commit image files.

## Key Visual Pattern: Card-in-Card CTA

The service/contact/substack sections use this pattern:
```
┌─────────────────────────────────────────────────────┐  ← outer white card (rounded-3xl, shadow-card)
│                                       ┌─────────────┐│
│ LABEL (uppercase, n-400)              │  CTA text   ││  ← inner outlined card (border n-200, rounded-2xl)
│ Big description text (n-900)          │  ↗ arrow    ││
│                                       └─────────────┘│
└─────────────────────────────────────────────────────┘
```
Arrow SVG: `↗` (northeast arrow, 20×20, stroke-based)

## Tailwind Custom Tokens

```ts
colors: {
  accent: "#ff5f00",
  "n-50": "#fafafa",   // page bg
  "n-100": "#f5f5f5",
  "n-200": "#e5e5e5",  // borders
  "n-400": "#a3a3a3",  // labels/muted
  "n-500": "#737373",  // secondary text
  "n-600": "#525252",  // body text
  "n-900": "#171717",  // headings
}
boxShadow: {
  card: "0 1px 5px 3px rgba(0,0,0,0.05)",
  "card-hover": "0 3px 15px 3px rgba(0,0,0,0.08)",
}
fontFamily: {
  sans: ["var(--font-jakarta)", "Plus Jakarta Sans", ...],
  script: ["wreath", "cursive"],   // Adobe Fonts (Typekit kit kia8fkx)
}
```

## Service Packages & Stripe (LIVE)

Three packages on `/about-me` (`ServicesSection.tsx`). **Deposit-first** model: only Strategy Session is full-price instant checkout; Sprint & Retainer take a refundable deposit, then scope on a call.

| Package | Shown price | Checkout | Live Payment Link |
|---|---|---|---|
| AI Agent Sprint | From $12,000 | $500 deposit (one-time) | `buy.stripe.com/...0Fi01` |
| Strategy Session | $750 | $750 (one-time) | `buy.stripe.com/...0Fi00` |
| Retainer | $6,000/mo | $500 deposit (one-time) | `buy.stripe.com/...0Fi02` |

- Links are **LIVE** (real charges) on the **Multimode AI LLC** Stripe account (`acct_1QkFegEJWLDOpBSG`, hudwahab@gmail.com, charges + payouts enabled). Hardcoded in the `STRIPE` const at the top of `components/ServicesSection.tsx`.
- Home page uses a single `ServicesTeaser` card (CTA "See packages" → `/about-me#services`) — a funnel, not checkout. Only `/about-me` has real Stripe buttons.
- **Stripe CLI:** `STRIPE_SECRET_KEY` (sk_live) lives in gitignored `.env`. To create/update links without the macOS keychain prompt: `set -a; . ./.env; set +a` then `stripe <cmd> --api-key "$STRIPE_SECRET_KEY"`. Add `--live` is NOT needed when passing an sk_live key directly. Test-mode equivalents exist (`buy.stripe.com/test_...`) for safe end-to-end testing.
- Customer email is always collected at checkout (name with card) — visible in Stripe Dashboard → Payments; contact buyers from there.

## Commands

```bash
npm run dev          # local dev server :3000
npm run build        # production build (must pass before deploy)
npm run lint         # ESLint check
npm run refresh:burn # rebuild Token Burn snapshot from local logs -> public/token-burn

# Spec tooling (run from project root)
mm spec new hudwahab-site     # 3-phase interview → specs/hudwahab-site.md
mm harness verify             # verify codebase against spec
```

## Git Commit Guidelines

- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`
- No AI attribution in commits
- One feature per commit where possible

## Things NOT to Do

- Do not introduce dark mode (the reference design is light only)
- Do not add authentication, database, or CMS for v1
- Do not use a CSS framework other than Tailwind
- Do not add a `layout.tsx` inside any route directory — one root layout only
- Do not use `<img>` — use Next.js `<Image>` or CSS background for photos
- Do not add an "Other prompt kits" nav or cross-kit catalog anywhere
- Do not commit `.env` or `.env.local` — `.env` holds the LIVE `STRIPE_SECRET_KEY` (already gitignored; keep it that way)
- Do not run `npm run build` while `npm run dev` is running — the prod build overwrites `.next` and corrupts the dev server (MODULE_NOT_FOUND). Stop dev first, or just rely on dev's hot reload.
