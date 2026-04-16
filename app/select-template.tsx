import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppData } from "@/lib/AppDataContext";
import { useWorkout } from "@/lib/WorkoutContext";

export default function SelectTemplateScreen() {
  const { startWorkout } = useWorkout();
  const { templates, exerciseMap } = useAppData();

  function handleSelectTemplate(template: WorkoutTemplate) {
    startWorkout(template);
    router.replace("/workout/active");
  }

  function handleStartBlank() {
    startWorkout();
    router.replace("/workout/active");
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={templates}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <TouchableOpacity
              style={styles.blankButton}
              onPress={handleStartBlank}
              activeOpacity={0.7}
            >
              <View style={styles.blankIcon}>
                <Ionicons name="add" size={22} color="#007AFF" />
              </View>
              <Text style={styles.blankText}>Start Blank Workout</Text>
              <Ionicons name="chevron-forward" size={18} color="#48484A" />
            </TouchableOpacity>
            <Text style={styles.sectionHeader}>Templates</Text>
          </View>
        }
        renderItem={({ item }) => {
          const exerciseNames = item.exercises
            .slice(0, 3)
            .map((te) => exerciseMap.get(te.exerciseId)?.name ?? "Unknown")
            .join(", ");
          const more =
            item.exercises.length > 3
              ? ` +${item.exercises.length - 3} more`
              : "";

          return (
            <TouchableOpacity
              style={styles.templateRow}
              onPress={() => handleSelectTemplate(item)}
              activeOpacity={0.7}
            >
              <View style={styles.templateInfo}>
                <Text style={styles.templateName}>{item.name}</Text>
                {item.notes && (
                  <Text style={styles.templateNotes} numberOfLines={1}>
                    {item.notes}
                  </Text>
                )}
                <Text style={styles.templateExercises} numberOfLines={1}>
                  {exerciseNames}
                  {more}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#48484A" />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  list: { padding: 16 },
  blankButton: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  blankIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2C2C2E",
    alignItems: "center",
    justifyContent: "center",
  },
  blankText: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  templateRow: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  templateInfo: { flex: 1 },
  templateName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  templateNotes: {
    fontSize: 14,
    color: "#8E8E93",
    fontStyle: "italic",
    marginBottom: 2,
  },
  templateExercises: {
    fontSize: 14,
    color: "#8E8E93",
  },
});
