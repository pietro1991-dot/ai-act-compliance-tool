import Link from "next/link";

const riskCategories = [
  {
    level: "Minimo",
    color: "bg-green-500",
    textColor: "text-green-700",
    bgLight: "bg-green-50",
    border: "border-green-200",
    description: "Nessun obbligo specifico",
    example: "Sistemi AI per videogiochi, filtri antispam",
  },
  {
    level: "Limitato",
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgLight: "bg-yellow-50",
    border: "border-yellow-200",
    description: "Obblighi di trasparenza",
    example: "Chatbot, deepfake, sistemi che interagiscono con persone",
  },
  {
    level: "Alto",
    color: "bg-orange-500",
    textColor: "text-orange-700",
    bgLight: "bg-orange-50",
    border: "border-orange-200",
    description: "Documentazione + risk assessment",
    example:
      "Sistemi per HR, credit scoring, infrastrutture critiche, dispositivi medici",
  },
  {
    level: "Inaccettabile",
    color: "bg-red-500",
    textColor: "text-red-700",
    bgLight: "bg-red-50",
    border: "border-red-200",
    description: "Pratiche proibite",
    example:
      "Social scoring, real-time biometric surveillance in spazi pubblici",
  },
];

const steps = [
  {
    number: "01",
    title: "Rispondi al questionario",
    description:
      "8 domande rapide su settore, scopo e caratteristiche del tuo sistema AI. Bastano 3 minuti.",
  },
  {
    number: "02",
    title: "Ricevi la classificazione",
    description:
      "Il nostro tool analizza le tue risposte alla luce dell'AI Act e genera una gap analysis completa.",
  },
  {
    number: "03",
    title: "Agisci in tempo",
    description:
      "Scarica il report PDF con le azioni prioritarie e, se serve, prenota una consulenza personalizzata.",
  },
];

const targetAudiences = [
  {
    title: "PMI che usano AI",
    description:
      "Hai integrato sistemi AI nei tuoi processi e devi capire se sei conforme prima del 2 agosto 2026.",
  },
  {
    title: "Startup con prodotto AI",
    description:
      "Stai sviluppando un prodotto basato su AI? La conformità va pianificata fin dall'inizio, non dopo.",
  },
  {
    title: "Consulenti e professionisti",
    description:
      "Devi verificare i sistemi AI dei tuoi clienti o vuoi offrire un servizio di compliance AI Act.",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-32 pt-24 md:pt-32">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(45%_30%_at_50%_0%,oklch(0.6_0.15_265/0.12),transparent)]" />
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-destructive animate-pulse" />
            AI Act applicabile dal 2 agosto 2026
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Il tuo sistema AI è conforme{" "}
            <span className="text-primary">all&apos;AI Act</span>?
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            L&apos;AI Act (Regolamento UE 2024/1689) introduce obblighi
            specifici per i sistemi AI. Scopri in 3 minuti se il tuo sistema è
            a rischio e cosa devi fare per essere in regola.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/questionnaire"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:translate-y-px"
            >
              Valuta il tuo sistema gratis
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background px-8 text-sm font-medium transition-all hover:bg-muted active:translate-y-px"
            >
              Prenota consulenza
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Gratuito. Nessuna registrazione richiesta. Report PDF scaricabile.
          </p>
        </div>
      </section>

      {/* SANZIONI BANNER */}
      <section className="border-y bg-destructive/5 px-6 py-6">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-3 text-center text-sm font-medium text-destructive">
          <span className="text-lg">⚠️</span>
          <span>
            Sanzioni fino a <strong>35 milioni di euro</strong> o al{" "}
            <strong>7% del fatturato mondiale annuo</strong> per
            non-conformità.
          </span>
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section className="px-6 py-24 md:py-32" id="how-it-works">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Come funziona
            </h2>
            <p className="mt-4 text-muted-foreground">
              Tre passaggi semplici per capire dove ti trovi e cosa fare.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                  {step.number}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIE DI RISCHIO */}
      <section className="bg-muted/30 px-6 py-24 md:py-32" id="risk-categories">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Le 4 categorie di rischio
            </h2>
            <p className="mt-4 text-muted-foreground">
              L&apos;AI Act classifica i sistemi AI in quattro livelli, con
              obblighi crescenti.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {riskCategories.map((cat) => (
              <div
                key={cat.level}
                className={`rounded-xl border ${cat.border} ${cat.bgLight} p-6`}
              >
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className={`size-3 rounded-full ${cat.color} shrink-0`}
                  />
                  <h3 className={`text-lg font-semibold ${cat.textColor}`}>
                    Rischio {cat.level}
                  </h3>
                </div>
                <p className="text-sm font-medium">{cat.description}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {cat.example}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TARGET */}
      <section className="px-6 py-24 md:py-32" id="for-who">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Per chi è pensato
            </h2>
            <p className="mt-4 text-muted-foreground">
              Che tu sia un&apos;impresa, una startup o un consulente, lo
              strumento fa per te.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {targetAudiences.map((audience) => (
              <div
                key={audience.title}
                className="rounded-xl border bg-card p-6 shadow-sm"
              >
                <h3 className="mb-2 text-lg font-semibold">
                  {audience.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {audience.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINALE */}
      <section className="border-t bg-primary px-6 py-24 text-primary-foreground md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Inizia ora la valutazione gratuita
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            L&apos;AI Act scade tra poche settimane. Ogni giorno perso è un
            rischio che puoi evitare.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/questionnaire"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-background px-8 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-background/90 active:translate-y-px"
            >
              Valuta il tuo sistema gratis
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-primary-foreground/30 px-8 text-sm font-medium text-primary-foreground transition-all hover:bg-primary-foreground/10 active:translate-y-px"
            >
              Prenota consulenza
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
