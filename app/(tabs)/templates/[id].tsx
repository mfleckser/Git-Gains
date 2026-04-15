import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { TouchableOpacity, Text, Alert } from "react-native";
import { TEMPLATES } from "@/lib/mockData";
import TemplateForm from "./TemplateForm";

export default function TemplateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const template = TEMPLATES.find((t) => t.id === id);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: template?.name ?? "Template" });
  }, [template?.name]);

  if (!template) {
    return null;
  }

  return <TemplateForm initialTemplate={template} />;
}
