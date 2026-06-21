import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reports = await prisma.sessionReport.findMany({
      orderBy: { createdAt: "desc" },
    });

    const result = reports.map((r) => ({
      id: r.id,
      riskCategory: r.riskCategory,
      riskScore: r.riskScore,
      createdAt: r.createdAt.toISOString(),
      leadEmail: null,
    }));

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore sconosciuto";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
