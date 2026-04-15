import { Stack } from "expo-router";
import { WorkoutProvider } from "@/lib/WorkoutContext";

export default function RootLayout() {
  return (
    <WorkoutProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="workout/select-template"
          options={{ presentation: "modal", title: "Start Workout" }}
        />
        <Stack.Screen name="workout/active" options={{ headerShown: false }} />
        <Stack.Screen name="workout/exercise/[id]" options={{ headerBackTitle: "Workout" }} />
        <Stack.Screen
          name="workout/summary"
          options={{ title: "Workout Complete", headerBackVisible: false }}
        />
      </Stack>
    </WorkoutProvider>
  );
}
