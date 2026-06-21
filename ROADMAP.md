# Roadmap di Produzione — AI Act Compliance Tool

**Repo**: `github.com/pietro1991-dot/ai-act-compliance-tool`
**Obiettivo**: Tool di screening AI Act + lead generation per consulenza

---

## Fase 0 — Setup Progetto (priorità: critica)

- [ ] **0.1** Inizializzare Next.js 14+ con TypeScript e App Router
  - `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir`
- [ ] **0.2** Installare shadcn/ui
  - `npx shadcn@latest init`
  - Aggiungere componenti base: Button, Card, Input, Textarea, Badge, Progress, Select, Label
- [ ] **0.3** Installare e configurare Prisma
  - `npm install prisma @prisma/client`
  - `npx prisma init`
  - Configurare `schema.prisma` con modello dati (SessionReport, Lead)
- [ ] **0.4** Configurare PostgreSQL locale
  - `createdb ai_act_tool`
  - `npx prisma migrate dev --name init`
  - Verificare connessione: `npx prisma db push`
- [ ] **0.5** Configurare variabili d'ambiente
  - `.env.local`: `DATABASE_URL`, `CLAUDE_API_KEY`, `RESEND_API_KEY`, `NEXT_PUBLIC_URL`
- [ ] **0.6** Strutturare cartelle del progetto
  - `/lib/prisma.ts`, `/lib/claude.ts`, `/types/`, `/components/`

**Deliverable**: `npm run dev` parte, database connesso, shadcn/ui funzionante

---

## Fase 1 — Landing Page (priorità: critica)

- [ ] **1.1** Hero section
  - Titolo: "Il tuo sistema AI è conforme all'AI Act?"
  - Sottotitolo: "L'AI Act diventa applicabile il 2 agosto 2026. Scopri in 3 minuti se il tuo sistema è a rischio."
  - CTA primario: "Valuta il tuo sistema gratis" → link a `/questionnaire`
  - CTA secondario: "Prenota consulenza" → link a `/pricing`
- [ ] **1.2** Sezione "Come funziona" (3 step)
  - Step 1: "Rispondi al questionario" — 8 domande guidate, 3 minuti
  - Step 2: "Ricevi la classificazione" — AI Act, gap analysis, priorità
  - Step 3: "Agisci" — report PDF + opzione consulenza esperto
- [ ] **1.3** Sezione "Le 4 categorie di rischio"
  - Card per ogni categoria (inaccettabile/alto/limitato/minimo)
  - Colore, icona, esempio concreto
  - Badge "Sanzioni fino a 35M€ o 7% fatturato" per urgenza
- [ ] **1.4** Sezione "Per chi è pensato"
  - PMI che usano AI
  - Startup con prodotto AI
  - Consulenti che devono verificare sistemi clienti
- [ ] **1.5** Sezione CTA finale
  - "Inizia ora la valutazione gratuita"
  - "Prenota una call conoscitiva" (link a `/pricing`)
- [ ] **1.6** Header + Footer
  - Nav: Home, Valutazione, Consulenza, Contatti
  - Footer: disclaimer ("Questo tool non costituisce consulenza legale"), link privacy, LinkedIn
- [ ] **1.7** Responsive design (mobile-first)
- [ ] **1.8** Performance: Lighthouse >90

**Deliverable**: Landing page completa, navigabile, responsive

---

## Fase 2 — Questionario Multi-Step (priorità: critica)

- [ ] **2.1** Implementare navigazione tra step
  - Stato React: `currentStep`, `answers` (oggetto con tutte le risposte)
  - Persistenza: salvare risposte su `localStorage` (recupero in caso di chiusura)
  - Transizioni animate tra step (framer-motion o CSS)
- [ ] **2.2** Progress bar
  - Barra superiore: step corrente / totale (8)
  - Pallini navigazione cliccabili (solo step già completati)
- [ ] **2.3** Step 1 — Settore
  - Input: card selezionabili (sanità, finanza, HR, istruzione, PA, e-commerce, intrattenimento, altro)
  - UX: selezione singola con highlight, campo testo se "Altro"
- [ ] **2.4** Step 2 — Scopo del sistema
  - Input: textarea con placeholder guidato
  - "Descrivi brevemente cosa fa il tuo sistema AI, a cosa serve e in che contesto viene usato"
