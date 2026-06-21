# AI Act Compliance Tool — Documentazione Tecnica

## 1. Posizionamento e Target

Il tool ha un **doppio ruolo**:

1. **Strumento di screening gratuito** — guida l'utente con un questionario strutturato, classifica il sistema AI, genera un report preliminare di gap analysis. L'utente capisce se e quali obblighi ha.
2. **Generatore di lead per consulenza** — il report mostra chiaramente cosa manca e offre, come passo successivo, una consulenza personalizzata con l'operatore umano.

**Non è** un generatore automatico di documentazione legale vincolante. **È** un punto di partenza che dimostra competenza e genera contatti commerciali.

## 2. Stack Tecnologico

| Livello | Tecnologia | Ruolo |
|---|---|---|
| **Framework** | Next.js 14+ (App Router) | Full-stack. Backend (API Routes) e frontend in unico progetto |
| **Linguaggio** | TypeScript | Tipizzazione statica su tutto il codice |
| **Frontend UI** | Tailwind CSS + shadcn/ui | Componenti riutilizzabili, look professionale, responsive |
| **Backend** | Next.js API Routes | Logica questionario, classificazione, generazione report, lead capture |
| **AI** | Claude API (Anthropic) | Classificazione AI Act + report gap analysis |
| **Database** | PostgreSQL (locale su VPS) | Sessioni questionario, report generati, lead contatti |
| **ORM** | Prisma | Type-safe, migrations automatiche, connessione PostgreSQL |
| **PDF** | @react-pdf/renderer | Export report preliminare in PDF |
| **Email** | Resend / Nodemailer | Notifica lead e invio report |
| **Process Manager** | PM2 | Mantiene Next.js sempre attivo |
| **Reverse Proxy** | Nginx | TLS (Certbot), routing, caching |
| **Hosting** | VPS (Ubuntu/Debian) | Deploy diretto, nessun vendor lock |
| **Dominio** | Personalizzato (.it / .com) | Puntato alla VPS |

## 3. Struttura Cartelle

