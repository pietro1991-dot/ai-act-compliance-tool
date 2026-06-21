import { ReportView } from "@/components/report/report-view";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Report AI Act — Risultato valutazione",
  description:
    "Report di conformità AI Act con classificazione di rischio, gap analysis e azioni prioritarie.",
};

export default async function ReportPage({ params }: Props) {
  const { id } = await params;

  return <ReportView reportId={id} />;
}
