import { useWorkout } from "@/lib/WorkoutContext";
import { EXERCISES, getExerciseById } from "@/lib/mockData";
import type { WorkoutExercise } from "@/lib/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function useElapsed(startedAt: Date): string {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function ExerciseRow({ we, onPress }: { we: WorkoutExercise; onPress: () => void }) {
  const exercise = getExerciseById(we.exerciseId);
  const completedSets = we.sets.filter((s) => s.completed).length;
  const totalSets = we.sets.length;
  const progress = totalSets > 0 ? completedSets / totalSets : 0;
  const done = completedSets === totalSets && totalSets > 0;

  return (
    <TouchableOpacity style={styles.exerciseRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.exerciseLeft}>
        <View style={[styles.doneBadge, done && styles.doneBadgeActive]}>
          {done && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
        </View>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{exercise?.name ?? "Unknown"}</Text>
          <Text style={styles.exerciseSets}>
            {completedSets} / {totalSets} sets
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#48484A" />
    </TouchableOpacity>
  );
}

export default function ActiveWorkoutScreen() {
  const { active, completedWorkout, addExercise, finishWorkout, discardWorkout } = useWorkout();
  const [showAddExercise, setShowAddExercise] = useState(false);
  const elapsed = useElapsed(active?.startedAt ?? new Date());

  if (!active) {
    return null;
  }

  const { workout } = active;

  function handleCancel() {
    Alert.alert(
      "Cancel Workout?",
      "Your progress will not be saved.",
      [
        { text: "Keep Going", style: "cancel" },
        {
          text: "Cancel Workout",
          style: "destructive",
          onPress: () => {
            discardWorkout();
            router.dismissAll();
          },
        },
      ]
    );
  }

  function handleFinish() {
    const completedSets = workout.exercises
      .flatMap((e) => e.sets)
      .filter((s) => s.completed).length;

    Alert.alert(
      "Finish Workout?",
      completedSets === 0
        ? "You haven't logged any sets. Are you sure you want to finish?"
        : `You've completed ${completedSets} sets across ${workout.exercises.length} exercises.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Finish",
          style: "default",
          onPress: () => {
            finishWorkout();
            router.replace("/workout/summary");
          },
        },
      ]
    );
  }

  function handleAddExercise(exerciseId: string) {
    addExercise(exerciseId);
    setShowAddExercise(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.workoutTitle}>
            {workout.templateName ?? "Custom Workout"}
          </Text>
          <Text style={styles.timer}>{elapsed}</Text>
        </View>
        <TouchableOpacity onPress={handleCancel} activeOpacity={0.7}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={workout.exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ExerciseRow
            we={item}
            onPress={() => router.push(`/workout/exercise/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No exercises yet.</Text>
            <Text style={styles.emptySubtext}>Tap "Add Exercise" to get started.</Text>
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addExerciseButton}
            onPress={() => setShowAddExercise(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={18} color="#007AFF" />
            <Text style={styles.addExerciseText}>Add Exercise</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.finishButton}
          onPress={handleFinish}
          activeOpacity={0.85}
        >
          <Text style={styles.finishButtonText}>Finish Workout</Text>
        </TouchableOpacity>
      </View>

      {/* Add Exercise Modal */}
      <Modal
        visible={showAddExercise}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddExercise(false)}
      >
        <SafeAreaView style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Add Exercise</Text>
            <TouchableOpacity onPress={() => setShowAddExercise(false)}>
              <Text style={styles.pickerClose}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={EXERCISES}
            keyExtractor={(e) => e.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.pickerRow}
                onPress={() => handleAddExercise(item.id)}
                activeOpacity={0.7}
              >
                <View>
                  <Text style={styles.pickerExerciseName}>{item.name}</Text>
                  <Text style={styles.pickerMuscleGroup}>{item.muscleGroup}</Text>
                </View>
                <Ionicons name="add-circle-outline" size={22} color="#007AFF" />
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#2C2C2E",
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  timer: {
    fontSize: 28,
    fontWeight: "300",
    color: "#007AFF",
    fontVariant: ["tabular-nums"],
    marginTop: 2,
  },
  cancelButton: {
    fontSize: 16,
    color: "#FF3B30",
    fontWeight: "500",
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
  finishButton: {
    backgroundColor: "#30D158",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  finishButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  list: {
    padding: 16,
    paddingBottom: 120,
  },
  exerciseRow: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  exerciseLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  doneBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#48484A",
    alignItems: "center",
    justifyContent: "center",
  },
  doneBadgeActive: {
    backgroundColor: "#30D158",
    borderColor: "#30D158",
  },
  exerciseInfo: { flex: 1 },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  exerciseSets: {
    fontSize: 13,
    color: "#8E8E93",
    marginBottom: 6,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#2C2C2E",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#30D158",
    borderRadius: 2,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8E8E93",
  },
  addExerciseButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
    paddingVertical: 14,
  },
  addExerciseText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  // Picker
  pickerContainer: { flex: 1, backgroundColor: "#000000" },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#2C2C2E",
  },
  pickerTitle: { fontSize: 17, fontWeight: "600", color: "#FFFFFF" },
  pickerClose: { fontSize: 17, color: "#FF3B30" },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#2C2C2E",
  },
  pickerExerciseName: { fontSize: 16, color: "#FFFFFF", marginBottom: 2 },
  pickerMuscleGroup: { fontSize: 13, color: "#8E8E93" },
});