- [ ] **2.5** Step 3 — Utenti coinvolti
  - Input: checkbox multipli (professionisti, pubblico generale, minori, dipendenti, persone vulnerabili)
  - Tooltip informativo per "persone vulnerabili"
- [ ] **2.6** Step 4 — Decisioni autonome
  - Input: radio "Il sistema prende decisioni automatizzate?" (Sì/No)
  - Se Sì: checkbox (assunzioni, crediti, accesso servizi, assicurazioni, promozioni, altro)
- [ ] **2.7** Step 5 — Dati trattati
  - Input: 3 checkbox separati (biometrici, genetici, categorie particolari)
  - Tooltip esplicativo per ogni tipo di dato
- [ ] **2.8** Step 6 — Componente di sicurezza
  - Input: radio "È componente di sicurezza di prodotti?" (Sì/No)
  - Se Sì: checkbox (macchinari, DPI, giocattoli, ascensori, dispositivi medici, altro)
- [ ] **2.9** Step 7 — Interazione umana
  - Input: radio/select (chatbot, deepfake, riconoscimento emotivo, nessuna interazione, altro)
- [ ] **2.10** Step 8 — Contatto (opzionale)
  - Input: email + nome (opzionali)
  - Testo: "Lasciaci la tua email per ricevere il report completo via PDF"
  - Checkbox consenso privacy GDPR
- [ ] **2.11** Stato "completamento" dopo step 8
  - Bottone "Analizza il tuo sistema" → POST a `/api/questionnaire`
  - Loading state con scheletro + messaggio "Stiamo analizzando il tuo sistema..."
- [ ] **2.12** Gestione errori lato client
  - Validazione per ogni step prima di avanzare
  - Stato "disabilitato" sul bottone finché step non è completo
  - Messaggi di errore chiari
- [ ] **2.13** Accessibilità questionario
  - Tastiera: Tab tra step, Enter per confermare
  - Aria-label su ogni input

**Deliverable**: Questionario funzionante, 8 step, validazione, salvataggio locale

---

## Fase 3 — API Backend + Claude Integration (priorità: critica)

- [ ] **3.1** API route `/api/questionnaire`
  - POST: riceve `QuestionnaireAnswers`, valida con Zod
  - Chiama `lib/ai-act/classification-prompt.ts` per costruire prompt
  - Chiama Claude API con retry logic (max 2 tentativi, backoff 1s)
  - Parsing risposta JSON da Claude
  - Salva `SessionReport` su database (con o senza lead)
  - Restituisce `{ reportId: string }`
- [ ] **3.2** Prompt classificazione (`lib/ai-act/classification-prompt.ts`)
  - Template che incorpora tutte le risposte del questionario
  - Contesto: testo integrale di Art. 5, Art. 6, Annex III, Titolo IV
  - Richiesta: classificazione + gap analysis + azioni prioritarie
  - Output: JSON strutturato (validato con Zod)
  - Gestione fallback: se Claude non restituisce JSON valido, ritenta con prompt più stretto
- [ ] **3.3** Prompt report (`lib/ai-act/report-prompt.ts`)
  - Prende classificazione + gap e genera report in linguaggio chiaro
  - Target: imprenditore non tecnico
  - Output: Markdown strutturato
- [ ] **3.4** Claude wrapper (`lib/claude.ts`)
  - Funzione `callClaude(prompt, schema)` con:
    - Timeout (30s)
    - Rate limiting (max 10 req/min)
    - Logging tokens spesi
    - Caching risposte identiche (stesso input → stesso output, entro 24h)
- [ ] **3.5** API route `/api/report/[id]`
  - GET: recupera report da DB, restituisce JSON completo
  - Errore 404 se report non trovato o expired (>30 giorni)
- [ ] **3.6** API route `/api/report/[id]/pdf`
  - POST: genera PDF del report (tramite @react-pdf/renderer o libreria server-side)
  - Salva riferimento su DB (campo `pdfGenerated: true`)
  - Restituisce URL download temporaneo
- [ ] **3.7** API route `/api/lead`
  - POST: salva lead se utente ha lasciato email
  - Invia notifica via email (Resend) con riepilogo report
