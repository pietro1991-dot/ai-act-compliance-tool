"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { QuestionnaireAnswers } from "@/types/questionnaire";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

type StepKey = keyof QuestionnaireAnswers;

interface StepConfig {
  id: number;
  title: string;
  description: string;
}

const STEPS: StepConfig[] = [
  { id: 0, title: "Settore", description: "In quale settore opera il sistema AI?" },
  { id: 1, title: "Scopo", description: "Descrivi lo scopo del sistema AI" },
  { id: 2, title: "Utenti", description: "Chi utilizza il sistema?" },
  { id: 3, title: "Decisioni", description: "Il sistema prende decisioni autonome?" },
  { id: 4, title: "Dati", description: "Che tipo di dati tratta il sistema?" },
  { id: 5, title: "Sicurezza", description: "È un componente di sicurezza?" },
  { id: 6, title: "Interazione", description: "Come interagisce con gli utenti?" },
  { id: 7, title: "Contatto", description: "Ricevi il report via email (opzionale)" },
];

const sectors = [
  { value: "healthcare" as const, label: "Sanità" },
  { value: "finance" as const, label: "Finanza / Assicurazioni" },
  { value: "hr" as const, label: "Risorse Umane" },
  { value: "education" as const, label: "Istruzione" },
  { value: "public-admin" as const, label: "Pubblica Amministrazione" },
  { value: "ecommerce" as const, label: "E-commerce" },
  { value: "entertainment" as const, label: "Intrattenimento" },
  { value: "other" as const, label: "Altro" },
];

const endUserOptions = [
  { value: "professionals" as const, label: "Professionisti" },
  { value: "general-public" as const, label: "Pubblico generale" },
  { value: "minors" as const, label: "Minori" },
  { value: "employees" as const, label: "Dipendenti" },
  { value: "vulnerable-persons" as const, label: "Persone vulnerabili" },
];

const decisionOptions = [
  { value: "hiring" as const, label: "Assunzioni / selezione" },
  { value: "credit" as const, label: "Accesso al credito" },
  { value: "access-to-service" as const, label: "Accesso a servizi essenziali" },
  { value: "insurance" as const, label: "Valutazione assicurativa" },
  { value: "promotion" as const, label: "Promozioni / valutazioni" },
  { value: "other" as const, label: "Altro tipo di decisione" },
];

const safetyOptions = [
  { value: "machinery" as const, label: "Macchinari" },
  { value: "medical-device" as const, label: "Dispositivi medici" },
  { value: "toys" as const, label: "Giocattoli" },
  { value: "lift" as const, label: "Ascensori" },
  { value: "ppi" as const, label: "DPI (Dispositivi Protezione Individuale)" },
  { value: "other" as const, label: "Altro" },
];

const interactionOptions = [
  { value: "chatbot" as const, label: "Chatbot / assistente virtuale" },
  { value: "deepfake" as const, label: "Generazione contenuti sintetici (deepfake)" },
  { value: "emotional-recognition" as const, label: "Riconoscimento emotivo" },
  { value: "none" as const, label: "Nessuna interazione diretta" },
  { value: "other" as const, label: "Altro tipo di interazione" },
];

const STORAGE_KEY = "ai-act-questionnaire";

type Sector = (typeof sectors)[number]["value"];
type EndUser = (typeof endUserOptions)[number]["value"];
type DecisionType = (typeof decisionOptions)[number]["value"];
type SafetyDomain = (typeof safetyOptions)[number]["value"];
type Interaction = (typeof interactionOptions)[number]["value"];

type StepProps = {
  answers: QuestionnaireAnswers;
  update: (patch: Partial<QuestionnaireAnswers>) => void;
};

