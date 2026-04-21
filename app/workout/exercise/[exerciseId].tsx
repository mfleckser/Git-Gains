import AnnotationSelector, { ANNOTATION_META } from "@/app/workout/exercise/AnnotationSelector";
import { useAppData } from "@/lib/AppDataContext";
import { useWorkout } from "@/lib/WorkoutContext";
import { getLastWorkoutExercise } from "@/lib/api";
import type { WorkoutExercise, WorkoutSet } from "@/lib/types";
import { kgToLb, lbToKg, roundTenth } from "@/lib/units";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function SetRow({
  set,
  workoutExerciseId,
  useKg
}: {
  set: WorkoutSet;
  workoutExerciseId: string;
  useKg: boolean
}) {
  const { updateSet, toggleSetComplete } = useWorkout();
  const [weightText, setWeightText] = useState("");

  return (
    <View style={[styles.setRow, set.completed && styles.setRowCompleted]}>
      <View style={styles.setNumber}>
        <Text style={styles.setNumberText}>{set.setNumber}</Text>
      </View>

      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          value={weightText}
          onChangeText={setWeightText}
          onEndEditing={(e) => {
            const n = parseFloat(weightText);
            const lbsWeight = useKg ? roundTenth(kgToLb(n)) : n;
            updateSet(workoutExerciseId, set.id, "weight", isNaN(n) ? 0 : lbsWeight);
            setWeightText(isNaN(n) || n === 0 ? "" : String(n));
          }}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor="#48484A"
          selectTextOnFocus
        />
        <Text style={styles.inputLabel}>{useKg ? "kgs" : "lbs"}</Text>
      </View>

      <Text style={styles.separator}>×</Text>

      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          value={set.reps === 0 ? "" : String(set.reps)}
          onChangeText={(v) => {
            const n = parseInt(v, 10);
            updateSet(workoutExerciseId, set.id, "reps", isNaN(n) ? 0 : n);
          }}
          keyboardType="number-pad"
          placeholder="0"
          placeholderTextColor="#48484A"
          selectTextOnFocus
        />
        <Text style={styles.inputLabel}>reps</Text>
      </View>

      <TouchableOpacity
        style={[styles.checkButton, set.completed && styles.checkButtonDone]}
        onPress={() => toggleSetComplete(workoutExerciseId, set.id)}
        activeOpacity={0.7}
      >
        {set.completed ? (
          <Ionicons name="checkmark" size={18} color="#FFFFFF" />
        ) : (
          <Ionicons name="checkmark" size={18} color="#48484A" />
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function ExerciseScreen() {
  const { exerciseId: workoutExerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const { active, addSet } = useWorkout();
  const { exerciseMap } = useAppData();
  const [lastTime, setLastTime] = useState<WorkoutExercise | null>(null);
  const [useKg, setUseKg] = useState(false);

  const workoutExercise = active?.workout.exercises.find(
    (e) => e.id === workoutExerciseId
  );
  const exercise = workoutExercise ? exerciseMap.get(workoutExercise.exerciseId) : undefined;

  useEffect(() => {
    if (!workoutExercise) return;
    getLastWorkoutExercise(workoutExercise.exerciseId).then(setLastTime);
  }, [workoutExercise?.exerciseId]);

  if (!workoutExercise || !active) return null;

  return (
    <>
      <Stack.Screen options={{ title: exercise?.name ?? "Exercise" }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <SafeAreaView style={styles.container}>
          <FlatList
            data={workoutExercise.sets}
            keyExtractor={(s) => s.id}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              <View>
                {/* Last time card */}
                {lastTime && lastTime.sets.length > 0 && (
                  <View style={styles.lastTimeCard}>
                    <View style={styles.lastTimeHeader}>
                      <Text style={styles.lastTimeTitle}>Last Time</Text>
                      {lastTime.annotation !== "stay" && (
                        <Ionicons
                          name={ANNOTATION_META[lastTime.annotation].icon}
                          size={18}
                          color={ANNOTATION_META[lastTime.annotation].color}
                        />
                      )}
                    </View>
                    {lastTime.sets.map((s) => (
                      <Text key={s.id} style={styles.lastTimeSet}>
                        Set {s.setNumber}: {s.weight > 0 ? `${useKg ? roundTenth(lbToKg(s.weight)) : s.weight} ${useKg ? "kgs" : "lbs"} × ` : "BW × "}
                        {s.reps} reps
                      </Text>
                    ))}
                  </View>
                )}

                {/* Column headers */}
                <View style={styles.columnHeaders}>
                  <Text style={[styles.columnHeader, styles.colSet]}>Set</Text>
                  <Text style={[styles.columnHeader, styles.colWeight]}>Weight</Text>
                  <Text style={styles.separator} />
                  <Text style={[styles.columnHeader, styles.colReps]}>Reps</Text>
                  <Text style={[styles.columnHeader, styles.colDone]}></Text>
                </View>
              </View>
            }
            renderItem={({ item }) => (
              <SetRow set={item} workoutExerciseId={workoutExerciseId} useKg={useKg} />
            )}
            ListFooterComponent={
              <TouchableOpacity
                style={styles.addSetButton}
                onPress={() => addSet(workoutExerciseId)}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={18} color="#007AFF" />
                <Text style={styles.addSetText}>Add Set</Text>
              </TouchableOpacity>
            }
          />
          <AnnotationSelector workoutExerciseId={workoutExerciseId} />
          <View style={styles.unitsContainer}>
            <TouchableOpacity onPress={() => setUseKg(false)}>
              <Text style={useKg ? styles.unitTextUnselected : styles.unitTextSelected}>lbs</Text>
            </TouchableOpacity>
            <Switch 
              style={styles.unitSwitch}
              trackColor={{false: "#3F3F3F", true: "#3F3F3F"}}
              ios_backgroundColor="#3F3F3F"
              onValueChange={(v) => {
                setUseKg(v);
              }}
              value={useKg}
            />
            <TouchableOpacity onPress={() => setUseKg(true)}>
              <Text style={useKg ? styles.unitTextSelected : styles.unitTextUnselected}>kgs</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  list: { padding: 16, paddingBottom: 40 },
  lastTimeCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
  },
  lastTimeHeader: {
    flexDirection: "row",
    gap: 8
  },
  lastTimeTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007AFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  lastTimeSet: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 2,
  },
  columnHeaders: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  columnHeader: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  colSet: { width: 36, textAlign: "center" },
  colWeight: { flex: 1, textAlign: "center" },
  colReps: { flex: 1, textAlign: "center" },
  colDone: { width: 44 },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    gap: 8,
  },
  setRowCompleted: {
    opacity: 0.6,
  },
  setNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2C2C2E",
    alignItems: "center",
    justifyContent: "center",
  },
  setNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  inputGroup: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#FFFFFF",
    fontSize: 16,
    width: 60,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 12,
    width: 25,
    color: "#48484A",
  },
  separator: {
    fontSize: 16,
    color: "#48484A",
    paddingHorizontal: 2,
  },
  checkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#48484A",
    alignItems: "center",
    justifyContent: "center",
  },
  checkButtonDone: {
    backgroundColor: "#30D158",
    borderColor: "#30D158",
  },
  addSetButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
    paddingVertical: 14,
  },
  addSetText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  unitsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  unitSwitch: {
    alignSelf: "center",
    margin: 10,
  },
  unitTextSelected: {
    fontSize: 18,
    fontWeight: "500",
    color: "#30D158"
  },
  unitTextUnselected: {
    fontSize: 18,
    fontWeight: "500",
    color: "#A0A0A0"
  }
});
