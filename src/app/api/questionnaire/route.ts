import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { callClaude } from "@/lib/claude";
import {
  buildClassificationPrompt,
  buildReportPrompt,
} from "@/lib/ai-act/prompts";

export async function POST(req: Request) {
  try {
    const answers = await req.json();

    if (!answers.purpose || typeof answers.purpose !== "string" || answers.purpose.trim().length < 10) {
      return NextResponse.json(
        { error: "Descrizione del sistema troppo breve (minimo 10 caratteri)" },
        { status: 400 },
      );
    }

    if (!answers.sector) {
      return NextResponse.json(
        { error: "Settore non selezionato" },
        { status: 400 },
      );
    }

    // Step 1: Classificazione
    const classificationPrompt = buildClassificationPrompt(answers);
    const classificationRaw = await callClaude(classificationPrompt);

    let classification: Record<string, unknown>;
    try {
      classification = JSON.parse(classificationRaw);
    } catch {
      throw new Error("Risposta non valida da Claude. Riprova.");
    }

    if (
      !["unacceptable", "high", "limited", "minimal"].includes(
        classification.riskCategory as string,
      )
    ) {
      classification.riskCategory = "high";
      classification.riskScore = 50;
      classification.rationale =
        "Classificazione automatica di fallback. Il sistema è stato classificato come alto rischio per prudenza.";
      classification.gaps = [
        {
          area: "Classificazione",
          description: "La classificazione automatica non è stata completata. È necessaria una verifica manuale.",
          severity: "high",
        },
      ];
      classification.priorityActions = [
        {
          action: "Richiedi una consulenza personalizzata per la classificazione corretta.",
          priority: "high",
        },
      ];
    }

    // Step 2: Report
    const reportPrompt = buildReportPrompt(
      classification.riskCategory as string,
      (classification.riskScore as number) ?? 50,
      classification.rationale as string,
      (classification.gaps ?? []) as { area: string; description: string; severity: string }[],
      (classification.obligations ?? []) as { area: string; description: string; deadline: string }[],
      (classification.priorityActions ?? []) as { action: string; priority: string }[],
    );

    const reportMarkdown = await callClaude(reportPrompt);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Step 3: Salva su DB
    let leadId: string | undefined;
    if (answers.contactEmail) {
      const lead = await prisma.lead.create({
        data: {
          email: answers.contactEmail,
          source: "questionnaire",
        },
      });
      leadId = lead.id;
    }

    const report = await prisma.sessionReport.create({
      data: {
        questionnaireAnswers: JSON.stringify(answers),
        riskCategory: classification.riskCategory as string,
        riskScore: (classification.riskScore as number) ?? 50,
        classificationJson: JSON.stringify(classification),
        reportMarkdown,
        leadId: leadId ?? null,
        expiresAt,
      },
    });

    return NextResponse.json({ reportId: report.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore sconosciuto";
    console.error("Questionnaire error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
