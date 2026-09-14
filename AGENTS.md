# AGENTS.md — Portfolio 3D Upgrade

## Project

This is Numan Maldar's personal portfolio, built on Next.js + TypeScript, currently a standard 2D site featuring **Manifest (Freight Rate Ledger)** as the lead project (Next.js/TS frontend, FastAPI/SQLAlchemy/SQLite backend, deployed on Vercel). The task: add a **full 3D scene** as the centerpiece of the homepage — not decorative flourishes, an actual navigable/interactive 3D experience.

Read the existing repo structure before changing anything. Do not assume file paths — inspect `package.json`, `app/` or `pages/`, and existing component structure first.

## Stack for the 3D layer

- **react-three-fiber (R3F)** — React renderer for Three.js. Use this, not raw Three.js imperative code, so the scene stays composable with the rest of the Next.js app.
- **@react-three/drei** — helpers (OrbitControls, Environment, Text3D, useGLTF, Html, ScrollControls, etc.). Reach for drei before hand-rolling anything it already solves.
- **@react-three/postprocessing** — only if the design plan calls for bloom/depth-of-field/etc. Don't add by default; it costs performance.
- **framer-motion** or **@react-spring/three** for any UI chrome that needs to sync with 3D state (camera moves, section transitions).
- Client components only: any file importing `@react-three/fiber` needs `'use client'` at the top (App Router). The `<Canvas>` should never render server-side.

## Before writing code: design plan first

Do not start scaffolding the scene until there's an explicit plan covering:

1. **What the 3D scene actually represents.** Ground it in the subject — this is a logistics/freight-data portfolio, so generic "floating shapes" or a stock low-poly planet is the wrong default. Consider: a shipping-lane/cargo-route visualization, a 3D ledger/manifest object, crates or containers as project markers, a globe with route arcs connecting to project nodes. Pick one concrete concept and state it.
2. **Navigation model.** Is the camera fixed with orbit controls, does it move along a path as the user scrolls (`ScrollControls` from drei), or is it click-to-navigate between "stops" (each stop = a project)? Full 3D scenes live or die on this decision — pick one, don't blend three.
3. **Signature moment.** One deliberate, ownable visual beat (a load-in sequence, a camera move revealing Manifest, a hover interaction on project nodes) — not scattered effects on every element.
4. **Fallback for low-end devices / reduced motion.** A full 3D scene must degrade gracefully — detect `prefers-reduced-motion` and WebGL support; provide a static/2D fallback rather than a blank canvas or crash.

Follow the studio-grade design process: brainstorm a compact token system (palette as 4-6 named hex values, type pairing, layout concept) and self-critique it against generic AI-portfolio defaults (cream+serif+terracotta, black+neon-accent, broadsheet-with-hairlines) before implementing. If the 3D concept could belong to any developer's portfolio, it's not specific enough yet.

## Performance requirements (non-negotiable for a 3D portfolio)

- Target 60fps on mid-range laptops, degrade to 30fps floor on mobile — never below.
- Lazy-load the `<Canvas>` — don't block first paint on Three.js initializing. Show the text/hero content immediately, mount the scene after.
- Keep draw calls low: instance repeated geometry (`InstancedMesh`), avoid unnecessarily high-poly models, compress any GLTF assets (`gltf-transform` / Draco).
- Dispose of geometries/materials/textures on unmount — R3F handles most of this automatically via its reconciler, but verify no leaks on route changes in a Next.js SPA context.
- Run Lighthouse / check bundle size after adding Three.js — it's a heavy dependency; confirm it's code-split and not in the main bundle for non-3D pages.

## Accessibility

- The 3D canvas must not be the only way to reach content or navigate to projects — every interactive 3D element (project node, nav point) needs a real DOM/keyboard-accessible equivalent (drei's `<Html>` or a parallel nav menu).
- Respect `prefers-reduced-motion`: disable auto-rotating camera, ambient animation, and parallax when set.
- Maintain visible keyboard focus states on any HTML overlay controls.

## Conventions

- TypeScript strict mode — type all R3F component props explicitly, don't leave scene objects as `any`.
- Keep 3D components in a dedicated `components/scene/` directory, separate from page/layout components.
- Name components by what they represent in the scene (`CargoRouteGlobe`, `ManifestCrateNode`), not by implementation (`Scene1`, `ThreeCanvas`).
- Commit GLTF/GLB assets under `public/models/` with a short README noting source/license if not authored from scratch.

## Commands

Adjust once repo is inspected — placeholders:
- `npm run dev` — local dev server
- `npm run build` — production build (verify this succeeds with the 3D deps before considering the task done)
- `npm run lint` — must pass with TypeScript strict rules

## Definition of done

- 3D scene loads without blocking the hero content or causing layout shift.
- Every project (Manifest featured prominently) is reachable both via the 3D scene and a plain accessible fallback.
- Reduced-motion and low-end-device fallback verified, not assumed.
- `npm run build` succeeds; no console errors/warnings from Three.js or R3F.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
