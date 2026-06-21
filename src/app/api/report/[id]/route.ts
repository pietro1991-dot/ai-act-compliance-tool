import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Props) {
  try {
    const { id } = await params;

    const report = await prisma.sessionReport.findUnique({
      where: { id },
      include: { lead: { select: { email: true, name: true } } },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Report non trovato" },
        { status: 404 },
      );
    }

    const isExpired = new Date() > new Date(report.expiresAt);

    // Marca come visualizzato
    if (!report.viewedAt) {
      await prisma.sessionReport.update({
        where: { id },
        data: { viewedAt: new Date() },
      });
    }

    return NextResponse.json({
      id: report.id,
      riskCategory: report.riskCategory,
      riskScore: report.riskScore,
      classification: JSON.parse(report.classificationJson),
      reportMarkdown: report.reportMarkdown,
      createdAt: report.createdAt.toISOString(),
      expiresAt: report.expiresAt.toISOString(),
      isExpired,
      leadEmail: report.lead?.email ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore sconosciuto";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
