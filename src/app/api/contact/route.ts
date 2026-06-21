import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, phone, message } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email obbligatoria" },
        { status: 400 },
      );
    }

    const notes = `[Richiesta consulenza]${phone ? ` Tel: ${phone}.` : ""}${message ? ` Msg: ${message}.` : ""}`;

    const lead = await prisma.lead.create({
      data: {
        email,
        name: name ?? null,
        source: "contact",
        notes,
      },
    });

    return NextResponse.json({ leadId: lead.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore sconosciuto";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