```
ai-act-tool/
├── app/
│   ├── layout.tsx                # Layout root (header, footer, font, analytics)
│   ├── page.tsx                  # Landing page
│   ├── globals.css               # Stili globali Tailwind
│   │
│   ├── questionnaire/
│   │   ├── page.tsx              # Avvio questionario multi-step
│   │   ├── step-sector.tsx       # Step 1: Settore merceologico
│   │   ├── step-purpose.tsx      # Step 2: Scopo del sistema AI
│   │   ├── step-users.tsx        # Step 3: Utenti coinvolti
│   │   ├── step-decisions.tsx    # Step 4: Decisioni automatizzate?
│   │   ├── step-data.tsx         # Step 5: Dati trattati (biometrici, sensibili?)
│   │   ├── step-safety.tsx       # Step 6: Componente di sicurezza?
│   │   ├── step-interaction.tsx  # Step 7: Interazione umana (chatbot, deepfake?)
│   │   └── step-contact.tsx      # Step 8 (opzionale): Email per ricevere il report
│   │
│   ├── report/
│   │   └── [id]/
│   │       └── page.tsx          # Pagina report: classificazione + gap analysis + CTA consulenza
│   │
│   ├── pricing/
│   │   └── page.tsx              # Pagina consulenza: pacchetti e contatto
│   │
│   ├── api/
│   │   ├── questionnaire/
│   │   │   └── route.ts          # POST — Processa risposte, chiama Claude, salva report
│   │   ├── report/
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET recupera report / POST genera PDF
│   │   ├── lead/
│   │   │   └── route.ts          # POST — Salva contatto e invia notifica
│   │   └── contact/
│   │       └── route.ts          # POST — Richiesta consulenza
│   │
│   └── robot.ts                  # robots.txt
│
├── components/
│   ├── ui/                       # shadcn/ui componenti base
│   │   └── ...
│   │
│   ├── landing/
│   │   ├── hero-section.tsx      # Hero + value proposition
│   │   ├── how-it-works.tsx      # Spiegazione tool in 3 step
│   │   ├── risk-categories.tsx   # Le 4 categorie di rischio spiegate
│   │   └── cta-section.tsx       # "Inizia la valutazione" + "Prenota consulenza"
│   │
│   ├── questionnaire/
│   │   ├── progress-bar.tsx      # Indicatore avanzamento
│   │   ├── step-wrapper.tsx      # Wrapper animato per ogni step
│   │   └── step-indicator.tsx    # Pallini navigazione step
│   │
│   ├── report/
│   │   ├── risk-badge.tsx        # Badge livello rischio (colore)
│   │   ├── risk-gauge.tsx        # Visualizzazione livello rischio
│   │   ├── classification-summary.tsx  # Riepilogo classificazione
│   │   ├── gap-analysis.tsx      # Sezione: cosa manca per essere compliant
│   │   ├── next-steps.tsx        # CTA: "Prenota consulenza per la documentazione completa"
│   │   ├── disclaimer-banner.tsx # Disclaimer: report preliminare, non legale
│   │   └── download-pdf.tsx      # Export PDF
│   │
│   └── shared/
│       ├── header.tsx
│       ├── footer.tsx
│       └── loading-spinner.tsx
│
├── lib/
│   ├── prisma.ts                 # Istanza Prisma client singleton
│   ├── claude.ts                 # Wrapper chiamate Claude API
│   ├── ai-act/
│   │   ├── classification-prompt.ts  # Prompt per classificazione (basato su risposte)
│   │   ├── report-prompt.ts      # Prompt per report gap analysis
│   │   └── questions.ts          # Schema domande + opzioni per ogni step
│   ├── pdf-generator.ts          # Generazione PDF report
│   └── utils.ts
│
├── types/
│   ├── questionnaire.ts          # TypeScript types per risposte questionario
│   └── report.ts                 # TypeScript types per report generato
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── public/
│   └── images/
│       ├── logo.svg
│       ├── risk-unacceptable.svg
│       ├── risk-high.svg
│       ├── risk-limited.svg
│       ├── risk-minimal.svg
│       └── og-image.png
│
├── .env.local                    # CLAUDE_API_KEY, DATABASE_URL, RESEND_API_KEY
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── postcss.config.js
└── README.md
```

## 4. Funzionamento del Tool

### 4.1 Flusso Utente (end-to-end)

