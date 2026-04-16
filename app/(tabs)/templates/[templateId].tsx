import { useAppData } from "@/lib/AppDataContext";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import TemplateForm from "./TemplateForm";

export default function TemplateDetailScreen() {
  const { templateId } = useLocalSearchParams<{ templateId: string }>();
  const { templates } = useAppData();
  const navigation = useNavigation();
  const template = templates.find((t) => t.id === templateId) ?? null;

  useEffect(() => {
    if (template) navigation.setOptions({ title: template.name });
  }, [template, navigation]);

  if (!template) return null;

  return <TemplateForm initialTemplate={template} />;
}
