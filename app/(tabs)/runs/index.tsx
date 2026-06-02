import { deleteRun, formatDuration } from "@/lib/api";
import { useAppData } from "@/lib/AppDataContext";
import { Run } from "@/lib/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
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

function formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function formatDistance(distance: number): string {
    return `${distance.toFixed(2)} mi`;
}

function formatPace(distance: number, duration: number): string {
    if (distance <= 0) return "—";
    const secondsPerMile = duration / distance;
    const m = Math.floor(secondsPerMile / 60);
    const s = Math.round(secondsPerMile % 60);
    return `${m}:${s.toString().padStart(2, "0")} /mi`;
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
    easy: { bg: "#1B3B2A", text: "#34C759" },
    hard: { bg: "#3B1B1B", text: "#FF453A" },
    distance: { bg: "#1B2A3B", text: "#0A84FF" },
    interval: { bg: "#3B2F1B", text: "#FF9F0A" },
};

function RunTag({ tag }: { tag: string }) {
    const colors = TAG_COLORS[tag] ?? { bg: "#2C2C2E", text: "#8E8E93" };
    return (
        <View style={[styles.tag, { backgroundColor: colors.bg }]}>
            <Text style={[styles.tagText, { color: colors.text }]}>{tag}</Text>
        </View>
    );
}

function RunRow({ data }: { data: Run }) {
    const {refreshRuns} = useAppData();

    const handleDelete = () => {
        Alert.alert(`Delete run on ${formatDate(data.created_at)}?`, "", [
            {text: "Cancel", style: "cancel"},
            {text: "Delete", style: "destructive", onPress: () => {deleteRun(data.id)}}
        ]);
    }

    return (
        <TouchableOpacity style={styles.card} activeOpacity={1}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{formatDate(data.created_at)}</Text>
                <Text style={styles.cardTime}>{formatTime(data.created_at)}</Text>
            </View>
            <View style={styles.cardStats}>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{formatDistance(data.distance)}</Text>
                    <Text style={styles.statLabel}>distance</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{formatDuration(data.duration)}</Text>
                    <Text style={styles.statLabel}>duration</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>
                        {formatPace(data.distance, data.duration)}
                    </Text>
                    <Text style={styles.statLabel}>pace</Text>
                </View>
            </View>
            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <View style={styles.tagRow}>
                    {data.tag ? (
                        <RunTag tag={data.tag} />
                    ) : null}
                </View>
                <TouchableOpacity onPress={handleDelete} activeOpacity={0.7} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

export default function RunsScreen() {
    const { runs, refreshRuns } = useAppData();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {refreshRuns()}, [runs]);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={runs}
                keyExtractor={(run) => run.id}
                renderItem={({ item }) => <RunRow data={item} />}
                contentContainerStyle={styles.list}
                refreshing={refreshing}
                onRefresh={async () => {
                    setRefreshing(true);
                    await refreshRuns();
                    setRefreshing(false);
                }}
                ListHeaderComponent={
                    <Text style={styles.sectionHeader}>Recent Runs</Text>
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>No runs yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Log your first run to see it here.
                        </Text>
                    </View>
                }
            />
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => {router.push("/(tabs)/runs/new")}}
                    activeOpacity={0.85}
                >
                    <Text style={styles.startButtonText}>Add Run</Text>
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
        marginBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: "#48484A",
        paddingBottom: 8
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    cardTime: {
        fontSize: 13,
        color: "#8E8E93",
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
    tagRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 12,
    },
    tag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    tagText: {
        fontSize: 12,
        fontWeight: "600",
        textTransform: "capitalize",
    },
    deleteButton: {
        justifyContent: "flex-end",
        borderWidth: 1,
        borderColor: "#48484A",
        backgroundColor: "#2C2C2E",
        padding: 6,
        borderRadius: 999
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
