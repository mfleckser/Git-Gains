import { useWorkout } from "@/lib/WorkoutContext";
import type { Annotation } from "@/lib/types";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const ANNOTATION_META: Record<
    Annotation,
    { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string; color: string }
> = {
    down: { icon: "arrow-down", label: "Down", color: "#FF453A" },
    stay: { icon: "remove", label: "Stay", color: "#8E8E93" },
    up: { icon: "arrow-up", label: "Up", color: "#30D158" },
};

const OPTIONS: Annotation[] = ["down", "stay", "up"];

export default function AnnotationSelector({
    workoutExerciseId,
}: {
    workoutExerciseId: string;
}) {
    const { active, setAnnotation } = useWorkout();
    const we = active?.workout.exercises.find((e) => e.id === workoutExerciseId);
    const selected: Annotation = we?.annotation ?? "stay";

    return (
        <View style={styles.container}>
            {OPTIONS.map((value, i) => {
                const meta = ANNOTATION_META[value];
                const isSelected = selected === value;
                return (
                    <TouchableOpacity
                        key={value}
                        style={[
                            styles.option,
                            i === 0 && styles.optionFirst,
                            i === OPTIONS.length - 1 && styles.optionLast,
                            isSelected && styles.optionSelected,
                        ]}
                        onPress={() => setAnnotation(workoutExerciseId, value)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={meta.icon}
                            size={18}
                            color={isSelected ? "#FFFFFF" : "#8E8E93"}
                        />
                        <Text style={[styles.label, isSelected && styles.labelSelected]}>
                            {meta.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#1C1C1E",
        borderRadius: 12,
        marginBottom: 12,
        marginHorizontal: 16,
        padding: 4,
        gap: 4,
    },
    option: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 10,
        borderRadius: 8,
    },
    optionFirst: {},
    optionLast: {},
    optionSelected: {
        backgroundColor: "#007AFF",
    },
    label: {
        fontSize: 13,
        fontWeight: "500",
        color: "#8E8E93",
    },
    labelSelected: {
        color: "#FFFFFF",
    },
});
