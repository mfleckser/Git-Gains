import { buildHeatmap, toDateKey } from "../heatmap";
import type { Workout } from "../types";

function mkWorkout(id: string, startedAt: string): Workout {
  return {
    id,
    startedAt,
    exercises: [],
  };
}

describe("heatmap", () => {
  test("toDateKey pads month and day", () => {
    expect(toDateKey(new Date(2026, 0, 3))).toBe("2026-01-03");
    expect(toDateKey(new Date(2026, 10, 11))).toBe("2026-11-11");
  });

  test("buildHeatmap produces numWeeks columns of 7 days each", () => {
    // Wednesday 2026-04-15
    const today = new Date(2026, 3, 15);
    const result = buildHeatmap([], today, 4);

    expect(result.weeks).toHaveLength(4);
    for (const week of result.weeks) {
      expect(week).toHaveLength(7);
    }
    // grid start is a Sunday
    expect(result.startDate.getDay()).toBe(0);
  });

  test("future days beyond today are null", () => {
    // Wednesday 2026-04-15 — last week has Thu/Fri/Sat in the future
    const today = new Date(2026, 3, 15);
    const result = buildHeatmap([], today, 2);
    const lastWeek = result.weeks[result.weeks.length - 1];
    // Sun Mon Tue Wed should be present, Thu Fri Sat null
    expect(lastWeek[0]).not.toBeNull();
    expect(lastWeek[3]).not.toBeNull();
    expect(lastWeek[4]).toBeNull();
    expect(lastWeek[5]).toBeNull();
    expect(lastWeek[6]).toBeNull();
  });

  test("activeDates contains keys for workout start dates", () => {
    const today = new Date(2026, 3, 15);
    const workouts = [
      mkWorkout("w1", new Date(2026, 3, 10, 14, 30).toISOString()),
      mkWorkout("w2", new Date(2026, 3, 12, 9, 0).toISOString()),
    ];
    const result = buildHeatmap(workouts, today, 4);
    expect(result.activeDates.has("2026-04-10")).toBe(true);
    expect(result.activeDates.has("2026-04-12")).toBe(true);
    expect(result.activeDates.has("2026-04-11")).toBe(false);
  });

  test("totalWorkouts only counts workouts in visible grid", () => {
    const today = new Date(2026, 3, 15);
    // numWeeks=2 → grid spans ~14 days back
    const inside = mkWorkout("w1", new Date(2026, 3, 10).toISOString());
    const alsoInside = mkWorkout("w2", new Date(2026, 3, 14).toISOString());
    const outside = mkWorkout("w3", new Date(2026, 0, 1).toISOString());
    const result = buildHeatmap([inside, alsoInside, outside], today, 2);
    expect(result.totalWorkouts).toBe(2);
  });
});
