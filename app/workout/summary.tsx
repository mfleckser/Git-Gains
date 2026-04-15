import { WorkoutStats } from "@/components/WorkoutStats";
import { useWorkout } from "@/lib/WorkoutContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function WorkoutSummaryScreen() {
  const { completedWorkout, discardWorkout } = useWorkout();

  if (!completedWorkout) return null;

  function handleDone() {
    discardWorkout();
    router.dismissAll();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.congrats}>
          <View style={styles.trophyCircle}>
            <Ionicons name="trophy" size={36} color="#FFD60A" />
          </View>
          <Text style={styles.congratsTitle}>Workout Complete!</Text>
          <Text style={styles.congratsSubtitle}>
            {completedWorkout.templateName ?? "Custom Workout"}
          </Text>
        </View>

        <WorkoutStats workout={completedWorkout} />

        <View style={{ height: 100 }} />
      </ScrollView>

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
  scroll: { padding: 16 },
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
    marginBottom: 24,
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
