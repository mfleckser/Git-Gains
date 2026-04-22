import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getExercises, getTemplates, getWorkoutHistory } from "./api";
import type { Exercise, Workout, WorkoutTemplate } from "./types";

type AppData = {
  exercises: Exercise[];
  exerciseMap: Map<string, Exercise>;
  templates: WorkoutTemplate[];
  workouts: Workout[];
  loading: boolean;
  refreshExercises(): Promise<void>;
  refreshTemplates(): Promise<void>;
  refreshWorkouts(): Promise<void>;
};

const AppDataContext = createContext<AppData | null>(null);

export function useAppData(): AppData {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseMap, setExerciseMap] = useState<Map<string, Exercise>>(new Map());
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const applyExercises = useCallback((exs: Exercise[]) => {
    setExercises(exs);
    setExerciseMap(new Map(exs.map((e) => [e.id, e])));
  }, []);

  useEffect(() => {
    Promise.all([getExercises(), getTemplates(), getWorkoutHistory()]).then(
      ([exs, tmps, wkts]) => {
        applyExercises(exs);
        setTemplates(tmps);
        setWorkouts(wkts);
        setLoading(false);
      }
    );
  }, [applyExercises]);

  const refreshExercises = useCallback(async () => {
    const exs = await getExercises();
    applyExercises(exs);
  }, [applyExercises]);

  const refreshTemplates = useCallback(async () => {
    const tmps = await getTemplates();
    setTemplates(tmps);
  }, []);

  const refreshWorkouts = useCallback(async () => {
    const wkts = await getWorkoutHistory();
    setWorkouts(wkts);
  }, []);

  const value = useMemo(() => ({
    exercises,
    exerciseMap,
    templates,
    workouts,
    loading,
    refreshExercises,
    refreshTemplates,
    refreshWorkouts,
  }), [exercises, exerciseMap, templates, workouts, loading, refreshExercises, refreshTemplates, refreshWorkouts]);

  return (
    <AppDataContext.Provider
      value={value}
    >
      {children}
    </AppDataContext.Provider>
  );
}
