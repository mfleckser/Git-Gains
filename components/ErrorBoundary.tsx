import * as Sentry from "@sentry/react-native";
import { router } from "expo-router";
import { Component, ReactNode } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  componentDidCatch(error: Error) {
    Sentry.captureException(error);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Button
            title="Reload"
            onPress={() => {
              this.setState({ hasError: false });
              router.dismissAll();
            }}
          />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center", gap: 16 },
  title: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
