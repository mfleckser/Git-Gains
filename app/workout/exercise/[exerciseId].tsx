import AnnotationSelector, { ANNOTATION_META } from "@/app/workout/exercise/AnnotationSelector";
import { useAppData } from "@/lib/AppDataContext";
import { useWorkout } from "@/lib/WorkoutContext";
import { getLastWorkoutExercise } from "@/lib/api";
import type { WorkoutExercise, WorkoutSet } from "@/lib/types";
import { kgToLb, lbToKg, roundTenth } from "@/lib/units";
import { Ionicons } from "@expo/vector-icons";
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
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
  Vibration,
  View,
} from "react-native";

function SetRow({
  set,
  workoutExerciseId,
  useKg,
  resetRestTimer
}: {
  set: WorkoutSet;
  workoutExerciseId: string;
  useKg: boolean,
  resetRestTimer: () => void
}) {
  const { updateSet, toggleSetComplete } = useWorkout();
  const [weightText, setWeightText] = useState("");
  const [repsText, setRepsText] = useState("");

  useEffect(() => {
    if (set.completed) {
      if (set.weight !== 0) {
        setWeightText(set.weight.toString());
      }
      if (set.reps !== 0) {
        setRepsText(set.reps.toString());
      }
    }
  });

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
          value={repsText}
          onChangeText={setRepsText}
          keyboardType="number-pad"
          placeholder="0"
          placeholderTextColor="#48484A"
          selectTextOnFocus
        />
        <Text style={styles.inputLabel}>reps</Text>
      </View>

      <TouchableOpacity
        style={[styles.checkButton, set.completed && styles.checkButtonDone]}
        onPress={() => {
          toggleSetComplete(workoutExerciseId, set.id);
          if (!set.completed) {
            resetRestTimer();
            const weight = parseFloat(weightText);
            const lbsWeight = useKg ? roundTenth(kgToLb(weight)) : weight;
            updateSet(workoutExerciseId, set.id, "weight", isNaN(lbsWeight) ? 0 : lbsWeight);
            const reps = parseInt(repsText, 10);
            updateSet(workoutExerciseId, set.id, "reps", isNaN(reps) ? 0 : reps);
          }
        }}
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

const completeSound = require("../../../assets/audio/rest_complete.mp3");
setAudioModeAsync({
  playsInSilentMode: true,
  shouldPlayInBackground: true,
  interruptionMode: 'duckOthers'
});

export default function ExerciseScreen() {
  const REST_TIME_S = 180;

  const { exerciseId: workoutExerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const { active, addSet, setNotes } = useWorkout();
  const { exerciseMap } = useAppData();
  const [lastTime, setLastTime] = useState<WorkoutExercise | null>(null);
  const [notesText, setNotesText] = useState("");
  const [useKg, setUseKg] = useState(false);
  const [restTimerPaused, setRestTimerPaused] = useState(true);
  const [restSeconds, setRestSeconds] = useState(REST_TIME_S);
  const player = useAudioPlayer(completeSound);

  const workoutExercise = active?.workout.exercises.find(
    (e) => e.id === workoutExerciseId
  );
  const exercise = workoutExercise ? exerciseMap.get(workoutExercise.exerciseId) : undefined;


  useEffect(() => {
    if (!workoutExercise) return;
    getLastWorkoutExercise(workoutExercise.exerciseId).then(setLastTime);

    // Initialize set notes
    const prevNotes = workoutExercise?.notes;
    if (prevNotes) setNotesText(prevNotes);
  }, [workoutExercise?.exerciseId]);

  useEffect(() => {
    const intervalRef = setInterval(() => {
      if (!restTimerPaused)
        setRestSeconds(prev => {
        if (prev <= 1) {
          setRestTimerPaused(true);
          if (prev === 1) {
            Vibration.vibrate([800, 800, 800]);
            player.seekTo(0);
            player.play();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000)

    return () => {
      clearInterval(intervalRef);
    };
  }, [restTimerPaused]);

  const resetRestTimer = () => {
    setRestTimerPaused(false);
    setRestSeconds(REST_TIME_S);
  }

  const formatTime = (seconds: number) => { return `${Math.floor(restSeconds / 60)}:${String(restSeconds % 60).padStart(2, "0")}` };

  const onEditNotes = (v: string) => {
    setNotes(workoutExerciseId, v);
    setNotesText(v);
  }

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
                    {lastTime.notes && <Text style={styles.lastTimeNotes}>Notes: {lastTime.notes}</Text>}
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
              <SetRow set={item} workoutExerciseId={workoutExerciseId} useKg={useKg} resetRestTimer={resetRestTimer} />
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
          <TextInput
            value={notesText}
            onChangeText={onEditNotes}
            multiline
            numberOfLines={3}
            style={styles.notesTextInput}
            placeholder="Exercise notes..."
            placeholderTextColor={"grey"}
          />
          <View style={styles.restTimerContainer}>
            <TouchableOpacity
              onPress={() => {setRestTimerPaused(prev => !prev)}}
              activeOpacity={0.7}
            >
              <Ionicons name={restTimerPaused ? "play" : "pause"} size={16} style={styles.restTimerPauseButton}/>
            </TouchableOpacity>
            <Text style={styles.restTimerText}>{formatTime(restSeconds)}</Text>
            <TouchableOpacity
              onPress={() => setRestSeconds(prev => prev + 15)}
              activeOpacity={0.7}
            >
              <Text style={styles.increaseTimerButton}>+15</Text>
            </TouchableOpacity>
          </View>
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
  list: { padding: 16, paddingBottom: 0 },
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
  lastTimeNotes: {
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#48484A"
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
  notesTextInput: {
    marginHorizontal: 16,
    padding: 4,
    borderRadius: 4,
    backgroundColor: "#E3E3EA",
    fontSize: 15,
    height: 64
  },
  restTimerContainer: {
    display: "flex",
    flexDirection: "row",
    margin: 15,
    width: "40%",
    backgroundColor: "#2C2C2E",
    borderRadius: 999,
    padding: 3
  },
  restTimerPauseButton: {
    color: "#007AFF",
    marginHorizontal: 10
  },
  restTimerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: "#007AFF",
    fontWeight: 500,
    borderLeftWidth: 1,
    borderRightWidth: 1
  },
  increaseTimerButton: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: 300,
    marginHorizontal: 10
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
