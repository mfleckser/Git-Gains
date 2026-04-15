import type { Exercise, Workout, WorkoutExercise, WorkoutTemplate } from "./types";

export const EXERCISES: Exercise[] = [
  { id: "e1", name: "Barbell bench press", muscleGroup: "Chest" },
  { id: "e2", name: "Pull-ups", muscleGroup: "Back" },
  { id: "e3", name: "Dumbbell shoulder press", muscleGroup: "Shoulders" },
  { id: "e4", name: "Barbell row", muscleGroup: "Back" },
  { id: "e5", name: "Dumbbell curl", muscleGroup: "Biceps" },
  { id: "e6", name: "Overhead cable tricep extension", muscleGroup: "Triceps" },
  { id: "e7", name: "Back squat", muscleGroup: "Legs" },
  { id: "e8", name: "Romanian deadlift", muscleGroup: "Legs" },
  { id: "e9", name: "Leg press", muscleGroup: "Legs" },
  { id: "e10", name: "Leg curl", muscleGroup: "Legs" },
  { id: "e11", name: "Calf raise", muscleGroup: "Legs" },
  { id: "e12", name: "Incline dumbbell press", muscleGroup: "Chest" },
  { id: "e13", name: "Lat pulldown", muscleGroup: "Back" },
  { id: "e14", name: "Lateral raise", muscleGroup: "Shoulders" },
  { id: "e15", name: "Single-arm dumbbell row", muscleGroup: "Back" },
  { id: "e16", name: "Tricep pushdown", muscleGroup: "Triceps" },
  { id: "e17", name: "Hack squat", muscleGroup: "Legs" },
  { id: "e18", name: "Dumbbell Bulgarian split squat", muscleGroup: "Legs" },
  { id: "e19", name: "Leg extension", muscleGroup: "Legs" },
  { id: "e20", name: "Dips", muscleGroup: "Chest" },
];

