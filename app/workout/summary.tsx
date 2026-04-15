import { useWorkout } from "@/lib/WorkoutContext";
import { formatDuration, getExerciseById } from "@/lib/mockData";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function totalVolume(sets: { weight: number; reps: number; completed: boolean }[]): number {
  return sets
    .filter((s) => s.completed)
    .reduce((acc, s) => acc + s.weight * s.reps, 0);
}

export default function WorkoutSummaryScreen() {
  const { completedWorkout, discardWorkout } = useWorkout();

  if (!completedWorkout) {
    return null;
  }

  const workout = completedWorkout;
  const completedSets = workout.exercises
    .flatMap((e) => e.sets)
    .filter((s) => s.completed).length;
  const volume = workout.exercises
    .flatMap((e) => e.sets)
    .reduce((acc, s) => (s.completed ? acc + s.weight * s.reps : acc), 0);

  function handleDone() {
    discardWorkout();
    router.dismissAll();
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={workout.exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            {/* Congrats header */}
            <View style={styles.congrats}>
              <View style={styles.trophyCircle}>
                <Ionicons name="trophy" size={36} color="#FFD60A" />
              </View>
              <Text style={styles.congratsTitle}>Workout Complete!</Text>
              <Text style={styles.congratsSubtitle}>
                {workout.templateName ?? "Custom Workout"}
              </Text>
            </View>

            {/* Stats row */}
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
          </View>
        }
        renderItem={({ item }) => {
          const exercise = getExerciseById(item.exerciseId);
          const completed = item.sets.filter((s) => s.completed);
          return (
            <View style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{exercise?.name ?? "Unknown"}</Text>
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
              {completed.length === 0 && (
                <Text style={styles.noSets}>No sets completed</Text>
              )}
            </View>
          );
        }}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleDone}
          activeOpacity={0.85}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  list: { padding: 16 },
  congrats: {
    alignItems: "center",
    paddingVertical: 24,
  },
  trophyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2C2C2E",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  congratsTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  congratsSubtitle: {
    fontSize: 16,
    color: "#8E8E93",
  },
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
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
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
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "#000000",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#2C2C2E",
  },
  doneButton: {
    backgroundColor: "#007AFF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
