import { supabase } from './supabase';
import type { Exercise, Workout, WorkoutExercise, WorkoutTemplate } from './types';

async function getUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

// ─── Exercises ───────────────────────────────────────────────────────────────

export async function getExercises(): Promise<Exercise[]> {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .order('name');
  if (error) throw error;
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    muscleGroup: row.muscle_group,
    notes: row.notes ?? undefined,
    userId: row.user_id ?? undefined,
  }));
}

export async function createExercise(input: {
  name: string;
  muscleGroup: string;
  notes?: string;
}): Promise<Exercise> {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('exercises')
    .insert({ name: input.name, muscle_group: input.muscleGroup, notes: input.notes, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    muscleGroup: data.muscle_group,
    notes: data.notes ?? undefined,
    userId: data.user_id,
  };
}

// ─── Templates ───────────────────────────────────────────────────────────────

function mapTemplateRow(row: any): WorkoutTemplate {
  return {
    id: row.id,
    name: row.name,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    exercises: (row.template_exercises as any[])
      .sort((a, b) => a.order - b.order)
      .map((te) => ({
        exerciseId: te.exercise_id,
        order: te.order,
        targetSets: te.target_sets,
        targetReps: te.target_reps,
        targetWeight: te.target_weight ?? undefined,
        notes: te.notes ?? undefined,
      })),
  };
}

export async function getTemplates(): Promise<WorkoutTemplate[]> {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('workout_templates')
    .select('*, template_exercises(*)')
    .eq('user_id', userId)
    .order('created_at');
  if (error) throw error;
  return data.map(mapTemplateRow);
}

export async function getTemplateById(id: string): Promise<WorkoutTemplate | null> {
  const { data, error } = await supabase
    .from('workout_templates')
    .select('*, template_exercises(*)')
    .eq('id', id)
    .single();
  if (error) return null;
  return mapTemplateRow(data);
}

export async function createTemplate(
  template: Omit<WorkoutTemplate, 'id' | 'createdAt' | 'updatedAt'>
): Promise<WorkoutTemplate> {
  const userId = await getUserId();
  const { data: tmpl, error: tmplErr } = await supabase
    .from('workout_templates')
    .insert({ user_id: userId, name: template.name, notes: template.notes ?? null })
    .select()
    .single();
  if (tmplErr) throw tmplErr;

  if (template.exercises.length > 0) {
    const { error: exErr } = await supabase.from('template_exercises').insert(
      template.exercises.map((te) => ({
        template_id: tmpl.id,
        exercise_id: te.exerciseId,
        order: te.order,
        target_sets: te.targetSets,
        target_reps: te.targetReps,
        target_weight: te.targetWeight ?? null,
        notes: te.notes ?? null,
      }))
    );
    if (exErr) throw exErr;
  }

  return {
    ...template,
    id: tmpl.id,
    createdAt: tmpl.created_at,
    updatedAt: tmpl.updated_at,
  };
}

export async function updateTemplate(
  id: string,
  template: Omit<WorkoutTemplate, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  const { error: tmplErr } = await supabase
    .from('workout_templates')
    .update({ name: template.name, notes: template.notes ?? null, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (tmplErr) throw tmplErr;

  // Replace all exercises
  await supabase.from('template_exercises').delete().eq('template_id', id);

  if (template.exercises.length > 0) {
    const { error: exErr } = await supabase.from('template_exercises').insert(
      template.exercises.map((te) => ({
        template_id: id,
        exercise_id: te.exerciseId,
        order: te.order,
        target_sets: te.targetSets,
        target_reps: te.targetReps,
        target_weight: te.targetWeight ?? null,
        notes: te.notes ?? null,
      }))
    );
    if (exErr) throw exErr;
  }
}

export async function deleteTemplate(id: string): Promise<void> {
  const { error } = await supabase.from('workout_templates').delete().eq('id', id);
  if (error) throw error;
}

// ─── Workouts ─────────────────────────────────────────────────────────────────

function mapWorkoutRow(row: any): Workout {
  return {
    id: row.id,
    templateId: row.template_id ?? undefined,
    templateName: row.template_name ?? undefined,
    startedAt: row.started_at,
    finishedAt: row.finished_at ?? undefined,
    durationSeconds: row.duration_seconds ?? undefined,
    exercises: (row.workout_exercises as any[])
      .sort((a, b) => a.order - b.order)
      .map((we) => ({
        id: we.id,
        exerciseId: we.exercise_id,
        order: we.order,
        notes: we.notes ?? undefined,
        sets: (we.workout_sets as any[])
          .sort((a, b) => a.set_number - b.set_number)
          .map((s) => ({
            id: s.id,
            setNumber: s.set_number,
            weight: Number(s.weight),
            reps: s.reps,
            completed: s.completed,
          })),
      })),
  };
}

export async function getWorkoutHistory(): Promise<Workout[]> {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('workouts')
    .select('*, workout_exercises(*, workout_sets(*))')
    .eq('user_id', userId)
    .order('started_at', { ascending: false });
  if (error) throw error;
  return data.map(mapWorkoutRow);
}

export async function getWorkoutById(id: string): Promise<Workout | null> {
  const { data, error } = await supabase
    .from('workouts')
    .select('*, workout_exercises(*, workout_sets(*))')
    .eq('id', id)
    .single();
  if (error) return null;
  return mapWorkoutRow(data);
}

export async function saveWorkout(workout: Workout): Promise<void> {
  const userId = await getUserId();
  console.log(workout);
  const { error } = await supabase.rpc('save_workout', {
    p_data: {
      userId,
      templateId: workout.templateId ?? null,
      templateName: workout.templateName ?? null,
      startedAt: workout.startedAt,
      finishedAt: workout.finishedAt ?? null,
      durationSeconds: workout.durationSeconds ?? null,
      exercises: workout.exercises.map((we) => ({
        exerciseId: we.exerciseId,
        order: we.order,
        notes: we.notes ?? null,
        sets: we.sets.map((s) => ({
          setNumber: s.setNumber,
          weight: s.weight,
          reps: s.reps,
          completed: s.completed,
        })),
      })),
    },
  });
  if (error) throw error;
}

export async function deleteWorkout(id: string): Promise<void> {
  const { error } = await supabase.from('workouts').delete().eq('id', id);
  if (error) throw error;
}

export async function getLastWorkoutExercise(
  exerciseId: string
): Promise<WorkoutExercise | null> {
  // RLS ensures we only see our own workout_exercises.
  // Fetch all matching exercises with their workout's start time, then pick the most recent.
  const { data, error } = await supabase
    .from('workout_exercises')
    .select('*, workout_sets(*), workouts(started_at)')
    .eq('exercise_id', exerciseId);

  if (error || !data || data.length === 0) return null;

  const sorted = [...data].sort((a, b) => {
    const aDate = (a.workouts as any)?.started_at ?? '';
    const bDate = (b.workouts as any)?.started_at ?? '';
    return bDate.localeCompare(aDate);
  });

  const we = sorted[0];
  return {
    id: we.id,
    exerciseId: we.exercise_id,
    order: we.order,
    notes: we.notes ?? undefined,
    sets: (we.workout_sets as any[])
      .sort((a: any, b: any) => a.set_number - b.set_number)
      .map((s: any) => ({
        id: s.id,
        setNumber: s.set_number,
        weight: Number(s.weight),
        reps: s.reps,
        completed: s.completed,
      })),
  };
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s > 0 ? `${s}s` : ''}`.trim();
  return `${s}s`;
}