- [ ] **3.8** API route `/api/contact`
  - POST: richiesta consulenza (nome, email, telefono, messaggio)
  - Invia notifica a te via email
  - Salva lead su DB

**Deliverable**: Backend completo, Claude integrato, report salvato in DB

---

## Fase 4 — Pagina Report (priorità: critica)

- [ ] **4.1** Layout pagina `/report/[id]`
  - Recupera dati report via API lato client
  - Loading skeleton mentre carica
  - Se report non trovato: pagina 404 personalizzata
- [ ] **4.2** Disclaimer banner (fisso in alto, stile visibile)
  - "Questo report è una valutazione preliminare generata automaticamente. Non costituisce consulenza legale. Per la documentazione di conformità ufficiale, consulta un professionista abilitato."
  - Sfondo giallo/ambra, icona ⚠️
- [ ] **4.3** Riepilogo classificazione
  - Gauge circolare o barra con punteggio rischio (1-100)
  - Badge colore: rosso (inaccettabile), arancione (alto), giallo (limitato), verde (minimo)
  - Testo: "Il tuo sistema è classificato come: [categoria]"
  - Motivazione in linguaggio chiaro
- [ ] **4.4** Gap analysis
  - Tabella/lista: ogni gap con icona (✓/✗), descrizione, severità (alta/media/bassa)
  - Ordinamento per severità decrescente
  - Colore riga in base alla severità
- [ ] **4.5** Azioni prioritarie
  - Lista ordinata: 1, 2, 3...
  - Ogni azione con badge priorità
  - Stima effort (es. "1-2 giorni", "2-4 settimane")
- [ ] **4.6** Sezione "Next Steps" (CTA consulenza)
  - "Questo è solo il primo passo. Per la documentazione di conformità completa, abbiamo preparato un pacchetto di consulenza dedicato."
  - Pulsante "Prenota una call gratuita" → link a `/pricing` o calendly
  - Testimonial/fiducia: "Già X aziende hanno completato la compliance con noi"
- [ ] **4.7** Download PDF
  - Pulsante "Scarica report PDF"
  - Stato loading durante generazione
  - Download automatico del file
- [ ] **4.8** Condivisione / stampa
  - Pulsante "Stampa" (window.print con CSS print)
  - Meta tag per preview social se condiviso
- [ ] **4.9** Stato "report scaduto"
  - Se report ha >30 giorni: messaggio "Questo report è stato generato il [data]. L'AI Act potrebbe essere cambiato. Riavvia la valutazione."
  - Bottone "Nuova valutazione"

**Deliverable**: Pagina report completa con gap analysis, PDF, CTA consulenza

---

## Fase 5 — Lead & Consulenza (priorità: media)

- [ ] **5.1** Pagina `/pricing` (consulenza)
  - 3 pacchetti: Base / Premium / Enterprise
  - Base: gap analysis + report personalizzato + checklist azioni
  - Premium: gap analysis + bozza documentazione tecnica + supporto 30gg
  - Enterprise: compliance completa (documentazione, risk assessment, conformity)
  - CTA "Prenota consulenza" per ogni pacchetto
- [ ] **5.2** Form contatto consulenza
  - Nome, email, telefono, pacchetto interessato, messaggio
  - Captcha semplice (honeypot, non Google reCAPTCHA)
  - Inviato via API → email a te + salva lead su DB
- [ ] **5.3** Integrazione email transazionali (Resend)
  - Template: "Nuova richiesta consulenza" (a te)
  - Template: "Grazie per averci contattato" (automatica al lead)
  - Template: "Ecco il tuo report AI Act" (con link al report)
- [ ] **5.4** Follow-up automatici (tramite cron o manuali)
  - 24h dopo report senza consulenza: email con guida gratuita
  - 7 giorni dopo: reminder scadenza AI Act
  - 30 giorni dopo: "Il tuo report sta per scadere"
- [ ] **5.5** Dashboard lead (opzionale, area protetta con password)
  - `/admin/leads`: lista lead con stato (nuovo/contattato/chiuso)
  - `/admin/reports`: lista report generati
  - Protezione: HTTP Basic Auth o password hard-coded (semplice, no NextAuth per ora)
- [ ] **5.6** Notifiche in tempo reale (opzionale)
  - Telegram bot o email istantanea su nuovo lead

