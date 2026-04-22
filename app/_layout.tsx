import ErrorBoundary from "@/components/ErrorBoundary";
import { AppDataProvider, useAppData } from "@/lib/AppDataContext";
import { WorkoutProvider } from "@/lib/WorkoutContext";
import { supabase } from "@/lib/supabase";
import * as Sentry from "@sentry/react-native";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, View } from "react-native";

Sentry.init({
  dsn: 'https://493cdeae510f976dac02badff2da6577@o4511258875592704.ingest.us.sentry.io/4511258881097728',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

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

export default Sentry.wrap(function RootLayout() {
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
    <ErrorBoundary>
      <AppDataProvider>
        <AppReadyGate />
      </AppDataProvider>
    </ErrorBoundary>
  );
});