```
┌──────────────────────────────────────────────────────────────────────┐
│                       FLUSSO UTENTE                                   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. ATTERRAGGIO                                                      │
│     │  • Landing page spiega il problema: "L'AI Act scatta il        │
│     │     2 agosto 2026 — il tuo sistema AI è conforme?"             │
│     │  • Spiega le 4 categorie di rischio                            │
│     │  • Due CTA: "Valuta il tuo sistema gratis" / "Prenota          │
│     │    consulenza"                                                  │
│     │                                                                │
│     ▼                                                                │
│  2. QUESTIONARIO MULTI-STEP (8 passaggi, ~3 minuti)                  │
│     │                                                                │
│     │  Step 1 — Settore:     Sanità, Finanza, HR, Istruzione,        │
│     │                        Pubblica Amministrazione, E-commerce,    │
│     │                        Intrattenimento, Altro                   │
│     │  Step 2 — Scopo:       A cosa serve il sistema? Descrizione     │
│     │  Step 3 — Utenti:      Chi usa il sistema? (professionisti,    │
│     │                        cittadini, minori, dipendenti)          │
│     │  Step 4 — Decisioni:   Prende decisioni autonome?              │
│     │                        (assunzioni, crediti, accesso servizi)  │
│     │  Step 5 — Dati:        Tratta dati biometrici, genetici,       │
│     │                        o categorie particolari?                │
│     │  Step 6 — Sicurezza:   È componente di sicurezza di prodotti   │
│     │                        (macchinari, DPI, dispositivi medici)?  │
│     │  Step 7 — Interazione: Chatbot, deepfake, sistemi che          │
│     │                        interagiscono con persone fisiche?       │
│     │  Step 8 — Contatto:    (opzionale) Email per ricevere report   │
│     │                        completo via PDF                         │
│     │                                                                │
│     │  Ogni step ha un'animazione, feedback visivo, e salva          │
│     │  lo stato in locale (sicuro, nessun dato viene inviato         │
│     │  finché non completi il questionario)                          │
│     │                                                                │
│     ▼                                                                │
│  3. ELABORAZIONE                                                     │
│     │  • API /api/questionnaire riceve tutte le risposte             │
│     │  • Costruisce un prompt strutturato per Claude con:            │
│     │    - AI Act completo (Art. 5, 6, Annex III, Titolo IV)        │
│     │    - Tutte le risposte del questionario                        │
│     │    - Richiesta: classifica + spiega + identifica gap           │
│     │  • Claude restituisce JSON con:                                │
│     │    - Categoria di rischio (con motivazione)                    │
│     │    - Articoli applicabili                                      │
│     │    - Obblighi specifici                                        │
│     │    - Gap analysis (cosa manca)                                 │
│     │    - Priorità azioni (alta/media/bassa)                        │
│     │  • Salva report su PostgreSQL (con o senza email)             │
│     │  • Restituisce ID report                                       │
│     │                                                                │
│     ▼                                                                │
│  4. PAGINA REPORT /report/[id]                                       │
│     │  • BANNER DISCLAIMER (visibile, non ignorabile):               │
│     │    "Questo report è una valutazione preliminare generata       │
│     │     da AI. Non costituisce consulenza legale. Per la           │
│     │     documentazione di conformità ufficiale, consulta           │
│     │     un professionista abilitato."                              │
│     │                                                                │
│     │  • RISULTATO CLASSIFICAZIONE:                                  │
│     │    - Gauge/indicatore visivo del livello di rischio            │
│     │    - Badge colore (rosso/arancione/giallo/verde)               │
│     │    - Testo esplicativo: perché questa classificazione          │
│     │                                                                │
│     │  • GAP ANALYSIS:                                               │
│     │    - Checklist: cosa hai ✓  / cosa manca ✗                     │
│     │    - Per ogni gap: spiegazione + gravità                       │
│     │    - Azioni prioritarie ordinate                               │
│     │                                                                │
│     │  • NEXT STEPS (CTA principale):                                │
│     │    "Questo è un primo screening. Per la documentazione         │
│     │     completa (risk assessment, technical doc, conformity)      │
│     │     prenota una consulenza con un esperto."                    │
│     │    → Pulsante "Prenota consulenza" → email/calendly            │
│     │                                                                │
│     │  • DOWNLOAD PDF: report completo in formato scaricabile       │
│     │                                                                │
│     ▼                                                                │
│  5. (OPZIONALE) CONSULENZA                                           │
│     │  • L'utente richiede consulenza                                │
│     │  • Ricevi notifica via email                                   │
│     │  • Tool ha già tutte le risposte del questionario + report     │
│     │  • Arrivi preparato al colloquio commerciale                   │
│     │                                                                │
└──────────────────────────────────────────────────────────────────────┘
```

### 4.2 Schema del Questionario

```typescript
interface QuestionnaireAnswers {
  sector: 'healthcare' | 'finance' | 'hr' | 'education' |
          'public-admin' | 'ecommerce' | 'entertainment' | 'other';
  sectorOther?: string;

  purpose: string;                        // Descrizione libera ma guidata

  endUsers: ('professionals' | 'general-public' | 'minors' | 'employees' |
             'vulnerable-persons')[];

  autonomousDecisions: boolean;
  decisionTypes?: ('hiring' | 'credit' | 'access-to-service' |
                   'insurance' | 'promotion' | 'other')[];

  processesBiometricData: boolean;
  processesGeneticData: boolean;
  processesSpecialCategoryData: boolean;

  isSafetyComponent: boolean;
  safetyDomains?: ('machinery' | 'medical-device' | 'toys' |
                   'lift' | 'ppi' | 'other')[];

  humanInteraction: 'chatbot' | 'deepfake' | 'emotional-recognition' |
                    'none' | 'other';

  contactEmail?: string;                  // Opzionale
}
```

