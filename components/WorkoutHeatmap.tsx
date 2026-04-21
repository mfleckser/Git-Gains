import type { Workout } from "@/lib/types";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const CELL_SIZE = 11;
const CELL_GAP = 3;
const CELL_STEP = CELL_SIZE + CELL_GAP;
const DAY_LABEL_WIDTH = 14;
const DAY_LABEL_MARGIN = 4;
const CARD_PADDING = 16;
const LIST_PADDING = 16;
const MONTH_LABEL_HEIGHT = 18;

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface Props {
  workouts: Workout[];
}

export function WorkoutHeatmap({ workouts }: Props) {
  const { width: windowWidth } = useWindowDimensions();

  const activeDates = new Set(
    workouts.map((w) => toDateKey(new Date(w.startedAt)))
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate how many week columns fit in the available width
  const gridWidth =
    windowWidth -
    LIST_PADDING * 2 -
    CARD_PADDING * 2 -
    DAY_LABEL_WIDTH -
    DAY_LABEL_MARGIN;
  const numWeeks = Math.floor((gridWidth + CELL_GAP) / CELL_STEP);

  // Work backwards from today: start at the Sunday of the first visible week
  const gridEnd = new Date(today);
  const gridStart = new Date(today);
  gridStart.setDate(today.getDate() - today.getDay() - (numWeeks - 1) * 7);

  // startDate is the earliest day shown (may be after gridStart for partial first week)
  const startDate = new Date(gridStart);

  // Build week columns
  const weeks: (Date | null)[][] = [];
  const cursor = new Date(gridStart);

  while (cursor <= gridEnd) {
    const week: (Date | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(cursor);
      day.setDate(cursor.getDate() + d);
      week.push(day <= today ? day : null);
    }
    weeks.push(week);
    cursor.setDate(cursor.getDate() + 7);
  }

  const totalWorkouts = workouts.filter((w) => {
    const d = new Date(w.startedAt);
    d.setHours(0, 0, 0, 0);
    return d >= startDate && d <= today;
  }).length;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <Text style={styles.subtitle}>
          {totalWorkouts} workout{totalWorkouts !== 1 ? "s" : ""} since {formatDate(startDate)}
        </Text>
      </View>

      {/* Heatmap grid */}
      <View style={styles.gridRow}>
        {/* Day labels */}
        <View style={styles.dayLabelsCol}>
          <View style={{ height: MONTH_LABEL_HEIGHT }} />
          {DAY_LABELS.map((label, i) => (
            <View key={i} style={styles.dayLabelCell}>
              {i % 2 === 1 && (
                <Text style={styles.dayLabelText}>{label}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Week columns */}
        <View style={styles.weeksRow}>
          {weeks.map((week, wIndex) => {
            const newMonthDay = week.find((d) => d !== null && d!.getDate() === 1);
            const showMonthLabel =
              wIndex === 0 ||
              (newMonthDay !== undefined &&
                newMonthDay !== null);
            const labelDay =
              newMonthDay ??
              (wIndex === 0 ? week.find((d) => d !== null) : undefined);

            return (
              <View key={wIndex} style={styles.weekCol}>
                <View style={styles.monthLabelBox}>
                  {showMonthLabel && labelDay && (
                    <Text style={styles.monthLabelText}>
                      {MONTH_NAMES[labelDay.getMonth()]}
                    </Text>
                  )}
                </View>
                {week.map((day, dIndex) => {
                  if (day === null) {
                    return <View key={dIndex} style={styles.cellPlaceholder} />;
                  }
                  const active = activeDates.has(toDateKey(day));
                  return (
                    <View
                      key={dIndex}
                      style={[styles.cell, active ? styles.cellOn : styles.cellOff]}
                    />
                  );
                })}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: CARD_PADDING,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 12,
    color: "#8E8E93",
  },
  gridRow: {
    flexDirection: "row",
  },
  dayLabelsCol: {
    width: DAY_LABEL_WIDTH,
    marginRight: DAY_LABEL_MARGIN,
  },
  dayLabelCell: {
    height: CELL_STEP,
    justifyContent: "center",
  },
  dayLabelText: {
    fontSize: 9,
    color: "#8E8E93",
    textAlign: "right",
  },
  weeksRow: {
    flexDirection: "row",
    gap: CELL_GAP,
    flex: 1,
  },
  weekCol: {
    width: CELL_SIZE,
  },
  monthLabelBox: {
    height: MONTH_LABEL_HEIGHT,
    justifyContent: "flex-end",
    paddingBottom: 3,
    width: CELL_SIZE * 2
  },
  monthLabelText: {
    fontSize: 9,
    color: "#8E8E93",
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 2,
    marginBottom: CELL_GAP,
  },
  cellPlaceholder: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    marginBottom: CELL_GAP,
  },
  cellOff: {
    backgroundColor: "#2C2C2E",
  },
  cellOn: {
    backgroundColor: "#30D158",
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 10,
  },
  legendCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 2,
  },
  legendLabel: {
    fontSize: 10,
    color: "#8E8E93",
  },
});
