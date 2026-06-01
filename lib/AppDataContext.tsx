import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getExercises, getRuns, getTemplates, getWorkoutHistory } from "./api";
import type { Exercise, Run, Workout, WorkoutTemplate } from "./types";

type AppData = {
  exercises: Exercise[];
  exerciseMap: Map<string, Exercise>;
  templates: WorkoutTemplate[];
  workouts: Workout[];
  runs: Run[];
  loading: boolean;
  refreshExercises(): Promise<void>;
  refreshTemplates(): Promise<void>;
  refreshWorkouts(): Promise<void>;
  refreshRuns(): Promise<void>;
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
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  const applyExercises = useCallback((exs: Exercise[]) => {
    setExercises(exs);
    setExerciseMap(new Map(exs.map((e) => [e.id, e])));
  }, []);

  useEffect(() => {
    Promise.all([getExercises(), getTemplates(), getWorkoutHistory(), getRuns()]).then(
      ([exs, tmps, wkts, rns]) => {
        applyExercises(exs);
        setTemplates(tmps);
        setWorkouts(wkts);
        setRuns(rns);
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

  const refreshRuns = useCallback(async () => {
    const rns = await getRuns();
    setRuns(rns);
  }, []);

  const value = useMemo(() => ({
    exercises,
    exerciseMap,
    templates,
    workouts,
    runs,
    loading,
    refreshExercises,
    refreshTemplates,
    refreshWorkouts,
    refreshRuns,
  }), [exercises, exerciseMap, templates, workouts, runs, loading, refreshExercises, refreshTemplates, refreshWorkouts, refreshRuns]);

  return (
    <AppDataContext.Provider
      value={value}
    >
      {children}
    </AppDataContext.Provider>
  );
}
