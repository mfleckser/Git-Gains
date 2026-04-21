import { useAppData } from "@/lib/AppDataContext";
import type { Exercise, WorkoutTemplate } from "@/lib/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

function TemplateRow({
  template,
  exerciseMap,
}: {
  template: WorkoutTemplate;
  exerciseMap: Map<string, Exercise>;
}) {
  const exerciseNames = template.exercises
    .slice(0, 3)
    .map((te) => exerciseMap.get(te.exerciseId)?.name ?? "Unknown")
    .join(", ");
  const more =
    template.exercises.length > 3
      ? ` +${template.exercises.length - 3} more`
      : "";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(tabs)/templates/${template.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{template.name}</Text>
        <Ionicons name="chevron-forward" size={18} color="#48484A" />
      </View>
      {template.notes && (
        <Text style={styles.cardNotes} numberOfLines={1}>
          {template.notes}
        </Text>
      )}
      <Text style={styles.cardExercises} numberOfLines={1}>
        {exerciseNames}
        {more}
      </Text>
      <Text style={styles.cardCount}>
        {template.exercises.length}{" "}
        {template.exercises.length === 1 ? "exercise" : "exercises"}
      </Text>
    </TouchableOpacity>
  );
}

export default function TemplatesScreen() {
  const { templates, exerciseMap, refreshTemplates } = useAppData();
  const [refreshing, setRefreshing] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={templates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TemplateRow template={item} exerciseMap={exerciseMap} />}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await refreshTemplates();
          setRefreshing(false);
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No templates yet</Text>
            <Text style={styles.emptySubtitle}>
              Create a template to quickly start a workout.
            </Text>
          </View>
        }
      />
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/(tabs)/templates/new")}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.createButtonText}>Create Template</Text>
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
  cardNotes: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 4,
    fontStyle: "italic",
  },
  cardExercises: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 6,
  },
  cardCount: {
    fontSize: 13,
    color: "#48484A",
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
  createButton: {
    backgroundColor: "#1C1C1E",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
