# Quran Khatm — Frontend (Phase 1 + Real Quran Data)

A React + Vite + Tailwind frontend for a collaborative Quran Khatm app.
Requires an internet connection — Quran text is fetched live (no backend yet;
that's Phase 2+).

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. Best viewed at mobile width (~390px) — resize your
browser or use device toolbar in devtools.

## Quran data

All Surah lists, Arabic text, and English translations are fetched live from the
free, keyless **AlQuran Cloud API** (`https://api.alquran.cloud`):

- Surah list: `/v1/surah`
- A Surah's Arabic + translation: `/v1/surah/{n}/editions/quran-uthmani,en.sahih`
- A Juz/Para's Arabic + translation, grouped by Surah: `/v1/juz/{n}/editions/quran-uthmani,en.sahih`

See `src/services/quranApi.js`. Every Para now shows its own real verses — Para 30
is no longer the same text as Para 1. Screens show a loading spinner while
fetching and a retry state if the request fails.

## What's included

- Splash, onboarding, and auth screens (Welcome, Sign Up, Log In, Forgot Password)
- Home dashboard — redesigned hero "Continue Your Journey" card, Quick Access
  grid, Active Khatm card, Your Para card, Recent Activity preview
- My Khatms (Active / Completed tabs) + Create Khatm flow
- Khatm Details, Para List (claim flow with confirm sheet), Members, Activity
- Invite Members + Join Khatm (via `/join/:inviteCode`)
- Khatm Progress grid, Khatm Completion, and Dua screens
- Assigned Para reading screen — **real Quran text for the actual Para**, grouped
  by the Surahs it spans, with a working "Mark as Completed" flow that updates
  Khatm progress live
- Quran browsing — real 114-Surah list with search, Juz/Para grid, and a Juz
  detail screen listing the real Surahs contained in that Para
- Surah reading screen — real Arabic + translation, Quran/Translation tabs,
  font size control, Prev/Next across all 114 Surahs
- Profile and Settings

## Stack

React 19, Vite, Tailwind CSS, React Router DOM, Lucide icons, Context API for
Khatm/Auth state (mocked — no persistence yet), AlQuran Cloud API for Quran
content.

## Still mocked (Phase 2/3 — not built yet)

- **Auth** — Login/Signup just log you in as one hardcoded user; no real
  accounts, JWT, or password handling
- **Persistence** — Khatms, claims, and completions live only in memory;
  refreshing the page resets them
- **Backend** — no Node/Express/MongoDB; invite links, members, and activity
  are still mock data
