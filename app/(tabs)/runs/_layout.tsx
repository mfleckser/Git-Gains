import { Stack } from "expo-router";

export default function RunsLayout() {
  return (
    <Stack
        screenOptions={{
            headerStyle: { backgroundColor: "#1C1C1E" },
            headerTintColor: "#FFFFFF",
            headerTitleStyle: { fontWeight: "600" },
      }}>
      <Stack.Screen name="index" options={{ title: "Runs", headerShown: false }} />
      <Stack.Screen name="new" options={{ title: "New Run", presentation: "modal"}} />
    </Stack>
  );
}