-- exercises: global catalog (user_id = NULL) + user-created custom exercises
CREATE TABLE exercises (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users ON DELETE CASCADE,  -- NULL = global
  name         text NOT NULL,
  muscle_group text NOT NULL,
  notes        text,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON exercises (user_id);

-- workout_templates: per-user
CREATE TABLE workout_templates (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name       text NOT NULL,
  notes      text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON workout_templates (user_id);

-- template_exercises: ordered exercises within a template
CREATE TABLE template_exercises (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id   uuid NOT NULL REFERENCES workout_templates ON DELETE CASCADE,
  exercise_id   uuid NOT NULL REFERENCES exercises ON DELETE RESTRICT,
  "order"       int NOT NULL,
  target_sets   int NOT NULL,
  target_reps   int NOT NULL,
  target_weight numeric,
  notes         text
);
CREATE INDEX ON template_exercises (template_id, "order");

-- workouts: completed workout sessions
CREATE TABLE workouts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  template_id      uuid REFERENCES workout_templates ON DELETE SET NULL,
  template_name    text,  -- snapshot of name at time of workout
  started_at       timestamptz NOT NULL,
  finished_at      timestamptz,
  duration_seconds int
);
CREATE INDEX ON workouts (user_id, started_at DESC);

-- workout_exercises: exercises performed in a workout
CREATE TABLE workout_exercises (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id  uuid NOT NULL REFERENCES workouts ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES exercises ON DELETE RESTRICT,
  "order"     int NOT NULL,
  notes       text
);
CREATE INDEX ON workout_exercises (workout_id, "order");

-- workout_sets: individual sets within a workout exercise
CREATE TABLE workout_sets (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id uuid NOT NULL REFERENCES workout_exercises ON DELETE CASCADE,
  set_number          int NOT NULL,
  weight              numeric NOT NULL DEFAULT 0,
  reps                int NOT NULL DEFAULT 0,
  completed           boolean NOT NULL DEFAULT false
);
CREATE INDEX ON workout_sets (workout_exercise_id, set_number);
