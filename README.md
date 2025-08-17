# Books OS
A zoomable, bookshelf-native personal OS. Books → Chapters → Sections. Drag spines, rearrange between-drop zones, thick binder stacks, right-side drawer for chapters, localStorage persistence.

**Books OS** is a tactile, 3D bookshelf interface that replaces “files & folders” with **Sections → Books → Chapters**.  
Drag between spines, drop precisely between chapters, stack oversized binders, and glide through your life like a library.

## Quick start
```bash
npm create vite@latest books-os -- --template react-ts
cd books-os
# replace the generated files with the files in this scaffold
npm i
npm run dev
```

## Deploy
- **Vercel**: Import the repo, framework: Vite → Deploy.
- **GitHub Pages**: enable Pages on `Settings → Pages → GitHub Actions`, keep this workflow.

## Notes
- Add `public/wallpaper.jpg` for desktop feel.
- Swap localStorage for Supabase/Firebase when you want sync.

## Vision
- **Simplicity first:** your stuff looks and feels like a shelf.
- **Direct manipulation:** hover tilt, snap-to-spine, buttery drag, kinetic reorder.
- **Composable:** a “book” can be tasks, notes, designs, repos—whatever.
- **Open:** local-first, sync optional, plugins later.

## MVP Scope
- 3D shelf with hover tilt + drop slots between spines
- Create/rename Sections, Books, Chapters
- Drag & drop reorder across sections
- “Stack” layout for oversized items (binders)
- Keyboard nav + quick search (⌘K)

## Tech Stack (planned)
- React + TypeScript + Vite
- Tailwind + Framer Motion (physics-y micro-interactions)
- Zustand (state) + idb-keyval (local-first)
- dnd-kit (precision drop), radix-ui/shadcn for primitives

## Getting Started (after we push code)
```bash
pnpm i
pnpm dev
