-- Update save_workout to not accept explicit IDs for any table.
-- Postgres will use DEFAULT gen_random_uuid() for all id columns.
CREATE OR REPLACE FUNCTION save_workout(p_data jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_workout_id uuid;
  v_ex_id      uuid;
  ex           jsonb;
  s            jsonb;
BEGIN
  INSERT INTO workouts (
    user_id, template_id, template_name,
    started_at, finished_at, duration_seconds
  ) VALUES (
    (p_data->>'userId')::uuid,
    NULLIF(p_data->>'templateId', '')::uuid,
    NULLIF(p_data->>'templateName', ''),
    (p_data->>'startedAt')::timestamptz,
    NULLIF(p_data->>'finishedAt', '')::timestamptz,
    NULLIF(p_data->>'durationSeconds', '')::int
  )
  RETURNING id INTO v_workout_id;

  FOR ex IN SELECT * FROM jsonb_array_elements(p_data->'exercises') LOOP
    INSERT INTO workout_exercises (
      workout_id, exercise_id, "order", notes
    ) VALUES (
      v_workout_id,
      (ex->>'exerciseId')::uuid,
      (ex->>'order')::int,
      NULLIF(ex->>'notes', '')
    )
    RETURNING id INTO v_ex_id;

    FOR s IN SELECT * FROM jsonb_array_elements(ex->'sets') LOOP
      INSERT INTO workout_sets (
        workout_exercise_id, set_number, weight, reps, completed
      ) VALUES (
        v_ex_id,
        (s->>'setNumber')::int,
        (s->>'weight')::numeric,
        (s->>'reps')::int,
        (s->>'completed')::boolean
      );
    END LOOP;
  END LOOP;

  RETURN v_workout_id;
END;
$$;
