import type { Workout } from "./types";

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export type HeatmapData = {
  weeks: (Date | null)[][];
  startDate: Date;
  activeDates: Set<string>;
  totalWorkouts: number;
};

export function buildHeatmap(
  workouts: Workout[],
  today: Date,
  numWeeks: number
): HeatmapData {
  const activeDates = new Set(
    workouts.map((w) => toDateKey(new Date(w.startedAt)))
  );

  const dayStart = new Date(today);
  dayStart.setHours(0, 0, 0, 0);

  const gridStart = new Date(dayStart);
  gridStart.setDate(dayStart.getDate() - dayStart.getDay() - (numWeeks - 1) * 7);

  const startDate = new Date(gridStart);

  const weeks: (Date | null)[][] = [];
  const cursor = new Date(gridStart);

  while (cursor <= dayStart) {
    const week: (Date | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(cursor);
      day.setDate(cursor.getDate() + d);
      week.push(day <= dayStart ? day : null);
    }
    weeks.push(week);
    cursor.setDate(cursor.getDate() + 7);
  }

  const totalWorkouts = workouts.filter((w) => {
    const d = new Date(w.startedAt);
    d.setHours(0, 0, 0, 0);
    return d >= startDate && d <= dayStart;
  }).length;

  return { weeks, startDate, activeDates, totalWorkouts };
}