function selectCard<T extends string>(
  options: { value: T; label: string }[],
  selected: T | undefined,
  onSelect: (val: T) => void,
) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onSelect(opt.value)}
          className={`rounded-xl border p-4 text-left text-sm font-medium transition-all hover:border-primary/50 active:translate-y-px ${
            selected === opt.value
              ? "border-primary bg-primary/5 ring-1 ring-primary"
              : "border-border bg-card"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function checkList<T extends string>(
  options: { value: T; label: string }[],
  selected: T[],
  onToggle: (val: T) => void,
) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            className={`rounded-xl border p-4 text-left text-sm font-medium transition-all hover:border-primary/50 active:translate-y-px ${
              isSelected
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border bg-card"
            }`}
          >
            <span className="flex items-center gap-3">
              <span
                className={`flex size-5 shrink-0 items-center justify-center rounded-md border text-xs ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30"
                }`}
              >
                {isSelected ? "✓" : ""}
              </span>
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function StepSector({ answers, update }: StepProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Seleziona il settore in cui viene utilizzato il sistema AI.
      </p>
      {selectCard<Sector>(sectors, answers.sector as Sector, (val) => {
        update({ sector: val });
      })}
      {answers.sector === "other" && (
        <div className="space-y-2">
          <Label htmlFor="sector-other">Specifica il settore</Label>
          <Input
            id="sector-other"
            value={answers.sectorOther ?? ""}
            onChange={(e) => update({ sectorOther: e.target.value })}
            placeholder="Es. 物流, automotive..."
          />
        </div>
      )}
    </div>
  );
}

function StepPurpose({ answers, update }: StepProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Descrivi brevemente cosa fa il sistema, a cosa serve e in che contesto
        viene utilizzato.
      </p>
      <div className="space-y-2">
        <Label htmlFor="purpose">Descrizione del sistema AI</Label>
        <Textarea
          id="purpose"
          value={answers.purpose}
          onChange={(e) => update({ purpose: e.target.value })}
          placeholder="Es. Il sistema analizza i CV dei candidati e genera una classifica basata sulle competenze richieste dall'offerta di lavoro..."
          rows={5}
        />
      </div>
    </div>
  );
}

function StepUsers({ answers, update }: StepProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Chi sono gli utenti finali del sistema? Seleziona tutte le opzioni
        applicabili.
      </p>
      {checkList<EndUser>(
        endUserOptions,
        answers.endUsers as EndUser[],
        (val) => {
          const current = answers.endUsers as EndUser[];
          update({
            endUsers: current.includes(val)
              ? current.filter((v) => v !== val)
              : [...current, val],
          });
        },
      )}
    </div>
  );
}

function StepDecisions({ answers, update }: StepProps) {
  const hasDecisions = answers.autonomousDecisions;
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Il sistema AI prende decisioni automatizzate che hanno effetti giuridici
        o significativi per le persone?
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => update({ autonomousDecisions: true })}
          className={`flex-1 rounded-xl border p-4 text-center text-sm font-medium transition-all hover:border-primary/50 active:translate-y-px ${
            hasDecisions === true
              ? "border-primary bg-primary/5 ring-1 ring-primary"
              : "border-border bg-card"
          }`}
        >
          Sì
        </button>
        <button
          type="button"
          onClick={() =>
            update({ autonomousDecisions: false, decisionTypes: undefined })
          }
          className={`flex-1 rounded-xl border p-4 text-center text-sm font-medium transition-all hover:border-primary/50 active:translate-y-px ${
            hasDecisions === false
              ? "border-primary bg-primary/5 ring-1 ring-primary"
              : "border-border bg-card"
          }`}
        >
          No
        </button>
      </div>
      {hasDecisions && (
        <div className="space-y-3">
          <Label>Che tipo di decisioni?</Label>
          {checkList<DecisionType>(
            decisionOptions,
            (answers.decisionTypes ?? []) as DecisionType[],
            (val) => {
              const current = (answers.decisionTypes ?? []) as DecisionType[];
              update({
                decisionTypes: current.includes(val)
                  ? current.filter((v) => v !== val)
                  : [...current, val],
              });
            },
          )}
        </div>
      )}
    </div>
  );
}

function StepData({ answers, update }: StepProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Il sistema tratta una delle seguenti categorie di dati?
      </p>
      <div className="grid gap-3">
        {([
          ["processesBiometricData", "Dati biometrici (impronte, riconoscimento facciale)"],
          ["processesGeneticData", "Dati genetici"],
          [
            "processesSpecialCategoryData",
            "Categorie particolari (salute, religione, orientamento sessuale, ecc.)",
          ],
        ] as const).map(([key, label]) => {
          const value = answers[key as StepKey] as boolean;
          return (
            <button
              key={key}
              type="button"
              onClick={() =>
                update({ [key as StepKey]: !value })
              }
              className={`rounded-xl border p-4 text-left text-sm font-medium transition-all hover:border-primary/50 active:translate-y-px ${
                value
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-card"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-md border text-xs ${
                    value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {value ? "✓" : ""}
                </span>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepSafety({ answers, update }: StepProps) {
  const hasSafety = answers.isSafetyComponent;
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Il sistema AI è un componente di sicurezza di un prodotto regolato da
        norme UE (macchinari, DPI, dispositivi medici, ecc.)?
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => update({ isSafetyComponent: true })}
          className={`flex-1 rounded-xl border p-4 text-center text-sm font-medium transition-all hover:border-primary/50 active:translate-y-px ${
            hasSafety === true
              ? "border-primary bg-primary/5 ring-1 ring-primary"
              : "border-border bg-card"
          }`}
        >
          Sì
        </button>
        <button
          type="button"
          onClick={() =>
            update({ isSafetyComponent: false, safetyDomains: undefined })
          }
          className={`flex-1 rounded-xl border p-4 text-center text-sm font-medium transition-all hover:border-primary/50 active:translate-y-px ${
            hasSafety === false
              ? "border-primary bg-primary/5 ring-1 ring-primary"
              : "border-border bg-card"
          }`}
        >
          No
        </button>
      </div>
      {hasSafety && (
        <div className="space-y-3">
          <Label>In quale ambito?</Label>
          {checkList<SafetyDomain>(
            safetyOptions,
            (answers.safetyDomains ?? []) as SafetyDomain[],
            (val) => {
              const current = (answers.safetyDomains ?? []) as SafetyDomain[];
              update({
                safetyDomains: current.includes(val)
                  ? current.filter((v) => v !== val)
                  : [...current, val],
              });
            },
          )}
        </div>
      )}
    </div>
  );
}

