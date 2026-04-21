import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import * as Haptics from "expo-haptics";
import type { Annotation, Workout, WorkoutTemplate } from "./types";
import { saveWorkout } from "./api";
import { useAppData } from "./AppDataContext";
import {
  ActiveWorkout,
  initialWorkoutState,
  workoutReducer,
} from "./workoutReducer";

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
  setAnnotation: (workoutExerciseId: string, annotation: Annotation) => void;
  finishWorkout: () => void;
  discardWorkout: () => void;
};

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(workoutReducer, initialWorkoutState);
  const { refreshWorkouts } = useAppData();

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

  const setAnnotation = useCallback(
    (workoutExerciseId: string, annotation: Annotation) => {
      dispatch({ type: "SET_ANNOTATION", payload: { workoutExerciseId, annotation } });
    },
    []
  );

  const finishWorkout = useCallback(() => {
    if (!state.active) return;
    const now = new Date();
    const durationSeconds = Math.floor(
      (now.getTime() - state.active.startedAt.getTime()) / 1000
    );
    const completed: Workout = {
      ...state.active.workout,
      finishedAt: now.toISOString(),
      durationSeconds,
    };
    dispatch({ type: "FINISH_WORKOUT", payload: completed });
    saveWorkout(completed).then(() => refreshWorkouts()).catch(console.error);
  }, [state.active, refreshWorkouts]);

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
        setAnnotation,
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
