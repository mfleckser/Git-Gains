import { ANNOTATION_META } from "@/app/workout/exercise/AnnotationSelector";
import { formatDuration, getExercises } from "@/lib/api";
import type { Exercise, Workout } from "@/lib/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export function WorkoutStats({ workout }: { workout: Workout }) {
  const [exerciseMap, setExerciseMap] = useState<Map<string, Exercise>>(new Map());

  useEffect(() => {
    getExercises().then((exs) => setExerciseMap(new Map(exs.map((e) => [e.id, e]))));
  }, []);

  const completedSets = workout.exercises
    .flatMap((e) => e.sets)
    .filter((s) => s.completed).length;
  const volume = workout.exercises
    .flatMap((e) => e.sets)
    .reduce((acc, s) => (s.completed ? acc + s.weight * s.reps : acc), 0);

  return (
    <View>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {workout.durationSeconds != null
              ? formatDuration(workout.durationSeconds)
              : "—"}
          </Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{completedSets}</Text>
          <Text style={styles.statLabel}>Sets</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {volume > 0 ? `${volume.toLocaleString()} lbs` : "—"}
          </Text>
          <Text style={styles.statLabel}>Volume</Text>
        </View>
      </View>

      <Text style={styles.sectionHeader}>Exercises</Text>

      {workout.exercises.map((item) => {
        const exercise = exerciseMap.get(item.exerciseId);
        const completedCount = item.sets.filter((s) => s.completed).length;
        return (
          <View key={item.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName}>{exercise?.name ?? "Unknown"}</Text>
              {item.annotation !== "stay" && (
                <Ionicons
                  name={ANNOTATION_META[item.annotation].icon}
                  size={18}
                  color={ANNOTATION_META[item.annotation].color}
                />
              )}
            </View>
            {item.sets.map((s) => (
              <View key={s.id} style={styles.setRow}>
                <Text style={styles.setLabel}>Set {s.setNumber}</Text>
                <Text style={[styles.setData, !s.completed && styles.setSkipped]}>
                  {s.completed
                    ? `${s.weight > 0 ? `${s.weight} lbs × ` : "BW × "}${s.reps} reps`
                    : "Skipped"}
                </Text>
              </View>
            ))}
            {completedCount === 0 && (
              <Text style={styles.noSets}>No sets completed</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 36,
    backgroundColor: "#2C2C2E",
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  exerciseCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  setRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  setLabel: {
    fontSize: 14,
    color: "#8E8E93",
  },
  setData: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  setSkipped: {
    color: "#48484A",
    fontStyle: "italic",
  },
  noSets: {
    fontSize: 14,
    color: "#48484A",
    fontStyle: "italic",
  },
});
