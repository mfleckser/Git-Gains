import { createContext, useContext, useEffect, useState } from "react";
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

  function applyExercises(exs: Exercise[]) {
    setExercises(exs);
    setExerciseMap(new Map(exs.map((e) => [e.id, e])));
  }

  useEffect(() => {
    Promise.all([getExercises(), getTemplates(), getWorkoutHistory()]).then(
      ([exs, tmps, wkts]) => {
        applyExercises(exs);
        setTemplates(tmps);
        setWorkouts(wkts);
        setLoading(false);
      }
    );
  }, []);

  async function refreshExercises() {
    const exs = await getExercises();
    applyExercises(exs);
  }

  async function refreshTemplates() {
    const tmps = await getTemplates();
    setTemplates(tmps);
  }

  async function refreshWorkouts() {
    const wkts = await getWorkoutHistory();
    setWorkouts(wkts);
  }

  return (
    <AppDataContext.Provider
      value={{
        exercises,
        exerciseMap,
        templates,
        workouts,
        loading,
        refreshExercises,
        refreshTemplates,
        refreshWorkouts,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}