export const TEMPLATES: WorkoutTemplate[] = [
  {
    id: "t1",
    name: "Push Day",
    notes: "Chest, shoulders, and triceps",
    exercises: [
      { exerciseId: "e1", order: 0, targetSets: 4, targetReps: 8 },
      { exerciseId: "e2", order: 1, targetSets: 3, targetReps: 10 },
      { exerciseId: "e13", order: 2, targetSets: 3, targetReps: 10 },
      { exerciseId: "e14", order: 3, targetSets: 3, targetReps: 15 },
      { exerciseId: "e18", order: 4, targetSets: 3, targetReps: 12 },
    ],
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "t2",
    name: "Pull Day",
    notes: "Back and biceps",
    exercises: [
      { exerciseId: "e5", order: 0, targetSets: 4, targetReps: 8 },
      { exerciseId: "e4", order: 1, targetSets: 4, targetReps: 8 },
      { exerciseId: "e6", order: 2, targetSets: 3, targetReps: 10 },
      { exerciseId: "e7", order: 3, targetSets: 3, targetReps: 12 },
      { exerciseId: "e16", order: 4, targetSets: 3, targetReps: 12 },
    ],
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "t3",
    name: "Leg Day",
    notes: "Quads, hamstrings, glutes",
    exercises: [
      { exerciseId: "e8", order: 0, targetSets: 4, targetReps: 6 },
      { exerciseId: "e9", order: 1, targetSets: 3, targetReps: 10 },
      { exerciseId: "e10", order: 2, targetSets: 3, targetReps: 12 },
      { exerciseId: "e12", order: 3, targetSets: 3, targetReps: 12 },
      { exerciseId: "e11", order: 4, targetSets: 3, targetReps: 12 },
    ],
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "t4",
    name: "Full Body",
    exercises: [
      { exerciseId: "e8", order: 0, targetSets: 3, targetReps: 8 },
      { exerciseId: "e1", order: 1, targetSets: 3, targetReps: 8 },
      { exerciseId: "e4", order: 2, targetSets: 3, targetReps: 8 },
      { exerciseId: "e13", order: 3, targetSets: 3, targetReps: 10 },
      { exerciseId: "e20", order: 4, targetSets: 3, targetReps: 60 },
    ],
    createdAt: "2026-04-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
];

// Historical dates for calendar heatmap demo (date, template index 0–3)
const HISTORY_DATES: [string, number][] = [
  // October 2025
  ["2025-10-01", 0], ["2025-10-03", 1], ["2025-10-05", 2],
  ["2025-10-07", 3], ["2025-10-09", 0], ["2025-10-11", 1],
  ["2025-10-13", 2], ["2025-10-15", 3], ["2025-10-17", 0],
  ["2025-10-20", 1], ["2025-10-22", 2], ["2025-10-24", 3],
  ["2025-10-26", 0], ["2025-10-28", 1], ["2025-10-30", 2],
  // November 2025
  ["2025-11-01", 3], ["2025-11-03", 0], ["2025-11-05", 1],
  ["2025-11-08", 2], ["2025-11-10", 3], ["2025-11-12", 0],
  ["2025-11-14", 1], ["2025-11-17", 2], ["2025-11-19", 3],
  ["2025-11-21", 0], ["2025-11-24", 1], ["2025-11-25", 2],
  ["2025-11-27", 3], ["2025-11-29", 0],
  // December 2025
  ["2025-12-01", 1], ["2025-12-03", 2], ["2025-12-05", 3],
  ["2025-12-08", 0], ["2025-12-10", 1], ["2025-12-12", 2],
  ["2025-12-15", 3], ["2025-12-17", 0], ["2025-12-19", 1],
  ["2025-12-22", 2], ["2025-12-29", 3], ["2025-12-31", 0],
  // January 2026
  ["2026-01-02", 1], ["2026-01-04", 2], ["2026-01-06", 3],
  ["2026-01-08", 0], ["2026-01-10", 1], ["2026-01-13", 2],
  ["2026-01-15", 3], ["2026-01-17", 0], ["2026-01-20", 1],
  ["2026-01-22", 2], ["2026-01-24", 3], ["2026-01-27", 0],
  ["2026-01-29", 1], ["2026-01-31", 2],
  // February 2026
  ["2026-02-02", 3], ["2026-02-04", 0], ["2026-02-06", 1],
  ["2026-02-09", 2], ["2026-02-11", 3], ["2026-02-13", 0],
  ["2026-02-16", 1], ["2026-02-18", 2], ["2026-02-20", 3],
  ["2026-02-23", 0], ["2026-02-25", 1], ["2026-02-27", 2],
  // March 2026
  ["2026-03-02", 3], ["2026-03-04", 0], ["2026-03-06", 1],
  ["2026-03-09", 2], ["2026-03-11", 3], ["2026-03-13", 0],
  ["2026-03-16", 1], ["2026-03-18", 2], ["2026-03-20", 3],
  ["2026-03-23", 0], ["2026-03-25", 1], ["2026-03-27", 2],
  ["2026-03-30", 3],
  // Early April 2026 (before the seeded workouts below)
  ["2026-04-01", 0], ["2026-04-03", 1], ["2026-04-05", 2],
];

const HISTORICAL_WORKOUTS: Workout[] = HISTORY_DATES.map(([date, tmplIdx], i) => {
  const t = TEMPLATES[tmplIdx];
  const firstEx = t.exercises[0];
  return {
    id: `h${i}`,
    templateId: t.id,
    templateName: t.name,
    startedAt: `${date}T09:00:00Z`,
    finishedAt: `${date}T10:00:00Z`,
    durationSeconds: 3600,
    exercises: [
      {
        id: `h${i}-we0`,
        exerciseId: firstEx.exerciseId,
        order: 0,
        sets: [
          { id: `h${i}-s0`, setNumber: 1, weight: 135, reps: 8, completed: true },
          { id: `h${i}-s1`, setNumber: 2, weight: 140, reps: 8, completed: true },
          { id: `h${i}-s2`, setNumber: 3, weight: 140, reps: 7, completed: true },
        ],
      },
    ],
  };
});

// Seeded workout history
export let WORKOUT_HISTORY: Workout[] = [
  {
    id: "w1",
    templateId: "t1",
    templateName: "Push Day",
    startedAt: "2026-04-13T09:00:00Z",
    finishedAt: "2026-04-13T10:05:00Z",
    durationSeconds: 3900,
    exercises: [
      {
        id: "we1",
        exerciseId: "e1",
        order: 0,
        sets: [
          { id: "s1", setNumber: 1, weight: 135, reps: 8, completed: true },
          { id: "s2", setNumber: 2, weight: 145, reps: 8, completed: true },
          { id: "s3", setNumber: 3, weight: 155, reps: 7, completed: true },
          { id: "s4", setNumber: 4, weight: 155, reps: 6, completed: true },
        ],
      },
      {
        id: "we2",
        exerciseId: "e2",
        order: 1,
        sets: [
          { id: "s5", setNumber: 1, weight: 50, reps: 10, completed: true },
          { id: "s6", setNumber: 2, weight: 55, reps: 10, completed: true },
          { id: "s7", setNumber: 3, weight: 55, reps: 9, completed: true },
        ],
      },
      {
        id: "we3",
        exerciseId: "e13",
        order: 2,
        sets: [
          { id: "s8", setNumber: 1, weight: 95, reps: 10, completed: true },
          { id: "s9", setNumber: 2, weight: 95, reps: 10, completed: true },
          { id: "s10", setNumber: 3, weight: 95, reps: 9, completed: true },
        ],
      },
    ],
  },
  {
    id: "w2",
    templateId: "t2",
    templateName: "Pull Day",
    startedAt: "2026-04-11T10:30:00Z",
    finishedAt: "2026-04-11T11:40:00Z",
    durationSeconds: 4200,
    exercises: [
      {
        id: "we4",
        exerciseId: "e5",
        order: 0,
        sets: [
          { id: "s11", setNumber: 1, weight: 0, reps: 8, completed: true },
          { id: "s12", setNumber: 2, weight: 0, reps: 7, completed: true },
          { id: "s13", setNumber: 3, weight: 0, reps: 6, completed: true },
          { id: "s14", setNumber: 4, weight: 0, reps: 6, completed: true },
        ],
      },
      {
        id: "we5",
        exerciseId: "e4",
        order: 1,
        sets: [
          { id: "s15", setNumber: 1, weight: 185, reps: 8, completed: true },
          { id: "s16", setNumber: 2, weight: 185, reps: 8, completed: true },
          { id: "s17", setNumber: 3, weight: 195, reps: 7, completed: true },
          { id: "s18", setNumber: 4, weight: 195, reps: 6, completed: true },
        ],
      },
    ],
  },
  {
    id: "w3",
    templateId: "t3",
    templateName: "Leg Day",
    startedAt: "2026-04-09T08:00:00Z",
    finishedAt: "2026-04-09T09:15:00Z",
    durationSeconds: 4500,
    exercises: [
      {
        id: "we6",
        exerciseId: "e8",
        order: 0,
        sets: [
          { id: "s19", setNumber: 1, weight: 185, reps: 6, completed: true },
          { id: "s20", setNumber: 2, weight: 205, reps: 6, completed: true },
          { id: "s21", setNumber: 3, weight: 215, reps: 5, completed: true },
          { id: "s22", setNumber: 4, weight: 215, reps: 5, completed: true },
        ],
      },
      {
        id: "we7",
        exerciseId: "e9",
        order: 1,
        sets: [
          { id: "s23", setNumber: 1, weight: 135, reps: 10, completed: true },
          { id: "s24", setNumber: 2, weight: 135, reps: 10, completed: true },
          { id: "s25", setNumber: 3, weight: 145, reps: 9, completed: true },
        ],
      },
    ],
  },
  {
    id: "w4",
    startedAt: "2026-04-07T17:00:00Z",
    finishedAt: "2026-04-07T17:45:00Z",
    durationSeconds: 2700,
    exercises: [
      {
        id: "we8",
        exerciseId: "e16",
        order: 0,
        sets: [
          { id: "s26", setNumber: 1, weight: 65, reps: 10, completed: true },
          { id: "s27", setNumber: 2, weight: 65, reps: 10, completed: true },
          { id: "s28", setNumber: 3, weight: 70, reps: 8, completed: true },
        ],
      },
      {
        id: "we9",
        exerciseId: "e18",
        order: 1,
        sets: [
          { id: "s29", setNumber: 1, weight: 50, reps: 12, completed: true },
          { id: "s30", setNumber: 2, weight: 55, reps: 12, completed: true },
          { id: "s31", setNumber: 3, weight: 55, reps: 10, completed: true },
        ],
      },
    ],
  },
  {
    id: "w5",
    templateId: "t1",
    templateName: "Push Day",
    startedAt: "2026-04-06T09:00:00Z",
    finishedAt: "2026-04-06T10:10:00Z",
    durationSeconds: 4200,
    exercises: [
      {
        id: "we10",
        exerciseId: "e1",
        order: 0,
        sets: [
          { id: "s32", setNumber: 1, weight: 135, reps: 8, completed: true },
          { id: "s33", setNumber: 2, weight: 145, reps: 8, completed: true },
          { id: "s34", setNumber: 3, weight: 150, reps: 7, completed: true },
          { id: "s35", setNumber: 4, weight: 150, reps: 7, completed: true },
        ],
      },
    ],
  },
  ...HISTORICAL_WORKOUTS,
];

export function saveWorkout(workout: Workout): void {
  WORKOUT_HISTORY = [workout, ...WORKOUT_HISTORY];
}

export function deleteWorkout(id: string): void {
  WORKOUT_HISTORY = WORKOUT_HISTORY.filter((w) => w.id !== id);
}

export function getLastWorkoutExercise(exerciseId: string): WorkoutExercise | null {
  for (const workout of WORKOUT_HISTORY) {
    const found = workout.exercises.find((e) => e.exerciseId === exerciseId);
    if (found) return found;
  }
  return null;
}

export function getWorkoutById(id: string): Workout | undefined {
  return WORKOUT_HISTORY.find((w) => w.id === id);
}

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}

export function getTemplateById(id: string): WorkoutTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s > 0 ? `${s}s` : ""}`.trim();
  return `${s}s`;
}
