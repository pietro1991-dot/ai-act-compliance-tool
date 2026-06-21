import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const report = await prisma.sessionReport.findUnique({ where: { id } });

    if (!report) {
      return NextResponse.json({ error: "Report non trovato" }, { status: 404 });
    }

    const classification = JSON.parse(report.classificationJson);

    const { renderToBuffer } = await import("@react-pdf/renderer");
    const { ReportPdf } = await import("@/components/report/report-pdf");

    const buffer = await renderToBuffer(
      <ReportPdf
        riskCategory={report.riskCategory}
        riskScore={report.riskScore}
        classification={{
          rationale: classification.rationale ?? "",
          applicableArticles: classification.applicableArticles ?? [],
          obligations: classification.obligations ?? [],
          gaps: classification.gaps ?? [],
          priorityActions: classification.priorityActions ?? [],
        }}
        reportMarkdown={report.reportMarkdown}
        createdAt={report.createdAt.toISOString()}
      />,
    );

    await prisma.sessionReport.update({
      where: { id },
      data: { pdfGenerated: true },
    });

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ai-act-report-${id.slice(0, 8)}.pdf"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore sconosciuto";
    console.error("PDF generation error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
