import { AppDataProvider, useAppData } from "@/lib/AppDataContext";
import { WorkoutProvider } from "@/lib/WorkoutContext";
import { supabase } from "@/lib/supabase";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, View } from "react-native";

function AppReadyGate() {
  const { loading } = useAppData();
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000000", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#007AFF" />
      </View>
    );
  }
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
        <Stack.Screen name="select-template" options={{ title: "Select Template", presentation: "modal" }} />
        <Stack.Screen name="workout" options={{ headerShown: false }} />
      </Stack>
    </WorkoutProvider>
  );
}

export default function RootLayout() {
  const [authReady, setAuthReady] = useState(false);

  const devLogin = async () => {
    await supabase.auth.signInWithPassword({
      email: process.env.EXPO_PUBLIC_USER_EMAIL!,
      password: process.env.EXPO_PUBLIC_USER_PASSWORD!
    });
    setAuthReady(true);
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        setAuthReady(true);
      }
    });
  }, []);

  if (!authReady) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000000", justifyContent: "center", alignItems: "center" }}>
        {/* <ActivityIndicator color="#007AFF" /> */}
        <Button onPress={devLogin} title="Dev Login" />
      </View>
    );
  }

  return (
    <AppDataProvider>
      <AppReadyGate />
    </AppDataProvider>
  );
}