**Deliverable**: Lead capture funzionante, email automatiche, dashboard admin base

---

## Fase 6 — VPS & Deploy (priorità: alta)

- [ ] **6.1** Preparare VPS (Ubuntu 22.04/24.04)
  - `apt update && apt upgrade -y`
  - `ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw enable`
  - `apt install nginx postgresql -y`
  - `curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && apt install nodejs -y`
  - `npm install -g pm2`
- [ ] **6.2** Configurare PostgreSQL
  - `sudo -u postgres createdb ai_act_tool`
  - Creare utente dedicato (non postgres)
  - Configurare `.env.local` con DATABASE_URL corretto
- [ ] **6.3** Clonare repo e buildare
  - `git clone https://github.com/pietro1991-dot/ai-act-compliance-tool.git /var/www/ai-act-tool`
  - `npm install && npx prisma migrate deploy && npm run build`
- [ ] **6.4** Configurare PM2
  - `pm2 start npm --name "ai-act" -- start`
  - `pm2 save && pm2 startup`
  - Verificare: `pm2 status`, `pm2 logs`
- [ ] **6.5** Configurare Nginx
  - File site: `/etc/nginx/sites-available/ai-act`
  - Reverse proxy su `localhost:3000`
  - Headers: X-Forwarded-For, X-Forwarded-Proto, upgrade HTTP/2
  - Rate limiting: `limit_req` per API routes (10 req/s per IP)
  - Cache static assets (js, css, images) per 1 anno
- [ ] **6.6** TLS con Certbot
  - `certbot --nginx -d tuodominio.it`
  - Rinnovo automatico: `certbot renew --dry-run`
- [ ] **6.7** Test deploy
  - Visitare dominio: landing page funziona
  - Completare questionario: report generato correttamente
  - Testare download PDF
  - Testare form contatto
  - Controllare PM2 logs per errori
- [ ] **6.8** Hardening sicurezza
  - Nginx: nascondere versione server (`server_tokens off`)
  - Headers sicurezza: X-Frame-Options, X-Content-Type-Options, CSP base
  - Rate limiting sulle API
  - PostgreSQL: ascoltare solo su localhost (già default)
  - Firewall: solo porte 22, 80, 443
  - Fail2ban per SSH (opzionale)

**Deliverable**: Sito live su dominio, HTTPS, PM2, Nginx, DB funzionante

---

## Fase 7 — Dominio & Branding (priorità: media)

- [ ] **7.1** Acquistare dominio (se non già fatto)
  - Nome breve, pertinente: es. `ai-act-check.it`, `aiacompliance.it`, `act-check.com`
  - Puntare DNS alla VPS
- [ ] **7.2** Logo e identità visiva
  - Logo SVG (favicon, header, social)
  - Palette colori definita (primario, secondario, sfondo, testo)
  - Font system (Inter/Geist) — senza caricare Google Fonts per privacy
- [ ] **7.3** Favicon a 360°
  - favicon.ico (16x16, 32x32)
  - apple-touch-icon.png (180x180)
  - Icon per Chrome (192x192, 512x512) in manifest.json
- [ ] **7.4** OG Image
  - `public/og-image.png` (1200x630)
  - Titolo, sottotitolo, logo del tool
  - Usare `@vercel/og` o immagine statica
- [ ] **7.5** Meta tag SEO
  - title, description, keywords per ogni pagina
  - JSON-LD schema: WebApplication, Service
  - robots.txt + sitemap.xml (dinamica o statica)
- [ ] **7.6** Analytics (leggero)
  - Plausible / Umami (self-hosted, privacy-first)
  - OPPURE: nessun analytics all'inizio, log server-side basilari
  - NO Google Analytics (pesante, privacy invasiva)

**Deliverable**: Dominio attivo, logo, meta tag, OG image, analytics

---

## Fase 8 — Testing & Quality (priorità: media)

- [ ] **8.1** Test manuale questionario
  - Completare questionario con dati realistici
  - Verificare che la classificazione sia sensata
  - Provare tutti i casi: settori diversi, decisioni Sì/No, ecc.
- [ ] **8.2** Test classificazione Claude
  - Promptare Claude con sistemi noti (es. chatGPT è rischio minimo, Clearview AI è inaccettabile)
  - Verificare che la classificazione corrisponda a quella attesa
  - Correggere prompt se necessario
