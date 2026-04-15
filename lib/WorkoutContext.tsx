import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import * as Haptics from "expo-haptics";
import type { Workout, WorkoutExercise, WorkoutSet, WorkoutTemplate } from "./types";
import { EXERCISES, saveWorkout } from "./mockData";

type ActiveWorkout = {
  workout: Workout;
  startedAt: Date;
};

type State = {
  active: ActiveWorkout | null;
  completedWorkout: Workout | null;
};

type Action =
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
  | { type: "FINISH_WORKOUT" }
  | { type: "DISCARD_WORKOUT" };

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function reducer(state: State, action: Action): State {
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
        const sets = we.sets.map((s) =>
          s.id === setId ? { ...s, [field]: value } : s
        );
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

    case "FINISH_WORKOUT": {
      if (!state.active) return state;
      const now = new Date();
      const durationSeconds = Math.floor(
        (now.getTime() - state.active.startedAt.getTime()) / 1000
      );
      const completed: Workout = {
        ...state.active.workout,
        finishedAt: now.toISOString(),
        durationSeconds,
      };
      saveWorkout(completed);
      return { active: null, completedWorkout: completed };
    }

    case "DISCARD_WORKOUT": {
      return { active: null, completedWorkout: null };
    }

    default:
      return state;
  }
}

type WorkoutContextValue = {
  active: ActiveWorkout | null;
  completedWorkout: Workout | null;
  startWorkout: (template?: WorkoutTemplate) => void;
  addExercise: (exerciseId: string) => void;
  addSet: (workoutExerciseId: string) => void;
  updateSet: (
    workoutExerciseId: string,
    setId: string,
    field: "weight" | "reps",
    value: number
  ) => void;
  toggleSetComplete: (workoutExerciseId: string, setId: string) => void;
  finishWorkout: () => void;
  discardWorkout: () => void;
};

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    active: null,
    completedWorkout: null,
  });

  const startWorkout = useCallback((template?: WorkoutTemplate) => {
    dispatch({ type: "START_WORKOUT", payload: { template } });
  }, []);

  const addExercise = useCallback((exerciseId: string) => {
    dispatch({ type: "ADD_EXERCISE", payload: { exerciseId } });
  }, []);

  const addSet = useCallback((workoutExerciseId: string) => {
    dispatch({ type: "ADD_SET", payload: { exerciseId: workoutExerciseId } });
  }, []);

  const updateSet = useCallback(
    (workoutExerciseId: string, setId: string, field: "weight" | "reps", value: number) => {
      dispatch({ type: "UPDATE_SET", payload: { workoutExerciseId, setId, field, value } });
    },
    []
  );

  const toggleSetComplete = useCallback((workoutExerciseId: string, setId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    dispatch({ type: "TOGGLE_SET_COMPLETE", payload: { workoutExerciseId, setId } });
  }, []);

  const finishWorkout = useCallback(() => {
    dispatch({ type: "FINISH_WORKOUT" });
  }, []);

  const discardWorkout = useCallback(() => {
    dispatch({ type: "DISCARD_WORKOUT" });
  }, []);

  return (
    <WorkoutContext.Provider
      value={{
        active: state.active,
        completedWorkout: state.completedWorkout,
        startWorkout,
        addExercise,
        addSet,
        updateSet,
        toggleSetComplete,
        finishWorkout,
        discardWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout(): WorkoutContextValue {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("useWorkout must be used within WorkoutProvider");
  return ctx;
}