### 4.3 Logica di Classificazione

La classificazione segue l'albero decisionale dell'AI Act:

```
┌─────────────────────────────────────────────────────┐
│              ALBERO DECISIONALE AI ACT                │
├──────────────────────────────────────────────────────┤
│                                                       │
│  1. Art. 5 — Pratiche PROIBITE?                      │
│     (social scoring, manipolazione subliminale,       │
│      biometric categorization da immagini remote,     │
│      real-time biometric surveillance in public)      │
│     → SE SÌ: RISCHIO INACCETTABILE (stop)            │
│                                                       │
│  2. Art. 6(1) — Componente di sicurezza?             │
│     (prodotti regolati da legislazione EU armonizzata │
│      tipo macchinari, DPI, giocattoli, ascensori,     │
│      dispositivi medici)                              │
│     + richiede valutazione conformità da parte terza  │
│     → SE SÌ: ALTO RISCHIO                             │
│                                                       │
│  3. Annex III — Casi d'uso specifici?                 │
│     (biometria, infrastrutture critiche, istruzione,  │
│      occupazione, accesso servizi, law enforcement,   │
│      immigrazione, giustizia)                         │
│     + NON è esclusione (Art. 6(3))                    │
│     → SE SÌ: ALTO RISCHIO                             │
│                                                       │
│  4. Titolo IV — Obblighi trasparenza?                 │
│     (chatbot, deepfake, sistemi che interagiscono     │
│      con persone)                                     │
│     → SE SÌ: RISCHIO LIMITATO                         │
│                                                       │
│  5. Nessuno dei sopra?                                │
│     → RISCHIO MINIMO (nessun obbligo specifico)       │
│                                                       │
└──────────────────────────────────────────────────────┘
```

L'albero viene implementato **via prompt a Claude** invece che con regole hard-coded, perché l'AI Act ha zone grigie e casi borderline che un umano (o LLM) sa interpretare meglio di un if-else rigido. Claude riceve tutte le risposte + il testo degli articoli e produce la classificazione ragionata.

### 4.4 Prompt Template

**Prompt Classificazione + Gap Analysis:**

```
Sei un consulente esperto di AI Act (Regolamento UE 2024/1689).

Un'azienda ha fornito le seguenti informazioni sul proprio sistema AI:
[Settore]: {sector}
[Scopo]: {purpose}
[Utenti]: {endUsers}
[Decisioni autonome]: {autonomousDecisions} — {decisionTypes}
[Dati biometrici/genetici/speciali]: {biometricData} / {geneticData} / {specialData}
[Componente sicurezza]: {isSafetyComponent} — {safetyDomains}
[Interazione umana]: {humanInteraction}

Il tuo compito:
1. Classifica il sistema secondo l'AI Act (unacceptable | high | limited | minimal)
2. Spiega la motivazione citando articoli specifici
3. Elenca gli obblighi applicabili
4. Identifica i gap: cosa manca all'azienda per essere compliant
5. Assegna priorità a ogni azione (alta/media/bassa)

Rispondi SOLO con JSON in questa struttura:
{
  "risk_category": "unacceptable" | "high" | "limited" | "minimal",
  "risk_score": number (1-100),
  "applicable_articles": [{ "article": string, "description": string }],
  "rationale": string,
  "obligations": [{ "area": string, "description": string, "deadline": string }],
  "gaps": [{ "area": string, "description": string, "severity": "high" | "medium" | "low" }],
  "priority_actions": [{ "action": string, "priority": "high" | "medium" | "low" }]
}
```

