-- exercises: global exercises readable by all; users can read/write their own
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read" ON exercises FOR SELECT
  USING (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "write" ON exercises FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- workout_templates: users own their templates
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own" ON workout_templates FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- template_exercises: scoped through template ownership
ALTER TABLE template_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own" ON template_exercises FOR ALL
  USING (EXISTS (
    SELECT 1 FROM workout_templates t
    WHERE t.id = template_id AND t.user_id = auth.uid()
  ));

-- workouts: users own their workouts
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own" ON workouts FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- workout_exercises: scoped through workout ownership
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own" ON workout_exercises FOR ALL
  USING (EXISTS (
    SELECT 1 FROM workouts w
    WHERE w.id = workout_id AND w.user_id = auth.uid()
  ));

-- workout_sets: scoped through workout_exercises → workouts
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own" ON workout_sets FOR ALL
  USING (EXISTS (
    SELECT 1 FROM workout_exercises we
    JOIN workouts w ON w.id = we.workout_id
    WHERE we.id = workout_exercise_id AND w.user_id = auth.uid()
  ));
