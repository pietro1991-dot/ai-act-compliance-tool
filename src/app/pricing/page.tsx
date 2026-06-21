import { ConsultancyForm } from "@/components/shared/consultancy-form";

export default function PricingPage() {
  return (
    <>
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Consulenza AI Act
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Dalla classificazione alla documentazione di conformità completa.
              Scegli il pacchetto che fa per te.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* BASE */}
            <div className="flex flex-col rounded-xl border bg-card p-8">
              <h2 className="text-lg font-semibold">Base</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Per chi vuole capire la propria posizione
              </p>
              <p className="mt-6">
                <span className="text-3xl font-bold">€497</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {[
                  "Gap analysis personalizzata",
                  "Report dettagliato con azioni prioritarie",
                  "Checklist conformità AI Act",
                  "1 call di 30 minuti per chiarimenti",
                  "Documento PDF scaricabile",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#contact-form"
                className="mt-8 inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background text-sm font-medium transition-all hover:bg-muted"
              >
                Richiedi preventivo
              </a>
            </div>

            {/* PREMIUM (in evidenza) */}
            <div className="relative flex flex-col rounded-xl border-2 border-primary bg-card p-8 shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                Consigliato
              </div>
              <h2 className="text-lg font-semibold">Premium</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Per chi deve adeguarsi all&apos;AI Act
              </p>
              <p className="mt-6">
                <span className="text-3xl font-bold">€1.497</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {[
                  "Tutto del piano Base",
                  "Bozza documentazione tecnica (Annex IV)",
                  "Risk assessment preliminare",
                  "Registro trattamenti GDPR integrato",
                  "2 call da 45 minuti",
                  "Supporto email prioritario 30 giorni",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#contact-form"
                className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
              >
                Richiedi preventivo
              </a>
            </div>

            {/* ENTERPRISE */}
            <div className="flex flex-col rounded-xl border bg-card p-8">
              <h2 className="text-lg font-semibold">Enterprise</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Compliance completa senza pensieri
              </p>
              <p className="mt-6">
                <span className="text-3xl font-bold">€3.997</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {[
                  "Tutto del piano Premium",
                  "Documentazione tecnica completa (Annex IV)",
                  "Dichiarazione di conformità UE (bozza)",
                  "Sistema di gestione del rischio (Art. 9)",
                  "Formazione team (sessione 2h)",
                  "Supporto dedicato 90 giorni",
                  "Revisione documenti con consulente umano",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#contact-form"
                className="mt-8 inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background text-sm font-medium transition-all hover:bg-muted"
              >
                Richiedi preventivo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section
        id="contact-form"
        className="border-t bg-muted/30 px-6 py-24 md:py-32"
      >
        <div className="mx-auto max-w-xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Richiedi informazioni
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Compila il form e ti ricontatterò entro 24 ore per discutere il
              pacchetto più adatto alle tue esigenze.
            </p>
          </div>

          <ConsultancyForm />
        </div>
      </section>
    </>
  );
}


