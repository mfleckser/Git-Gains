import type { Exercise, WorkoutTemplate, Workout, WorkoutExercise } from "./types";

export const EXERCISES: Exercise[] = [
  // Chest
  { id: "e1", name: "Barbell Bench Press", muscleGroup: "Chest" },
  { id: "e2", name: "Dumbbell Incline Press", muscleGroup: "Chest" },
  { id: "e3", name: "Cable Chest Fly", muscleGroup: "Chest" },
  // Back
  { id: "e4", name: "Barbell Row", muscleGroup: "Back" },
  { id: "e5", name: "Pull-Up", muscleGroup: "Back" },
  { id: "e6", name: "Lat Pulldown", muscleGroup: "Back" },
  { id: "e7", name: "Seated Cable Row", muscleGroup: "Back" },
  // Legs
  { id: "e8", name: "Barbell Squat", muscleGroup: "Legs" },
  { id: "e9", name: "Romanian Deadlift", muscleGroup: "Legs" },
  { id: "e10", name: "Leg Press", muscleGroup: "Legs" },
  { id: "e11", name: "Walking Lunges", muscleGroup: "Legs" },
  { id: "e12", name: "Leg Curl", muscleGroup: "Legs" },
  // Shoulders
  { id: "e13", name: "Overhead Press", muscleGroup: "Shoulders" },
  { id: "e14", name: "Lateral Raise", muscleGroup: "Shoulders" },
  { id: "e15", name: "Face Pull", muscleGroup: "Shoulders" },
  // Arms
  { id: "e16", name: "Barbell Curl", muscleGroup: "Biceps" },
  { id: "e17", name: "Hammer Curl", muscleGroup: "Biceps" },
  { id: "e18", name: "Tricep Pushdown", muscleGroup: "Triceps" },
  { id: "e19", name: "Skull Crusher", muscleGroup: "Triceps" },
  // Core
  { id: "e20", name: "Plank", muscleGroup: "Core" },
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
];

export function saveWorkout(workout: Workout): void {
  WORKOUT_HISTORY = [workout, ...WORKOUT_HISTORY];
}

export function getLastWorkoutExercise(exerciseId: string): WorkoutExercise | null {
  for (const workout of WORKOUT_HISTORY) {
    const found = workout.exercises.find((e) => e.exerciseId === exerciseId);
    if (found) return found;
  }
  return null;
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
