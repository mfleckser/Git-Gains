import { getTemplateById } from "@/lib/api";
import type { WorkoutTemplate } from "@/lib/types";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import TemplateForm from "./TemplateForm";

export default function TemplateDetailScreen() {
  const { templateId } = useLocalSearchParams<{ templateId: string }>();
  const [template, setTemplate] = useState<WorkoutTemplate | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    getTemplateById(templateId).then((t) => {
      setTemplate(t);
      navigation.setOptions({ title: t?.name ?? "Template" });
    });
  }, [templateId]);

  if (!template) return null;

  return <TemplateForm initialTemplate={template} />;
}
