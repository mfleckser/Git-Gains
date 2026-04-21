import { WorkoutHeatmap } from "@/components/WorkoutHeatmap";
import { formatDuration } from "@/lib/api";
import { useAppData } from "@/lib/AppDataContext";
import type { Exercise, Workout } from "@/lib/types";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function totalSets(workout: Workout): number {
  return workout.exercises.reduce((acc, ex) => acc + ex.sets.filter((s) => s.completed).length, 0);
}

function WorkoutRow({
  workout,
  exerciseMap,
}: {
  workout: Workout;
  exerciseMap: Map<string, Exercise>;
}) {
  const exerciseNames = workout.exercises
    .slice(0, 3)
    .map((we) => exerciseMap.get(we.exerciseId)?.name ?? "Unknown")
    .join(", ");
  const more = workout.exercises.length > 3 ? ` +${workout.exercises.length - 3} more` : "";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/${workout.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          {workout.templateName ?? "Custom Workout"}
        </Text>
        <Text style={styles.cardDate}>{formatDate(workout.startedAt)}</Text>
      </View>
      <Text style={styles.cardExercises} numberOfLines={1}>
        {exerciseNames}
        {more}
      </Text>
      <View style={styles.cardStats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{workout.exercises.length}</Text>
          <Text style={styles.statLabel}>exercises</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{totalSets(workout)}</Text>
          <Text style={styles.statLabel}>sets</Text>
        </View>
        {workout.durationSeconds != null && (
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatDuration(workout.durationSeconds)}</Text>
            <Text style={styles.statLabel}>duration</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { workouts, exerciseMap, refreshWorkouts } = useAppData();
  const [refreshing, setRefreshing] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <WorkoutRow workout={item} exerciseMap={exerciseMap} />}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await refreshWorkouts();
          setRefreshing(false);
        }}
        ListHeaderComponent={
          <>
            <WorkoutHeatmap workouts={workouts} />
            <Text style={styles.sectionHeader}>Recent Workouts</Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No workouts yet</Text>
            <Text style={styles.emptySubtitle}>
              Start your first workout to see it here.
            </Text>
          </View>
        }
      />
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push("/select-template")}
          activeOpacity={0.85}
        >
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cardDate: {
    fontSize: 13,
    color: "#8E8E93",
  },
  cardExercises: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 12,
  },
  cardStats: {
    flexDirection: "row",
    gap: 20,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 1,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#8E8E93",
    textAlign: "center",
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
  startButton: {
    backgroundColor: "#007AFF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
