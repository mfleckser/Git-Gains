import { WorkoutStats } from "@/components/WorkoutStats";
import { deleteWorkout } from "@/lib/api";
import { useAppData } from "@/lib/AppDataContext";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function WorkoutDetailScreen() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const { workouts, refreshWorkouts } = useAppData();
  const workout = workouts.find((w) => w.id === workoutId) ?? null;

  if (!workout) return null;

  const title = workout.templateName ?? "Custom Workout";
  const date = formatDate(workout.startedAt);

  function handleDelete() {
    Alert.alert(
      "Delete Workout?",
      "This workout will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteWorkout(workoutId).then(() => refreshWorkouts()).catch(console.error);
            router.back();
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Text style={styles.headerTitleText}>{title}</Text>
              <Text style={styles.headerSubtitle}>{date}</Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleDelete} activeOpacity={0.7} style={styles.deleteButton}>
              <View>
                <Ionicons name="trash-outline" size={26} color="#FF3B30" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <WorkoutStats workout={workout} />
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  scroll: { padding: 16 },
  headerTitle: {
    alignItems: "center",
  },
  headerTitleText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 1,
  },
  deleteButton: {
    padding: 5,
  },
});
