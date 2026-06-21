"use client";

import { useState } from "react";

export function ConsultancyForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
        }),
      });

      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Errore nell'invio. Riprova.");
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-semibold text-primary">Richiesta inviata! 🎉</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Ti ricontatterò entro 24 ore. Controlla la tua casella email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Il tuo nome"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="tua@email.it"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          Telefono <span className="text-muted-foreground">(opzionale)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="+39 123 456 7890"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Messaggio <span className="text-muted-foreground">(opzionale)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Raccontami brevemente il tuo progetto o le tue esigenze..."
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:translate-y-px disabled:opacity-50"
      >
        {sending ? "Invio in corso..." : "Invia richiesta"}
      </button>
      {error && (
        <p className="text-center text-sm text-destructive">{error}</p>
      )}
      <p className="text-center text-xs text-muted-foreground">
        I tuoi dati saranno trattati nel rispetto del GDPR. Non inviamo spam.
      </p>
    </form>
  );
}
