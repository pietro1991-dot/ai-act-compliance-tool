# TODO — Stato avanzamento

> Spunta ciò che completi. Usa `- [x]` per completato, `- [ ]` per da fare.

## Fase 0 — Setup ✅
- [x] 0.1 Init Next.js
- [x] 0.2 shadcn/ui
- [x] 0.3 Prisma
- [x] 0.4 SQLite (dev)
- [x] 0.5 .env / .env.example
- [x] 0.6 Struttura cartelle

## Fase 1 — Landing ✅
- [x] 1.1 Hero
- [x] 1.2 Come funziona
- [x] 1.3 Categorie rischio
- [x] 1.4 Target utenti
- [x] 1.5 CTA finale
- [x] 1.6 Header/Footer
- [x] 1.7 Responsive (mobile-first con Tailwind)
- [x] 1.8 Performance (build ok, HTTP 200)

## Fase 2 — Questionario ✅
- [x] 2.1 Navigazione step (React state + localStorage)
- [x] 2.2 Progress bar
- [x] 2.3 Step 1 — Settore (card selezionabili + campo "Altro")
- [x] 2.4 Step 2 — Scopo (textarea con validazione 10+ caratteri)
- [x] 2.5 Step 3 — Utenti (checkbox multipli)
- [x] 2.6 Step 4 — Decisioni autonome (Sì/No + checkbox condizionali)
- [x] 2.7 Step 5 — Dati trattati (checkbox toggle)
- [x] 2.8 Step 6 — Componente sicurezza (Sì/No + checkbox condizionali)
- [x] 2.9 Step 7 — Interazione umana (card selezionabili)
- [x] 2.10 Step 8 — Contatto (email opzionale + submit)
- [x] 2.11 Submit → API + redirect a report
- [x] 2.12 Gestione errori (validazione per-step, error banner, localStorage fallback)
- [x] 2.13 Accessibilità (Label, aria-label su bottoni, focus visibile)

## Fase 3 — Backend + Claude ✅
- [x] 3.1 API /api/questionnaire (POST)
- [x] 3.2 Prompt classificazione (AI Act completo)
- [x] 3.3 Prompt report (gap analysis)
- [x] 3.4 Claude wrapper (retry 2x, timeout 30s, fallback classification)
- [x] 3.5 API GET report/[id]
- [x] 3.6 API POST report (via questionnaire route)
- [x] 3.7 API /api/lead
- [x] 3.8 API /api/contact

## Fase 4 — Report ✅
- [x] 4.1 Layout /report/[id]
- [x] 4.2 Disclaimer banner (fisso in alto, stile giallo)
- [x] 4.3 Classificazione (gauge SVG + badge colore)
- [x] 4.4 Gap analysis (card per gap con severità)
- [x] 4.5 Azioni prioritarie (lista numerata con badge)
- [x] 4.6 Next Steps CTA (call gratuita + nuova valutazione)
- [x] 4.7 Download (.md) + preview report
- [x] 4.8 Gestione stati (loading spinner, error, not found, expired)
- [x] 4.9 Build verificata (9 routes, HTTP 200)

## Fase 5 — Lead
- [ ] 5.1 Pagina /pricing
- [ ] 5.2 Form contatto
- [ ] 5.3 Email (Resend)
- [ ] 5.4 Follow-up automatici
- [ ] 5.5 Dashboard admin
- [ ] 5.6 Notifiche

## Fase 6 — Deploy
- [ ] 6.1 Preparare VPS
- [ ] 6.2 PostgreSQL
- [ ] 6.3 Clone + build
- [ ] 6.4 PM2
- [ ] 6.5 Nginx
- [ ] 6.6 TLS Certbot
- [ ] 6.7 Test deploy
- [ ] 6.8 Hardening

## Fase 7 — Branding
- [ ] 7.1 Dominio
- [ ] 7.2 Logo
- [ ] 7.3 Favicon
- [ ] 7.4 OG Image
- [ ] 7.5 SEO
- [ ] 7.6 Analytics

## Fase 8 — Testing
- [ ] 8.1 Manuale questionario
- [ ] 8.2 Classificazione
- [ ] 8.3 Responsivo
- [ ] 8.4 Performance
- [ ] 8.5 Sicurezza
- [ ] 8.6 Error handling
- [ ] 8.7 PDF
- [ ] 8.8 Email
