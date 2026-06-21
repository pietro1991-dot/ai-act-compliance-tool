"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ReportData {
  id: string;
  riskCategory: string;
  riskScore: number;
  classification: {
    rationale: string;
    applicableArticles: { article: string; description: string }[];
    obligations: { area: string; description: string; deadline: string }[];
    gaps: { area: string; description: string; severity: string }[];
    priorityActions: { action: string; priority: string }[];
  };
  reportMarkdown: string;
  createdAt: string;
  expiresAt: string;
  isExpired: boolean;
  leadEmail: string | null;
}

const riskConfig: Record<
  string,
  { label: string; color: string; bg: string; border: string; text: string; icon: string }
> = {
  unacceptable: {
    label: "Inaccettabile",
    color: "bg-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    icon: "🔴",
  },
  high: {
    label: "Alto",
    color: "bg-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    icon: "🟠",
  },
  limited: {
    label: "Limitato",
    color: "bg-yellow-500",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    icon: "🟡",
  },
  minimal: {
    label: "Minimo",
    color: "bg-green-500",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    icon: "🟢",
  },
};

function severityConfig(severity: string) {
  switch (severity) {
    case "high":
      return { label: "Alta", color: "bg-red-100 text-red-700 border-red-200" };
    case "medium":
      return {
        label: "Media",
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      };
    case "low":
      return {
        label: "Bassa",
        color: "bg-green-100 text-green-700 border-green-200",
      };
    default:
      return { label: severity, color: "bg-muted text-muted-foreground border-border" };
  }
}

function priorityBadge(priority: string) {
  switch (priority) {
    case "high":
      return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">Alta</Badge>;
    case "medium":
      return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">Media</Badge>;
    case "low":
      return <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">Bassa</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
}

function RiskGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80 ? "#ef4444" : score >= 50 ? "#f97316" : score >= 25 ? "#eab308" : "#22c55e";

  return (
    <div className="relative flex size-32 items-center justify-center">
      <svg className="size-32 -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="oklch(0.92 0.01 260)"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className="absolute text-2xl font-bold">{score}</span>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ReportView({ reportId }: { reportId: string }) {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/report/${reportId}`)
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error("Report non trovato");
          throw new Error("Errore nel caricamento del report");
        }
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [reportId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-6 py-32 text-center">
        <h1 className="text-2xl font-bold">Report non disponibile</h1>
        <p className="mt-2 text-muted-foreground">{error}</p>
        <Link
          href="/questionnaire"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground"
        >
          Nuova valutazione
        </Link>
      </div>
    );
  }

  if (!data) return null;

  const config = riskConfig[data.riskCategory] ?? riskConfig.high;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* DISCLAIMER */}
      <div className="mb-8 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
        <p className="font-medium">⚠️ Valutazione preliminare</p>
        <p className="mt-1 text-xs">
          Questo report è generato automaticamente e non costituisce consulenza
          legale. Per la documentazione di conformità ufficiale, consulta un
          professionista abilitato.
        </p>
      </div>

      {/* EXPIRED WARNING */}
      {data.isExpired && (
        <div className="mb-8 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          <p className="font-medium">Report scaduto</p>
          <p className="mt-1 text-xs">
            Questo report è stato generato il {formatDate(data.createdAt)}. Le
            informazioni potrebbero non essere aggiornate.{" "}
            <Link
              href="/questionnaire"
              className="underline underline-offset-2"
            >
              Avvia una nuova valutazione
            </Link>
          </p>
        </div>
      )}

      {/* HEADER */}
      <div className="mb-10 text-center">
        <Badge
          className={`${config.bg} ${config.text} ${config.border} border px-3 py-1 text-sm`}
        >
          {config.icon} Rischio {config.label}
        </Badge>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          Report di Conformità AI Act
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Generato il {formatDate(data.createdAt)}
        </p>
      </div>

      {/* CLASSIFICAZIONE */}
      <div className="mb-10 grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col items-center justify-center p-8">
          <RiskGauge score={data.riskScore} />
          <p className="mt-4 text-lg font-semibold">
            Rischio {config.label}
          </p>
          <p className="text-sm text-muted-foreground">
            Punteggio: {data.riskScore}/100
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="mb-3 text-lg font-semibold">Perché questa classificazione</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {data.classification.rationale}
          </p>

          {data.classification.applicableArticles.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Articoli applicabili
              </p>
              {data.classification.applicableArticles.map((a, i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-muted/50 p-2.5 text-xs"
                >
                  <span className="font-medium">{a.article}</span>
                  <span className="text-muted-foreground">
                    : {a.description}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* OBBLIGHI */}
      {data.classification.obligations.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">Obblighi Applicabili</h2>
          <div className="grid gap-3">
            {data.classification.obligations.map((o, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm">{o.area}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {o.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-xs">
                    {o.deadline}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* GAP ANALYSIS */}
      {data.classification.gaps.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">Gap Analysis</h2>
          <div className="grid gap-3">
            {data.classification.gaps.map((g, i) => {
              const sev = severityConfig(g.severity);
              return (
                <Card key={i} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm">{g.area}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {g.description}
                      </p>
                    </div>
                    <Badge className={`shrink-0 text-xs ${sev.color}`}>
                      {sev.label}
                    </Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* AZIONI PRIORITARIE */}
      {data.classification.priorityActions.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">Azioni Prioritarie</h2>
          <div className="space-y-3">
            {data.classification.priorityActions.map((a, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm">{a.action}</p>
                </div>
                <div className="shrink-0">{priorityBadge(a.priority)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORT MARKDOWN */}
      {data.reportMarkdown && (
        <div className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">Report Dettagliato</h2>
          <Card className="p-6">
            <div className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-pre:bg-muted prose-pre:text-muted-foreground">
              {data.reportMarkdown.split("\n").map((line, i) => {
                if (line.startsWith("### ")) {
                  return (
                    <h3 key={i} className="mt-6 mb-2 text-base font-semibold">
                      {line.replace("### ", "")}
                    </h3>
                  );
                }
                if (line.startsWith("## ")) {
                  return (
                    <h2 key={i} className="mt-8 mb-3 text-lg font-bold">
                      {line.replace("## ", "")}
                    </h2>
                  );
                }
                if (line.startsWith("- ")) {
                  return (
                    <li key={i} className="ml-4 text-sm text-muted-foreground list-disc">
                      {line.replace("- ", "")}
                    </li>
                  );
                }
                if (line.trim() === "") return <br key={i} />;
                return (
                  <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                    {line}
                  </p>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* DOWNLOAD */}
      <div className="mb-10 flex justify-center">
        <Button
          variant="outline"
          onClick={() => {
            const blob = new Blob([data.reportMarkdown], {
              type: "text/markdown",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `ai-act-report-${data.id.slice(0, 8)}.md`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Scarica report (.md)
        </Button>
      </div>

      {/* CTA CONSULENZA */}
      <Card className="border-primary/20 bg-primary/5 p-8 text-center">
        <h2 className="text-xl font-semibold">
          Questo è solo il primo passo
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
          La classificazione e la gap analysis ti danno una direzione, ma la
          documentazione di conformità completa richiede un lavoro approfondito.
          Abbiamo preparato un pacchetto di consulenza dedicato.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground"
          >
            Prenota una call gratuita
          </Link>
          <Link
            href="/questionnaire"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-medium"
          >
            Nuova valutazione
          </Link>
        </div>
      </Card>
    </div>
  );
}
