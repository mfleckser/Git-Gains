import type {
  Annotation,
  Workout,
  WorkoutExercise,
  WorkoutSet,
  WorkoutTemplate,
} from "./types";

export type ActiveWorkout = {
  workout: Workout;
  startedAt: Date;
};

export type WorkoutState = {
  active: ActiveWorkout | null;
  completedWorkout: Workout | null;
};

export type WorkoutAction =
  | { type: "START_WORKOUT"; payload: { template?: WorkoutTemplate } }
  | { type: "ADD_EXERCISE"; payload: { exerciseId: string } }
  | { type: "ADD_SET"; payload: { exerciseId: string } }
  | {
      type: "UPDATE_SET";
      payload: {
        workoutExerciseId: string;
        setId: string;
        field: "weight" | "reps";
        value: number;
      };
    }
  | {
      type: "TOGGLE_SET_COMPLETE";
      payload: { workoutExerciseId: string; setId: string };
    }
  | {
      type: "SET_ANNOTATION";
      payload: { workoutExerciseId: string; annotation: Annotation };
    }
  | { type: "FINISH_WORKOUT"; payload: Workout }
  | { type: "DISCARD_WORKOUT" };

export const initialWorkoutState: WorkoutState = {
  active: null,
  completedWorkout: null,
};

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case "START_WORKOUT": {
      const { template } = action.payload;
      const now = new Date();

      const exercises: WorkoutExercise[] = template
        ? template.exercises.map((te) => ({
            id: generateId(),
            exerciseId: te.exerciseId,
            order: te.order,
            sets: Array.from({ length: te.targetSets }, (_, i) => ({
              id: generateId(),
              setNumber: i + 1,
              weight: 0,
              reps: te.targetReps,
              completed: false,
            })),
            notes: te.notes,
            annotation: "stay",
          }))
        : [];

      const workout: Workout = {
        id: generateId(),
        templateId: template?.id,
        templateName: template?.name,
        startedAt: now.toISOString(),
        exercises,
      };

      return { ...state, active: { workout, startedAt: now }, completedWorkout: null };
    }

    case "ADD_EXERCISE": {
      if (!state.active) return state;
      const { exerciseId } = action.payload;
      const newExercise: WorkoutExercise = {
        id: generateId(),
        exerciseId,
        order: state.active.workout.exercises.length,
        sets: [{ id: generateId(), setNumber: 1, weight: 0, reps: 0, completed: false }],
        annotation: "stay",
      };
      return {
        ...state,
        active: {
          ...state.active,
          workout: {
            ...state.active.workout,
            exercises: [...state.active.workout.exercises, newExercise],
          },
        },
      };
    }

    case "ADD_SET": {
      if (!state.active) return state;
      const { exerciseId: weId } = action.payload;
      const exercises = state.active.workout.exercises.map((we) => {
        if (we.id !== weId) return we;
        const lastSet = we.sets[we.sets.length - 1];
        const newSet: WorkoutSet = {
          id: generateId(),
          setNumber: we.sets.length + 1,
          weight: lastSet?.weight ?? 0,
          reps: lastSet?.reps ?? 0,
          completed: false,
        };
        return { ...we, sets: [...we.sets, newSet] };
      });
      return {
        ...state,
        active: { ...state.active, workout: { ...state.active.workout, exercises } },
      };
    }

    case "UPDATE_SET": {
      if (!state.active) return state;
      const { workoutExerciseId, setId, field, value } = action.payload;
      const exercises = state.active.workout.exercises.map((we) => {
        if (we.id !== workoutExerciseId) return we;
        const updatedSet = we.sets.find((s) => s.id === setId);
        const sets = we.sets.map((s) => {
          if (s.id === setId) return { ...s, [field]: value };
          if (field === "weight" && updatedSet && s.setNumber > updatedSet.setNumber)
            return { ...s, weight: value as number };
          return s;
        });
        return { ...we, sets };
      });
      return {
        ...state,
        active: { ...state.active, workout: { ...state.active.workout, exercises } },
      };
    }

    case "TOGGLE_SET_COMPLETE": {
      if (!state.active) return state;
      const { workoutExerciseId, setId } = action.payload;
      const exercises = state.active.workout.exercises.map((we) => {
        if (we.id !== workoutExerciseId) return we;
        const sets = we.sets.map((s) =>
          s.id === setId ? { ...s, completed: !s.completed } : s
        );
        return { ...we, sets };
      });
      return {
        ...state,
        active: { ...state.active, workout: { ...state.active.workout, exercises } },
      };
    }

    case "SET_ANNOTATION": {
      if (!state.active) return state;
      const { workoutExerciseId, annotation } = action.payload;
      const exercises = state.active.workout.exercises.map((we) =>
        we.id === workoutExerciseId ? { ...we, annotation } : we
      );
      return {
        ...state,
        active: { ...state.active, workout: { ...state.active.workout, exercises } },
      };
    }

    case "FINISH_WORKOUT": {
      return { active: null, completedWorkout: action.payload };
    }

    case "DISCARD_WORKOUT": {
      return { active: null, completedWorkout: null };
    }

    default:
      return state;
  }
}
