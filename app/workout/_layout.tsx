import { Stack } from "expo-router";

export default function WorkoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1C1C1E" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen name="active" options={{ title: "Active", presentation: "modal" }} />
    </Stack>
  );
}
