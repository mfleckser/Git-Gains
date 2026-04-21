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
- **AppDataContext** (`lib/AppDataContext.tsx`) — session-level cache for exercises, templates, and workouts. Loads all three in parallel on startup via `Promise.all`. Exposes `refreshExercises()`, `refreshTemplates()`, `refreshWorkouts()` for targeted re-fetches after mutations. All screens read from this context — no per-screen fetches.
- **WorkoutContext** (`lib/WorkoutContext.tsx`) — global state for the in-progress workout. Uses `useReducer`. Side effects (async saves) happen in provider callbacks, not in the reducer. Calls `refreshWorkouts()` after saving a finished workout.

### Data Flow
All data is loaded once at startup in `AppDataContext` and cached for the session. Screens read from `useAppData()` — no `useEffect` data fetches in screen components. After mutations (create/update/delete), screens call the relevant `refresh*()` method to update the cache.

Exercise names are not stored on workout rows — only `exerciseId` is stored. `AppDataContext` derives `exerciseMap: Map<string, Exercise>` alongside `exercises` for O(1) lookup everywhere.

### Provider Nesting
```
AppDataProvider       ← session cache; fetches all data on mount
  AppReadyGate        ← shows spinner until loading = false
    WorkoutProvider   ← in-progress workout state
      Stack           ← Expo Router navigation
```

### Database Schema (Supabase)
- `exercises` — global catalog (`user_id = NULL`) + user-created customs (`user_id = <uid>`)
- `workout_templates` → `template_exercises` — user's saved workout templates
- `workouts` → `workout_exercises` → `workout_sets` — completed workout history

`saveWorkout` uses a Postgres RPC (`save_workout`) for atomic insert of the full workout tree. All other reads use PostgREST nested selects (e.g. `workout_exercises(*, workout_sets(*))`).

RLS policies use `auth.uid()`. The app auto-signs in on startup (`app/_layout.tsx`) using credentials from `.env`.

### Navigation Structure
```
app/_layout.tsx          ← Root Stack; handles auth init; wraps in AppDataProvider → AppReadyGate → WorkoutProvider
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

### Git Workflow
- Run `git add . && git commit` with a descriptive message whenever a feature is completed and the user confirms they're happy with it.
- No GitHub remote yet — do not push. This note will be updated when a remote is added.

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
