# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on port 3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test runner is configured.

## Architecture

**Fairepart** is a French-language event management platform (weddings, birthdays, etc.) built with Next.js 14 App Router. It is currently a fully client-side frontend with mock data — no backend or real auth exists yet.

### Key conventions

- All pages use `'use client'` — this is intentional; the app has no server components yet.
- All data comes from [lib/mockData.ts](lib/mockData.ts). There are no API calls. The TypeScript types in [lib/types/index.ts](lib/types/index.ts) are the contract for a future backend.
- State is local to each page via `useState`/`useMemo`. No global state library (no Redux, no Zustand, no Context).
- Auth is simulated: login/register forms redirect to `/dashboard` on submit without real session handling.
- All UI strings are in French.

### Route structure

| Route | Purpose |
|---|---|
| `/` | Marketing landing page |
| `/auth/login`, `/auth/register` | Auth forms (client-side only) |
| `/dashboard` | Organizer dashboard with RSVP charts |
| `/dashboard/guests` | Guest list with filtering |
| `/dashboard/invitations` | Invitation management |
| `/dashboard/seating` | Drag-and-drop table planner (`@dnd-kit`) |
| `/dashboard/messaging` | Messages and polls |
| `/dashboard/photos` | Photo gallery with approval |
| `/dashboard/gifts` | Gift lists and savings goals (kitties) |
| `/dashboard/settings` | Event settings |
| `/invite/[token]` | Public guest-facing RSVP view |

### Component layers

- **[components/ui/](components/ui/)** — design system primitives: `Button`, `Input`, `Card`, `Modal`, `Badge`, `Avatar`, `Tabs`, `Toggle`, `Dropdown`, `ProgressBar`, `EmptyState`, `Skeleton`
- **[components/layout/](components/layout/)** — `Navbar` (landing), `Sidebar` (dashboard, collapsible), `DashboardTopbar`, `MobileNav`, `Footer`
- **[components/landing/](components/landing/)** — landing page sections
- **[components/dashboard/](components/dashboard/)**, **[components/gifts/](components/gifts/)**, **[components/seating/](components/seating/)**, etc. — feature-specific components

### Utilities

- **[lib/utils/cn.ts](lib/utils/cn.ts)** — `clsx` + `tailwind-merge` for conditional class names; use this everywhere instead of string concatenation.
- **[lib/hooks/useLocalStorage.ts](lib/hooks/useLocalStorage.ts)** — persistent client state
- **[lib/hooks/useGuests.ts](lib/hooks/useGuests.ts)** — guest filtering logic

### Styling

Tailwind utility classes throughout. Custom theme in [tailwind.config.ts](tailwind.config.ts):
- **Colors:** `rose-*` (primary, #C9748F range) and `champagne-*` (#D4AF7A range), `ivory`
- **Fonts:** `font-playfair`, `font-inter`, `font-cormorant` (Google Fonts loaded in root layout)
- **Animations:** `float`, `fade-in`, `slide-up`, `shimmer`, `check-draw`

### Core domain types

Defined in [lib/types/index.ts](lib/types/index.ts):
- `RSVPStatus` — `'accepted' | 'pending' | 'declined'`
- `EventStep` — `'ceremonie' | 'mairie' | 'reception' | 'soiree' | 'religieux'`
- `Guest`, `Event`, `SeatingTable`, `Message`, `Photo`, `GiftItem`, `KittyGoal`, `Notification`

### External image sources

[next.config.js](next.config.js) allows images from Unsplash, UI Avatars, and RandomUser — used by mock data only.
Priority: Visual quality > ordinary SaaS design.

When redesigning landing pages:
- Aim for Awwwards-quality experiences.
- Prefer cinematic layouts.
- Use layered depth.
- Use premium typography.
- Use sophisticated motion.
- Avoid generic startup hero sections.
- Create memorable visual moments.
- Optimize for conversion and aesthetics equally.