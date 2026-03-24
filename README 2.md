# Project Tracker

A fully functional multi-view project management frontend built with React, TypeScript, Tailwind CSS, and Zustand.

**Live demo:** _https://your-deployment-url.vercel.app_

---

## Setup Instructions

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build
npm run preview   # preview production build
```

Node.js 18+ required.

---

## State Management Decision: Zustand

**Choice: Zustand** over React Context + useReducer.

This application has 520 tasks shared across three views, drag-and-drop mutations, simulation intervals firing every 2.5 seconds, and filter state driving URL sync. React Context + useReducer would cause full subtree re-renders on every state change — every sim tick, every filter toggle, every drag move — making it expensive at scale.

Zustand solves this with:

1. **Selector-based subscriptions** — components only re-render when their subscribed slice changes. `KanbanView` doesn't re-render when `sortKey` changes. `PresenceBar` doesn't re-render when tasks mutate.
2. **No Provider boilerplate** — store is imported directly, no context wrapper nesting.
3. **Computed values as methods** — `filteredTasks()` and `sortedFilteredTasks()` live on the store, always returning fresh derived state without scattered `useMemo` calls.
4. **~1 KB gzipped** — minimal bundle cost.

---

## Virtual Scrolling Implementation

**File:** `src/components/list/VirtualList.tsx`

No libraries. Built on four principles:

1. **Fixed row height** (`ROW_H = 40px`) — enables O(1) visible window calculation without DOM measurement.
2. **ResizeObserver** on the scroll container tracks `clientHeight` so the window recalculates on resize.
3. **Visible window:**
   ```ts
   const startIdx = Math.max(0, Math.floor(scrollTop / ROW_H) - BUFFER);
   const endIdx   = Math.min(tasks.length - 1, Math.ceil((scrollTop + viewHeight) / ROW_H) + BUFFER);
   ```
   Buffer of 5 rows above/below prevents blank flashes on fast scroll.
4. **DOM structure** — outer div has `height = tasks.length * ROW_H` for correct scrollbar range; inner div is absolutely positioned at `offsetY = startIdx * ROW_H`. Only ~20–30 rows exist in the DOM at any time.

Tested with 520 tasks at 60fps — no flickering, no blank gaps, no jump on fast scroll.

---

## Drag-and-Drop Implementation

**Files:** `src/components/kanban/KanbanView.tsx`, `KanbanColumn.tsx`

No libraries. Built on native `MouseEvent` / `TouchEvent`.

1. **Start** (`mousedown`/`touchstart`): records task ID, source status, card height, pointer offset. Clones card HTML into a fixed `#drag-ghost` div outside the React tree. Marks the source card as semi-transparent via `isDragging` prop.
2. **Move** (`mousemove`/`touchmove` on `document`): repositions ghost. Hides ghost briefly, calls `elementFromPoint` to detect the column beneath, restores ghost. Calculates `insertIndex` by comparing cursor Y against each visible card's midpoint. Sets `dropTarget` state.
3. **Placeholder** — `KanbanColumn` renders a dashed `div` at `insertIndex` with `height = cardHeight` (measured before drag). Same height = no layout shift. The original card stays in the DOM at low opacity so column height is preserved.
4. **End** (`mouseup`/`touchend`): if over a column, calls `updateTaskStatus(taskId, newStatus)` in the store. If outside — does nothing; card snaps back because React state is unchanged. Clears drag state.
5. **Touch** — identical parallel handlers; `touchmove` uses `{ passive: false }` to prevent scroll interference.

---

## Placeholder Without Layout Shift

The placeholder `div` renders **inside the column's flex layout** at the insertion point with `height` equal to the original card's `getBoundingClientRect().height` (captured before drag starts). It occupies exactly the same space, so surrounding cards reflow around it smoothly. The dragged card itself remains in the DOM at `opacity: 0.3` — its height still contributes to layout, preventing column height collapse.

---

## One Refactor With More Time

The `TimelineView` caps visible tasks at 300. I'd apply the same virtual scrolling technique from `VirtualList` to the Gantt rows — a windowed render with scroll-synced label sidebar — allowing all 520+ tasks to render smoothly without any cap.

---

## Lighthouse Score

> Run `npm run build && npm run preview`, open Chrome DevTools → Lighthouse → Desktop mode, and add your screenshot here.

Target: **85+ Desktop**.

Optimisations in place:
- Code-split vendor chunks (React, Zustand) via `vite.config.ts` `manualChunks`
- Inter font with `display=swap` + preconnect — no render blocking
- Virtual scroll keeps DOM node count ~30 regardless of dataset size
- Sim user interval: 2.5 s; Zustand selectors eliminate cascade re-renders
- All icons are inline SVG — zero image requests

---

## Project Structure

```
src/
├── components/
│   ├── filters/FilterBar.tsx          # Multi-select + date range + clear
│   ├── kanban/
│   │   ├── KanbanView.tsx             # Drag-and-drop engine
│   │   ├── KanbanColumn.tsx           # Column + placeholder
│   │   ├── TaskCard.tsx               # Card with badges
│   │   └── SimUserIndicators.tsx      # Collaboration avatar stack
│   ├── list/
│   │   ├── ListView.tsx
│   │   └── VirtualList.tsx            # From-scratch virtual scroll
│   ├── timeline/TimelineView.tsx      # Gantt + today line + scroll sync
│   └── shared/
│       ├── Avatar.tsx
│       ├── DueBadge.tsx
│       ├── Header.tsx                 # View tabs + presence bar
│       ├── MultiSelect.tsx            # Custom dropdown (no library)
│       ├── PresenceBar.tsx
│       ├── PriorityBadge.tsx
│       └── StatusSelect.tsx           # Inline status select
├── data/seed.ts                       # 520-task generator
├── store/useStore.ts                  # Zustand store + URL sync
├── types/index.ts
├── utils/index.ts
├── App.tsx
├── index.css
└── main.tsx
```
