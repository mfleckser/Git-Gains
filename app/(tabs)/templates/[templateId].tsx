import { TEMPLATES } from "@/lib/mockData";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import TemplateForm from "./TemplateForm";

export default function TemplateDetailScreen() {
  const { templateId } = useLocalSearchParams<{ templateId: string }>();
  const template = TEMPLATES.find((t) => t.id === templateId);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: template?.name ?? "Template" });
  }, [template?.name]);

  if (!template) {
    return null;
  }

  return <TemplateForm initialTemplate={template} />;
}
