# Campus Ambassador Program 2027 — Website

Frontend for the Campus Ambassador Program website, built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

## Getting started

You need **Node.js 20+** (run `node -v` to check; if you use nvm, run `nvm use`).

```bash
git clone <repo-url>
cd <repo-folder>
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The page reloads automatically when you save a file.

## Scripts

| Command             | What it does                                           |
| ------------------- | ------------------------------------------------------ |
| `npm run dev`       | Start the dev server                                   |
| `npm run build`     | Production build (run this before opening a PR)        |
| `npm run lint`      | Check code for problems                                |
| `npm run lint:fix`  | Auto-fix lint problems where possible                  |
| `npm run format`    | Format all files with Prettier                         |
| `npm run typecheck` | Check TypeScript types                                 |
| `npm run check`     | Lint + typecheck + format check (CI-style, all-in-one) |

## Project structure

```
src/
  app/                  # Routes. Each folder with a page.tsx is a URL.
    layout.tsx          # Shared shell: fonts, navbar, footer, metadata
    page.tsx            # Home page  →  /  (composes the section views)
    about/ faq/ apply/  # Standalone routes (still placeholders)
    globals.css         # Tailwind import + color/font tokens + marquee keyframes
  models/               # M — TypeScript types for each piece of content
  data/                 # M — the content itself (static for now)
  controllers/          # C — how views get data (getFaqs(), ...) and UI logic hooks (useAccordion)
  components/           # V — everything that renders
    layout/             # Navbar, Footer — used once in layout.tsx
    sections/           # One folder per page section: testimonials/, faq/, about/
    icons/              # Inline SVG icons
    ui/                 # Small reusable pieces: Button, Container, SectionHeading
  lib/
    site.ts             # Site name, nav links, contact email
    utils.ts            # Small helpers (e.g. cn() for class names)
public/
  images/               # Static images, served from /images/...
```

### MVC flow

`data/` + `models/` → `controllers/content.ts` → section component → `app/page.tsx`.
Components never import from `data/` directly; they call a controller function. When content
moves to a CMS or API, only the controller changes.

**Adding a new page:** create `src/app/<name>/page.tsx`, then add it to `links` in `src/data/navigation.ts` if it should appear in the navbar.

## Design tokens

Colours, radius, section spacing and the easing curve are defined once at the top of
`src/app/globals.css` and exposed as Tailwind classes:

| Use                    | Classes                                                       |
| ---------------------- | ------------------------------------------------------------- |
| Surfaces               | `bg-background`, `bg-surface`, `bg-raised`                    |
| Text                   | `text-foreground`, `text-secondary`, `text-muted`             |
| Accent (use sparingly) | `text-accent`, `bg-accent-fill`, `hover:bg-accent-fill-hover` |
| Hairlines              | `border-line`, `border-line-strong`                           |
| Cards / sections       | `rounded-card`, `py-section`                                  |
| Copy                   | `text-body`, `text-body-lg`, `measure` (max ~62ch)            |

Every section heading uses `<SectionHeading heading={...} />`; its text lives in the
section's file in `src/data/`. Hidden "before animation" states must be written with the
`js:` variant (e.g. `js:opacity-0`) so the page is fully visible without JavaScript.

## Motion

- **Smooth scrolling:** Lenis, driven by GSAP's ticker so ScrollTrigger stays in sync
  (`src/components/motion/SmoothScroll.tsx`). Same-page `/#section` links glide there.
- **Scroll effects:** GSAP + ScrollTrigger through the `useGSAP` hook (cleans up on unmount).
  Import `gsap`, `ScrollTrigger`, `useGSAP` and `motionEnabled` from `@/lib/motion`.
- **Rules:** animate only `transform`, `opacity` and `clip-path`; reveals play once; at most
  one reveal pattern per section; the easing is always `"out"` (same as `--ease-out`).
- **Starting states** (e.g. hidden before a fade) go in the "Reveal starting states" block in
  `globals.css`, scoped under `.js` and `prefers-reduced-motion: no-preference`, and every
  animation checks `motionEnabled()` first. That keeps the page fully visible without JS
  and static for visitors who prefer reduced motion.
- **Hero constellation:** the hero is the plain illustration at rest; when the mouse moves
  over it, the stars in the picture light up around the cursor and link into a constellation.
  Tune it in `src/components/sections/hero/constellation/config.ts`.

## Adding the E-Summit video

The "What is E-Summit?" video starts buffering shortly before it scrolls into view, plays muted once it's on screen, and pauses when it scrolls away. Visitors can unmute, pause and seek with the control bar.

1. Export the video and save it as **`public/videos/what-is-esummit.mp4`** (that exact name).
2. That's it — the path is already set in `src/data/whatIs.ts`. The poster is `public/images/what-is/video-poster.jpg` (16:9).

For smooth playback, keep the file small (ideally under ~10 MB) and put the metadata at the start of the file so it can begin playing before it has fully downloaded. With [ffmpeg](https://ffmpeg.org/):

```bash
# MP4 (plays everywhere) — 1080p, good quality, fast start
ffmpeg -i input.mov -vf "scale=1920:-2" -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart public/videos/what-is-esummit.mp4

# Optional smaller WebM — then add it FIRST in `sources` in src/data/whatIs.ts:
# { src: "/videos/what-is-esummit.webm", type: "video/webm" }
ffmpeg -i input.mov -vf "scale=1920:-2" -c:v libvpx-vp9 -crf 32 -b:v 0 -c:a libopus public/videos/what-is-esummit.webm
```

To use a different file name or a new poster image, change `video.sources` / `video.poster` in `src/data/whatIs.ts`.

## Conventions

- **Components:** one component per file, `PascalCase.tsx`, named exports (`export function Card()`). Pages are the only default exports.
- **Imports:** use the `@/` alias (`import { Button } from "@/components/ui/Button"`) instead of `../../..`.
- **Styling:** Tailwind classes only. Use theme colors (`bg-background`, `text-foreground`) instead of hardcoded hex values. Add new colors as tokens in `globals.css`.
- **Text & links:** site-wide text lives in `src/lib/site.ts`, so it isn't scattered across components.
- **Server vs client:** components are Server Components by default. Add `"use client"` at the top of a file **only** when it needs state, effects, or event handlers (`useState`, `onClick`, ...). Keep those components small.
- **Images:** use `next/image` (`<Image />`), not `<img>`, and always set `alt`.
- **Secrets:** never commit `.env.local`. Only `NEXT_PUBLIC_*` variables reach the browser.

## Git workflow

1. Pull the latest `main`: `git checkout main && git pull`
2. Create a branch: `git checkout -b feat/faq-page` (prefixes: `feat/`, `fix/`, `chore/`)
3. Commit small, focused changes with clear messages: `feat: add FAQ accordion`
4. Before pushing, run `npm run check && npm run build`
5. Push and open a Pull Request against `main`, with a screenshot for any UI change
6. Get at least one review before merging. Never push directly to `main`.

## Editor setup (VS Code)

Install the recommended extensions when VS Code prompts you (Prettier, ESLint, Tailwind CSS IntelliSense). Files are formatted automatically on save.

## Learn more

- [Next.js docs](https://nextjs.org/docs) — start with the App Router section
- [Tailwind CSS docs](https://tailwindcss.com/docs)
- [React docs](https://react.dev/learn)
