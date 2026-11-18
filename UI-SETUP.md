# UI components and styles

This existing Vite app now supports TypeScript, Tailwind CSS v4, and shadcn's
component structure. Existing JavaScript components continue to work; new `.ts`
and `.tsx` files are checked by `npm run typecheck` and `npm run build`.

- Shared UI: `src/components/ui/` (`@/components/ui`).
- App-specific components: `src/components/`.
- Utilities: `src/lib/utils.ts` (`@/lib/utils`).
- Tailwind entry and orange theme tokens: `src/styles/globals.css`.
- Existing resume/editor styles: `src/index.css`, imported in the components layer.
- Aliases: `tsconfig.json` and `vite.config.js`; shadcn settings: `components.json`.

The `/components/ui` convention lives inside `src` because `@/` resolves to `src`.
Keeping reusable primitives here lets the shadcn CLI and copied components resolve
the same imports without mixing them with resume-specific business logic.

## Setup already applied

```sh
npm install @radix-ui/react-slot @radix-ui/react-dialog class-variance-authority clsx tailwind-merge
npm install -D typescript @types/react @types/react-dom tailwindcss @tailwindcss/vite
npm run typecheck
npm run build
```

Tailwind's Vite plugin is enabled. Its theme and utilities are imported separately;
Preflight is omitted to retain the existing document typography, lists, and print
layout. The existing CSS reset stays in use. New shared buttons set their border
style explicitly. Orange UI tokens are distinct from the legacy `--brand-accent`
tokens used throughout the editor.

For a fresh project, the shadcn CLI can scaffold Vite with `npx shadcn@latest init -t vite`.
For an existing project, first configure Tailwind and the `@/` alias, then run
`npx shadcn@latest init`. This repository is already configured; do not initialize
it again or replace its resume stylesheet. Add future components with, for example:

```sh
npx shadcn@latest add separator
```

See the [official shadcn Vite setup](https://ui.shadcn.com/docs/installation/vite)
and [Tailwind Vite setup](https://tailwindcss.com/docs/installation/using-vite).

## Header integration

`src/components/ui/header-2.tsx` adapts the supplied header with configurable
branding, links, and actions. It retains the supplied SVG wordmark for standalone
use; `AppHeader.jsx` supplies elCVate branding and the actual resume actions.
`demo.tsx` is an optional standalone example, not a replacement for the editor.

The `use-scroll.ts` hook accepts the resume scroll container, and falls back to
window scrolling in the demo. `menu-toggle-icon.tsx` supplies the missing animated
icon. The mobile menu uses Radix Dialog for focus management, Escape, focus return,
and restoring scroll state; selecting an action closes the menu first. The menu
also closes when resizing to desktop. The header is excluded from print output.

The old default document accent `#153b6b` is migrated to `#9a3412` when loading
saved resumes; other custom colors and all resume content are preserved.
