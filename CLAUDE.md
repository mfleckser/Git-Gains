# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npx expo start          # Start dev server (scan QR with Expo Go or dev client)
npx expo run:ios        # Build and run on iOS simulator
npx expo run:ios --device  # Build and deploy to physical iPhone (USB)
npx expo lint           # Run ESLint
supabase db push        # Apply pending migrations to Supabase
supabase migration new <name>  # Create a new migration file
```

## Architecture

### Stack
- **Expo Router v6** — file-based routing. Tab screens live in `app/(tabs)/`, modal screens at the root `app/` level.
- **Supabase** — PostgreSQL backend with Row Level Security. Client singleton in `lib/supabase.ts`. All data access goes through `lib/api.ts`.
- **WorkoutContext** (`lib/WorkoutContext.tsx`) — global state for the in-progress workout. Uses `useReducer`. Side effects (async saves) happen in provider callbacks, not in the reducer.

### Data Flow
All screens load data with `useEffect` + `useState` (or `useFocusEffect` when data should refresh on tab re-focus). There is no global cache — each screen fetches what it needs.

Exercise names are not stored on workout rows — only `exerciseId` is stored. Screens that need to display names fetch all exercises with `getExercises()` and build a `Map<string, Exercise>` for O(1) lookup.

### Database Schema (Supabase)
- `exercises` — global catalog (`user_id = NULL`) + user-created customs (`user_id = <uid>`)
- `workout_templates` → `template_exercises` — user's saved workout templates
- `workouts` → `workout_exercises` → `workout_sets` — completed workout history

`saveWorkout` uses a Postgres RPC (`save_workout`) for atomic insert of the full workout tree. All other reads use PostgREST nested selects (e.g. `workout_exercises(*, workout_sets(*))`).

RLS policies use `auth.uid()`. The app auto-signs in on startup (`app/_layout.tsx`) using credentials from `.env`.

### Navigation Structure
```
app/_layout.tsx          ← Root Stack; handles auth init; wraps everything in WorkoutProvider
  (tabs)/
    index.tsx            ← Home: workout history + heatmap
    templates/           ← Template CRUD (nested Stack)
  select-template.tsx    ← Modal: pick template or start empty
  workout/
    active.tsx           ← Active workout screen
    exercise/[exerciseId].tsx  ← Per-exercise set logging
    summary.tsx          ← Post-workout summary
  [workoutId].tsx        ← Past workout detail
```

### Key Conventions
- Navigate home with `router.dismissAll()`, never `router.replace("/")`.
- All DB rows use snake_case; `lib/api.ts` maps them to camelCase TypeScript types from `lib/types.ts`.
- `Exercise.userId` being `undefined` means it's a global exercise; being set means user-created.
- Migration files must have unique timestamps — use `supabase migration new` to generate them, never create filenames manually.

### Environment Variables (`.env`)
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_KEY=   # publishable/anon key
EXPO_PUBLIC_USER_EMAIL=
EXPO_PUBLIC_USER_PASSWORD=
```
