import { createRun } from "@/lib/api";
import { router } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const TAGS = ["easy", "hard", "distance", "interval"] as const;
type Tag = (typeof TAGS)[number];

const TAG_COLORS: Record<Tag, { bg: string; text: string }> = {
    easy: { bg: "#1B3B2A", text: "#34C759" },
    hard: { bg: "#3B1B1B", text: "#FF453A" },
    distance: { bg: "#1B2A3B", text: "#0A84FF" },
    interval: { bg: "#3B2F1B", text: "#FF9F0A" },
};

export default function NewRunScreen() {
    const [distance, setDistance] = useState("");
    const [minutes, setMinutes] = useState("");
    const [seconds, setSeconds] = useState("");
    const [tag, setTag] = useState<Tag | null>(null);
    const [notes, setNotes] = useState("");

    const handleSave = () => {
        const dist = parseFloat(distance || "0");
        const duration = 60 * parseInt(minutes || "0") + parseInt(seconds || "0");
        createRun(dist, duration, tag || "", notes);
        router.back();
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Distance */}
                    <Text style={styles.label}>Distance</Text>
                    <View style={styles.distanceField}>
                        <TextInput
                            style={styles.distanceInput}
                            value={distance}
                            onChangeText={setDistance}
                            placeholder="0.00"
                            placeholderTextColor="#48484A"
                            keyboardType="decimal-pad"
                            selectTextOnFocus
                        />
                        <Text style={styles.distanceUnit}>mi</Text>
                    </View>

                    {/* Duration */}
                    <Text style={styles.label}>Duration</Text>
                    <View style={styles.durationField}>
                        <View style={styles.durationCol}>
                            <TextInput
                                style={styles.durationInput}
                                value={minutes}
                                onChangeText={setMinutes}
                                placeholder="00"
                                placeholderTextColor="#48484A"
                                keyboardType="number-pad"
                                maxLength={3}
                                selectTextOnFocus
                            />
                            <Text style={styles.durationUnit}>min</Text>
                        </View>
                        <Text style={styles.durationColon}>:</Text>
                        <View style={styles.durationCol}>
                            <TextInput
                                style={styles.durationInput}
                                value={seconds}
                                onChangeText={setSeconds}
                                placeholder="00"
                                placeholderTextColor="#48484A"
                                keyboardType="number-pad"
                                maxLength={2}
                                selectTextOnFocus
                            />
                            <Text style={styles.durationUnit}>sec</Text>
                        </View>
                    </View>

                    {/* Tag */}
                    <Text style={styles.label}>Tag (optional)</Text>
                    <View style={styles.tagRow}>
                        {TAGS.map((t) => {
                            const colors = TAG_COLORS[t];
                            const selected = tag === t;
                            return (
                                <TouchableOpacity
                                    key={t}
                                    activeOpacity={0.7}
                                    onPress={() => setTag(selected ? null : t)}
                                    style={[
                                        styles.tag,
                                        {
                                            backgroundColor: selected
                                                ? colors.bg
                                                : "#1C1C1E",
                                            borderColor: selected
                                                ? colors.text
                                                : "transparent",
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.tagText,
                                            { color: selected ? colors.text : "#8E8E93" },
                                        ]}
                                    >
                                        {t}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Notes */}
                    <Text style={styles.label}>Notes (optional)</Text>
                    <TextInput
                        style={[styles.input, styles.notesInput]}
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="How did the run feel?…"
                        placeholderTextColor="#48484A"
                        multiline
                    />
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.saveButtonText}>Save Run</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    flex: {
        flex: 1,
    },
    scroll: {
        padding: 16,
        paddingBottom: 40,
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
        color: "#8E8E93",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 8,
        marginTop: 8,
    },
    input: {
        backgroundColor: "#1C1C1E",
        borderRadius: 10,
        padding: 14,
        color: "#FFFFFF",
        fontSize: 16,
        marginBottom: 16,
    },
    // Distance
    distanceField: {
        backgroundColor: "#1C1C1E",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "center",
        paddingVertical: 18,
        marginBottom: 16,
    },
    distanceInput: {
        color: "#FFFFFF",
        fontSize: 40,
        fontWeight: "700",
        textAlign: "center",
        minWidth: 120,
        padding: 0,
    },
    distanceUnit: {
        color: "#8E8E93",
        fontSize: 20,
        fontWeight: "600",
        marginLeft: 8,
    },
    // Duration
    durationField: {
        backgroundColor: "#1C1C1E",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        marginBottom: 16,
    },
    durationCol: {
        alignItems: "center",
    },
    durationInput: {
        color: "#FFFFFF",
        fontSize: 40,
        fontWeight: "700",
        textAlign: "center",
        minWidth: 80,
        padding: 0,
    },
    durationUnit: {
        color: "#8E8E93",
        fontSize: 13,
        fontWeight: "600",
        marginTop: 2,
    },
    durationColon: {
        color: "#48484A",
        fontSize: 36,
        fontWeight: "700",
        marginHorizontal: 8,
        marginBottom: 16,
    },
    // Tag
    tagRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 16,
    },
    tag: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
    },
    tagText: {
        fontSize: 14,
        fontWeight: "600",
        textTransform: "capitalize",
    },
    // Notes
    notesInput: {
        minHeight: 96,
        textAlignVertical: "top",
    },
    // Footer
    footer: {
        padding: 16,
        paddingBottom: 32,
        backgroundColor: "#000000",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#2C2C2E",
    },
    saveButton: {
        backgroundColor: "#007AFF",
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "600",
    },
});
