import type { WorkoutTemplate } from "../types";
import {
  initialWorkoutState,
  workoutReducer,
  WorkoutState,
} from "../workoutReducer";

function startFromTemplate(): WorkoutState {
  const template: WorkoutTemplate = {
    id: "tmpl-1",
    name: "Push Day",
    exercises: [
      {
        exerciseId: "ex-bench",
        order: 0,
        targetSets: 3,
        targetReps: 8,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return workoutReducer(initialWorkoutState, {
    type: "START_WORKOUT",
    payload: { template },
  });
}

describe("workoutReducer", () => {
  test("START_WORKOUT with template seeds exercises and sets", () => {
    const state = startFromTemplate();
    expect(state.active).not.toBeNull();
    expect(state.completedWorkout).toBeNull();

    const workout = state.active!.workout;
    expect(workout.templateId).toBe("tmpl-1");
    expect(workout.templateName).toBe("Push Day");
    expect(workout.exercises).toHaveLength(1);

    const we = workout.exercises[0];
    expect(we.exerciseId).toBe("ex-bench");
    expect(we.annotation).toBe("stay");
    expect(we.sets).toHaveLength(3);
    expect(we.sets.map((s) => s.setNumber)).toEqual([1, 2, 3]);
    expect(we.sets.every((s) => s.reps === 8)).toBe(true);
    expect(we.sets.every((s) => s.weight === 0)).toBe(true);
    expect(we.sets.every((s) => !s.completed)).toBe(true);
  });

  test("START_WORKOUT without template produces empty exercises list", () => {
    const state = workoutReducer(initialWorkoutState, {
      type: "START_WORKOUT",
      payload: {},
    });
    expect(state.active?.workout.exercises).toEqual([]);
    expect(state.active?.workout.templateId).toBeUndefined();
  });

  test("ADD_SET appends new set inheriting weight/reps from last set", () => {
    let state = startFromTemplate();
    const we = state.active!.workout.exercises[0];
    // mutate last set via UPDATE_SET
    state = workoutReducer(state, {
      type: "UPDATE_SET",
      payload: {
        workoutExerciseId: we.id,
        setId: we.sets[2].id,
        field: "weight",
        value: 135,
      },
    });
    state = workoutReducer(state, {
      type: "ADD_SET",
      payload: { exerciseId: we.id },
    });

    const updated = state.active!.workout.exercises[0];
    expect(updated.sets).toHaveLength(4);
    const newSet = updated.sets[3];
    expect(newSet.setNumber).toBe(4);
    expect(newSet.weight).toBe(135);
    expect(newSet.reps).toBe(8);
    expect(newSet.completed).toBe(false);
  });

  test("ADD_SET returns state unchanged when no active workout", () => {
    const state = workoutReducer(initialWorkoutState, {
      type: "ADD_SET",
      payload: { exerciseId: "whatever" },
    });
    expect(state).toBe(initialWorkoutState);
  });

  test("TOGGLE_SET_COMPLETE flips the set's completed flag", () => {
    let state = startFromTemplate();
    const we = state.active!.workout.exercises[0];
    const target = we.sets[1];

    state = workoutReducer(state, {
      type: "TOGGLE_SET_COMPLETE",
      payload: { workoutExerciseId: we.id, setId: target.id },
    });
    let sets = state.active!.workout.exercises[0].sets;
    expect(sets[1].completed).toBe(true);
    expect(sets[0].completed).toBe(false);
    expect(sets[2].completed).toBe(false);

    state = workoutReducer(state, {
      type: "TOGGLE_SET_COMPLETE",
      payload: { workoutExerciseId: we.id, setId: target.id },
    });
    sets = state.active!.workout.exercises[0].sets;
    expect(sets[1].completed).toBe(false);
  });
});
