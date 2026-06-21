import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: Props) {
  const { id } = await params;
  if (!id) notFound();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Report</h1>
        <p className="mt-2 text-muted-foreground">Report ID: {id}</p>
      </div>
    </div>
  );
}
