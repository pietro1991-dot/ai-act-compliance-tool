"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Lead {
  id: string;
  email: string | null;
  name: string | null;
  source: string;
  hasBookedCall: boolean;
  notes: string | null;
  createdAt: string;
  contactedAt: string | null;
  reports: { id: string; riskCategory: string; createdAt: string }[];
}

interface Report {
  id: string;
  questionnaireAnswers: string;
  riskCategory: string;
  riskScore: number;
  createdAt: string;
  leadEmail: string | null;
}

const ADMIN_PASSWORD = "admin123";

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [tab, setTab] = useState<"leads" | "reports">("leads");
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [leadsRes, reportsRes] = await Promise.all([
        fetch("/api/admin/leads"),
        fetch("/api/admin/reports"),
      ]);
      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (reportsRes.ok) setReports(await reportsRes.json());
    } catch (err) {
      setError("Errore nel caricamento dati");
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated, fetchData]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError(null);
    } else {
      setError("Password errata");
    }
  };

  if (!authenticated) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-sm items-center px-6">
        <div className="w-full space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Accesso Admin</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Inserisci la password per accedere alla dashboard.
            </p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Password"
          />
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <button
            onClick={handleLogin}
            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground"
          >
            Accedi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/" className="text-sm text-muted-foreground underline underline-offset-2">
          ← Home
        </Link>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTab("leads")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === "leads" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
          }`}
        >
          Lead ({leads.length})
        </button>
        <button
          onClick={() => setTab("reports")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === "reports" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
          }`}
        >
          Report ({reports.length})
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {tab === "leads" && (
        <div className="space-y-3">
          {leads.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">Nessun lead ancora.</p>
          )}
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-sm">{lead.email || "Senza email"}</p>
                  {lead.name && (
                    <p className="text-sm text-muted-foreground">{lead.name}</p>
                  )}
                  <div className="mt-1 flex flex-wrap gap-2">
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                      {lead.source}
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString("it-IT")}
                    </span>
                    {lead.hasBookedCall && (
                      <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs text-green-700">
                        Call prenotata
                      </span>
                    )}
                  </div>
                  {lead.notes && (
                    <p className="mt-2 text-xs text-muted-foreground">{lead.notes}</p>
                  )}
                </div>
                <div className="shrink-0">
                  {lead.reports.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {lead.reports.length} report
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "reports" && (
        <div className="space-y-3">
          {reports.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Nessun report ancora.
            </p>
          )}
          {reports.map((report) => (
            <div key={report.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-sm">
                    Report #{report.id.slice(0, 8)}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                      {report.riskCategory}
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                      Score: {report.riskScore}/100
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                      {new Date(report.createdAt).toLocaleDateString("it-IT")}
                    </span>
                  </div>
                  {report.leadEmail && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Lead: {report.leadEmail}
                    </p>
                  )}
                </div>
                <Link
                  href={`/report/${report.id}`}
                  className="shrink-0 text-xs text-primary underline underline-offset-2"
                >
                  Vedi
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