### 4.5 Prompt Report (per la versione "consultabile")

```
Genera un report di compliance AI Act in linguaggio chiaro per un imprenditore
non tecnico. Parti da questi dati:

Classificazione: {risk_category}
Motivazione: {rationale}
Gap individuati: {gaps}

Struttura del report:
1. RIEPILOGO ESECUTIVO (2-3 frasi)
2. CLASSIFICAZIONE DEL SISTEMA (con spiegazione semplice)
3. OBBLIGHI APPLICABILI (cosa deve fare l'azienda)
4. GAP ANALYSIS (cosa manca, priorità, costo stimato effort)
5. NEXT STEPS (passi concreti, consiglio se serve consulente esterno)

Tono: professionale ma accessibile, senza gergo legale inutile.
Output in Markdown.
```

### 4.6 Strategia Lead (da consulenza)

Il tool cattura lead in 3 punti:

```
1. DURANTE IL QUESTIONARIO (Step 8)
   "Lasciaci la tua email per ricevere il report completo"
   → Lead magnet: report PDF in cambio di email
   → Vantaggio: utente già qualificato (ha speso 3 minuti)

2. NELLA PAGINA REPORT
   "Questo è uno screening iniziale. Per la compliance completa,
    abbiamo preparato [offerta consulenza]"
   → Pulsante "Prenota una call conoscitiva gratuita"
   → Integrazione Calendly / form contatto diretto

3. FOLLOW-UP AUTOMATICO
   Se l'utente ha lasciato l'email ma non ha prenotato:
   → 24h dopo: email con "Hai visto il report? Se hai dubbi, ecco
     una guida gratuita su [tema pertinente al suo settore]"
   → 7 giorni dopo: "L'AI Act scade tra X settimane. Prenota ora."
```

### 4.7 Modello Dati (Database)

```
┌──────────────────┐       ┌───────────────────────┐
│      Lead        │       │      SessionReport      │
├──────────────────┤       ├───────────────────────┤
│ id               │──┐    │ id                    │
│ email            │  │    │ leadId (FK)           │── opzionale
│ name             │  │    │ questionnaireAnswers  │ (JSON)
│ source           │  │    │ riskCategory          │
│ (questionnaire/  │  │    │ classificationJSON    │ (JSON)
│  contact/cta)    │  │    │ reportMarkdown        │ (testo report)
│ prenotazioneCall │  │    │ pdfGenerated          │ (boolean)
│ createdAt        │  └─── │ createdAt             │
│ notes            │       │ viewedAt              │
└──────────────────┘       └───────────────────────┘
```

## 5. Deploy su VPS (Ubuntu/Debian)

```bash
# Prerequisiti
sudo apt update && sudo apt upgrade -y
sudo apt install nginx postgresql -y
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install nodejs -y
npm install -g pm2

# Database
sudo -u postgres createdb ai_act_tool

# App
git clone <repo-url> /var/www/ai-act-tool
cd /var/www/ai-act-tool
npm install
cp .env.example .env.local
# Configura .env.local

npx prisma migrate deploy
npm run build

pm2 start npm --name "ai-act" -- start
pm2 save
pm2 startup

# Nginx
sudo nano /etc/nginx/sites-available/ai-act
# reverse proxy → localhost:3000

sudo ln -s /etc/nginx/sites-available/ai-act /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# TLS
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tuodominio.it
```

## 6. Criteri di Qualità

1. **Performance**: Lighthouse >90
2. **SEO**: Meta tag, OG image, sitemap
3. **Accessibilità**: WCAG 2.1 AA
4. **Responsive**: Mobile-first
5. **Codice**: TypeScript strict, ESLint, Prettier
6. **UX**: Scheletri di caricamento, animazioni fluide, messaggi di errore chiari
7. **Disclaimer legale**: Visibile in report e landing, non sepolto in footer
8. **Branding**: Logo, palette, dominio personalizzato
