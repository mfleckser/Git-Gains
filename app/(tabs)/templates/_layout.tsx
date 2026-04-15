import { Stack } from "expo-router";

export default function TemplatesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1C1C1E" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Templates" }} />
      <Stack.Screen name="[id]" options={{ title: "Template" }} />
      <Stack.Screen name="new" options={{ title: "New Template" }} />
    </Stack>
  );
}