function StepInteraction({ answers, update }: StepProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        In che modo il sistema interagisce con gli esseri umani?
      </p>
      {selectCard<Interaction>(
        interactionOptions,
        answers.humanInteraction as Interaction,
        (val) => {
          update({ humanInteraction: val });
        },
      )}
    </div>
  );
}

function StepContact({ answers, update }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
        <p className="font-medium text-primary">Ultimo passo!</p>
        <p className="mt-1 text-muted-foreground">
          Lascia la tua email per ricevere il report completo via PDF. Se
          preferisci, puoi saltare e scaricarlo manualmente dopo.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-email">
          Email <span className="text-muted-foreground">(opzionale)</span>
        </Label>
        <Input
          id="contact-email"
          type="email"
          value={answers.contactEmail ?? ""}
          onChange={(e) => update({ contactEmail: e.target.value })}
          placeholder="tua@email.it"
        />
      </div>
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800">
        I dati saranno trattati nel rispetto del GDPR e utilizzati solo per
        inviarti il report e, se autorizzi, per ricontattarti.
      </div>
    </div>
  );
}

const STEP_COMPONENTS = [
  StepSector,
  StepPurpose,
  StepUsers,
  StepDecisions,
  StepData,
  StepSafety,
  StepInteraction,
  StepContact,
];

function defaultAnswers(): QuestionnaireAnswers {
  return {
    sector: undefined as unknown as QuestionnaireAnswers["sector"],
    purpose: "",
    endUsers: [],
    autonomousDecisions: undefined as unknown as boolean,
    processesBiometricData: false,
    processesGeneticData: false,
    processesSpecialCategoryData: false,
    isSafetyComponent: undefined as unknown as boolean,
    humanInteraction: undefined as unknown as QuestionnaireAnswers["humanInteraction"],
  };
}

function loadSaved(): QuestionnaireAnswers | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as QuestionnaireAnswers;
  } catch {
    return null;
  }
}

export function QuestionnaireForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(defaultAnswers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = loadSaved();
    if (saved) {
      setAnswers(saved);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
    }
  }, [answers, loaded]);

  const update = useCallback((patch: Partial<QuestionnaireAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...patch }));
    setError(null);
  }, []);

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const canGoNext = (): boolean => {
    const s = answers;
    switch (currentStep) {
      case 0:
        return !!s.sector && (s.sector !== "other" || (s.sectorOther?.trim() ?? "") !== "");
      case 1:
        return s.purpose.trim().length >= 10;
      case 2:
        return s.endUsers.length > 0;
      case 3:
        return s.autonomousDecisions !== (undefined as unknown as boolean);
      case 4:
        return true;
      case 5:
        return s.isSafetyComponent !== (undefined as unknown as boolean);
      case 6:
        return !!s.humanInteraction;
      case 7:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canGoNext()) return;
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/questionnaire", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Errore durante l'analisi");
      }
      const data = await res.json();
      localStorage.removeItem(STORAGE_KEY);
      router.push(`/report/${data.reportId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
      setIsSubmitting(false);
    }
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  const StepComponent = STEP_COMPONENTS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Step {currentStep + 1} di {STEPS.length}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          {STEPS[currentStep].title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {STEPS[currentStep].description}
        </p>
      </div>

      <Progress value={progress} className="mb-10 h-2" />

      <Card className="p-6 md:p-8">
        <StepComponent answers={answers} update={update} />
      </Card>

      {error && (
        <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0 || isSubmitting}
        >
          Indietro
        </Button>

        {isLastStep ? (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Analisi in corso...
              </span>
            ) : (
              "Analizza il tuo sistema"
            )}
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!canGoNext() || isSubmitting}>
            Avanti
          </Button>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        I tuoi dati non vengono salvati permanentemente fino all&apos;invio
        finale.
      </p>
    </div>
  );
}
