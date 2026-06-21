import { QuestionnaireForm } from "@/components/questionnaire/questionnaire-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Valutazione AI Act — Questionario",
  description:
    "Rispondi a 8 domande per scoprire la classificazione di rischio del tuo sistema AI secondo l'AI Act.",
};

export default function QuestionarioPage() {
  return <QuestionnaireForm />;
}
