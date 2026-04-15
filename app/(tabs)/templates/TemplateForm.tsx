import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { EXERCISES, TEMPLATES } from "@/lib/mockData";
import type { WorkoutTemplate, TemplateExercise } from "@/lib/types";

type Props = {
  initialTemplate?: WorkoutTemplate;
};

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export default function TemplateForm({ initialTemplate }: Props) {
  const [name, setName] = useState(initialTemplate?.name ?? "");
  const [notes, setNotes] = useState(initialTemplate?.notes ?? "");
  const [exercises, setExercises] = useState<TemplateExercise[]>(
    initialTemplate?.exercises ?? []
  );
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  function handleSave() {
    if (!name.trim()) {
      Alert.alert("Name required", "Please enter a template name.");
      return;
    }

    const now = new Date().toISOString();
    const saved: WorkoutTemplate = {
      id: initialTemplate?.id ?? generateId(),
      name: name.trim(),
      notes: notes.trim() || undefined,
      exercises,
      createdAt: initialTemplate?.createdAt ?? now,
      updatedAt: now,
    };

    if (initialTemplate) {
      const idx = TEMPLATES.findIndex((t) => t.id === initialTemplate.id);
      if (idx !== -1) TEMPLATES[idx] = saved;
    } else {
      TEMPLATES.push(saved);
    }

    router.back();
  }

  function handleRemoveExercise(order: number) {
    setExercises((prev) =>
      prev
        .filter((e) => e.order !== order)
        .map((e, i) => ({ ...e, order: i }))
    );
  }

  function handleUpdateSets(order: number, value: string) {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1) return;
    setExercises((prev) =>
      prev.map((e) => (e.order === order ? { ...e, targetSets: num } : e))
    );
  }

  function handleUpdateReps(order: number, value: string) {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1) return;
    setExercises((prev) =>
      prev.map((e) => (e.order === order ? { ...e, targetReps: num } : e))
    );
  }

  function handleAddExercise(exerciseId: string) {
    setExercises((prev) => [
      ...prev,
      {
        exerciseId,
        order: prev.length,
        targetSets: 3,
        targetReps: 10,
      },
    ]);
    setShowExercisePicker(false);
  }

  const exerciseName = (id: string) =>
    EXERCISES.find((e) => e.id === id)?.name ?? id;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={exercises}
        keyExtractor={(item) => String(item.order)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Push Day"
              placeholderTextColor="#48484A"
            />
            <Text style={styles.label}>Notes (optional)</Text>
            <TextInput
              style={[styles.nameInput, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any notes about this template…"
              placeholderTextColor="#48484A"
              multiline
            />
            <Text style={styles.sectionHeader}>Exercises</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.exerciseRow}>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exerciseName(item.exerciseId)}</Text>
              <View style={styles.setRepRow}>
                <Text style={styles.setRepLabel}>Sets</Text>
                <TextInput
                  style={styles.setRepInput}
                  value={String(item.targetSets)}
                  onChangeText={(v) => handleUpdateSets(item.order, v)}
                  keyboardType="number-pad"
                  selectTextOnFocus
                />
                <Text style={styles.setRepLabel}>Reps</Text>
                <TextInput
                  style={styles.setRepInput}
                  value={String(item.targetReps)}
                  onChangeText={(v) => handleUpdateReps(item.order, v)}
                  keyboardType="number-pad"
                  selectTextOnFocus
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => handleRemoveExercise(item.order)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="remove-circle" size={22} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          <View>
            <TouchableOpacity
              style={styles.addExerciseButton}
              onPress={() => setShowExercisePicker(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={18} color="#007AFF" />
              <Text style={styles.addExerciseText}>Add Exercise</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Text style={styles.saveButtonText}>Save Template</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <Modal
        visible={showExercisePicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowExercisePicker(false)}
      >
        <SafeAreaView style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Add Exercise</Text>
            <TouchableOpacity onPress={() => setShowExercisePicker(false)}>
              <Text style={styles.pickerClose}>Done</Text>
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
  list: { padding: 16, paddingBottom: 40 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  nameInput: {
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    padding: 14,
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 16,
  },
  notesInput: {
    minHeight: 72,
    textAlignVertical: "top",
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  exerciseRow: {
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  exerciseInfo: { flex: 1 },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  setRepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  setRepLabel: {
    fontSize: 14,
    color: "#8E8E93",
  },
  setRepInput: {
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: "#FFFFFF",
    fontSize: 15,
    width: 44,
    textAlign: "center",
  },
  addExerciseButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 14,
    justifyContent: "center",
  },
  addExerciseText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
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
  pickerClose: { fontSize: 17, color: "#007AFF" },
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
