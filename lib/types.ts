export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  notes?: string;
};

export type TemplateExercise = {
  exerciseId: string;
  order: number;
  targetSets: number;
  targetReps: number;
  targetWeight?: number;
  notes?: string;
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  notes?: string;
  exercises: TemplateExercise[];
  createdAt: string;
  updatedAt: string;
};

export type WorkoutSet = {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
};

export type WorkoutExercise = {
  id: string;
  exerciseId: string;
  order: number;
  sets: WorkoutSet[];
  notes?: string;
};

export type Workout = {
  id: string;
  templateId?: string;
  templateName?: string;
  startedAt: string;
  finishedAt?: string;
  durationSeconds?: number;
  exercises: WorkoutExercise[];
};
