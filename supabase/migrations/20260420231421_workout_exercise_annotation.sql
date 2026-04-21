CREATE TYPE exercise_annotation AS ENUM ('down', 'stay', 'up');

ALTER TABLE workout_exercises
  ADD COLUMN annotation exercise_annotation NOT NULL DEFAULT 'stay';