- [ ] **8.3** Test responsivo
  - Mobile (375px, 414px): tutto leggibile, bottoni cliccabili
  - Tablet (768px): layout non rotto
  - Desktop (1280px+): tutto proporzionato
- [ ] **8.4** Test performance
  - Lighthouse: >90 tutte le categorie
  - First Contentful Paint: <1.5s
  - Largest Contentful Paint: <2.5s
- [ ] **8.5** Test sicurezza
  - API routes: validazione input con Zod, nessun dato non sanitizzato
  - No SQL injection (Prisma gestisce)
  - No XSS (React gestisce)
  - Rate limiting attivo
- [ ] **8.6** Test error handling
  - Cosa succede se Claude API è down?
  - Cosa succede se DB è down?
  - Cosa succede se l'utente inserisce dati non validi?
  - Tutti i casi gestiti con messaggi user-friendly
- [ ] **8.7** Test export PDF
  - PDF si genera correttamente
  - Layout è pulito, leggibile
  - Disclaimer incluso
- [ ] **8.8** Test email
  - Notifica arriva quando lead fa submit
  - Utente riceve email con link report

**Deliverable**: Tool testato, funzionante, gestione errori

---

## Fase 9 — Lancio & Promozione (priorità: bassa)

- [ ] **9.1** Post LinkedIn
  - Raccontare il processo: dall'idea al tool funzionante
  - Focus: AI Act, urgenza, tool gratuito
  - Includere screenshot e link
- [ ] **9.2** Aggiungere tool a CV e portfolio
  - Link al dominio in header CV
  - Descrizione: "Ho progettato e sviluppato un tool di screening AI Act che classifica sistemi AI e genera gap analysis. Stack: Next.js, PostgreSQL, Claude API. Deploy su VPS. Usato da X aziende."
- [ ] **9.3** Raccolta feedback
  - Chiedere a 3-5 persone di testare il tool
  - Correggere problemi emersi
- [ ] **9.4** (Opzionale) Modalità "embedded" per partner
  - Widget iframe che altri siti possono incorporare
  - Versione white-label per consulenti partner

**Deliverable**: Tool pubblico, link su CV, post LinkedIn, primo feedback

---

## Fase 10 — Post-Lancio (priorità: bassa)

- [ ] **10.1** Monitoraggio
  - Controllare PM2 logs settimanalmente
  - Verificare che email notifiche funzionino
  - Controllare che Certbot rinnovi TLS (ogni 60gg)
- [ ] **10.2** Manutenzione AI Act
  - L'AI Act potrebbe avere linee guida, aggiornamenti o interpretazioni
  - Rivedere prompt ogni 3-6 mesi per allinearli
- [ ] **10.3** Iterazione basata su lead reali
  - I lead che arrivano ti diranno cosa cercano veramente
  - Adattare tool e offerta consulenza in base a quello che chiedono
- [ ] **10.4** (Opzionale) Aprire repo ad altri contributor
  - README.md con istruzioni per run locale
  - Licenza open source (MIT / AGPL)

**Deliverable**: Tool mantenuto, aggiornato, iterato

---

## Riepilogo Priorità

| Fase | Priorità | Tempo stimato | Dipende da |
|------|----------|---------------|------------|
| 0 — Setup progetto | Critica | 1 giorno | — |
| 1 — Landing page | Critica | 1-2 giorni | 0 |
| 2 — Questionario | Critica | 2-3 giorni | 0, 1 |
| 3 — Backend + Claude | Critica | 2-3 giorni | 0 |
| 4 — Pagina Report | Critica | 2-3 giorni | 2, 3 |
| 6 — VPS + Deploy | Alta | 1 giorno | 1, 2, 3, 4 |
| 5 — Lead & Consulenza | Media | 1-2 giorni | 3, 4 |
| 7 — Dominio & Branding | Media | 1 giorno | 6 |
| 8 — Testing | Media | 1-2 giorni | 1, 2, 3, 4 |
| 9 — Lancio | Bassa | 1 giorno | 6, 7, 8 |
| 10 — Post-lancio | Bassa | Continuativo | 9 |

**Totale stimato**: ~14-20 giorni lavorativi per MVP completo
