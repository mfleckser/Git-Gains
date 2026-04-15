import { WorkoutProvider } from "@/lib/WorkoutContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <WorkoutProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#1C1C1E" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "600" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ title: "Home", headerShown: false }} />
        <Stack.Screen name="select-template" options={{ title: "Select Template", presentation: "modal", }} />
        <Stack.Screen name="workout" options={{ headerShown: false }} />
      </Stack>
    </WorkoutProvider>
  );
}
