export function buildClassificationPrompt(
  answers: Record<string, unknown>,
): string {
  return `Sei un consulente esperto di AI Act (Regolamento UE 2024/1689). Il tuo compito è analizzare un sistema AI e classificarlo secondo il regolamento.

## CONTESTO NORMATIVO

### Art. 5 — Pratiche di IA proibite (rischio inaccettabile)
Sono proibiti i sistemi AI che:
- Impiegano tecniche subliminali per manipolare persone
- Sfruttano vulnerabilità di gruppi specifici (età, disabilità)
- Valutano o classificano persone basandosi su comportamento sociale (social scoring)
- Real-time biometric surveillance in spazi accessibili al pubblico per finalità di law enforcement (salvo eccezioni limitate)
- Biometric categorization basata su caratteristiche sensibili (razza, opinioni politiche, religione)
- Creano database di riconoscimento facciale tramite scraping non mirato di immagini da internet o CCTV

### Art. 6 + Allegato III — Criteri per IA ad alto rischio

Un sistema è ad alto rischio SE:
(A) È un componente di sicurezza di prodotti regolati da legislazione UE armonizzata (macchinari, DPI, giocattoli, ascensori, dispositivi medici) E il prodotto richiede valutazione di conformità da parte terza.
(B) Rientra in UNO di questi ambiti dell'Allegato III:
  1. Biometria: sistemi di identificazione remota, categorizzazione, riconoscimento emotivo
  2. Infrastrutture critiche: componenti di sicurezza di infrastrutture critiche (traffico, acqua, gas, elettricità)
  3. Istruzione: ammissione, valutazione, monitoraggio durante test
  4. Occupazione: assunzioni, promozioni, valutazione performance
  5. Accesso a servizi: credit scoring, accesso a servizi essenziali (sanità, assicurazioni), valutazione solvibilità
  6. Law enforcement: valutazione rischio, polizia predittiva, analisi prove
  7. Migrazione: esame domande d'asilo, visti
  8. Giustizia: applicazione della legge, risoluzione controversie

### Titolo IV — Obblighi di trasparenza (rischio limitato)
Obblighi per:
- Sistemi che interagiscono con persone (chatbot, assistenti virtuali) — obbligo di informare che si interagisce con un sistema AI
- Deepfake e contenuti sintetici — obbligo di etichettatura
- Sistemi di categorizzazione biometrica o riconoscimento emotivo

### Rischio minimo
Nessun obbligo specifico. Codici di condotta volontari.

## SISTEMA DA ANALIZZARE

Settore: ${answers.sector}
Descrizione: ${answers.purpose}
Utenti: ${(answers.endUsers as string[])?.join(", ")}
Decisioni autonome: ${answers.autonomousDecisions}
${answers.autonomousDecisions ? `Tipo decisioni: ${(answers.decisionTypes as string[])?.join(", ")}` : ""}
Dati biometrici: ${answers.processesBiometricData ? "SÌ" : "NO"}
Dati genetici: ${answers.processesGeneticData ? "SÌ" : "NO"}
Categorie speciali: ${answers.processesSpecialCategoryData ? "SÌ" : "NO"}
Componente sicurezza: ${answers.isSafetyComponent}
${answers.isSafetyComponent ? `Ambito sicurezza: ${(answers.safetyDomains as string[])?.join(", ")}` : ""}
Interazione umana: ${answers.humanInteraction}

## COMPITO

1. Classifica il sistema in UNA delle 4 categorie: unacceptable | high | limited | minimal
2. Assegna un punteggio di rischio da 1 a 100
3. Spiega la motivazione citando articoli specifici dell'AI Act
4. Elenca gli obblighi applicabili al sistema
5. Identifica i gap (cosa manca all'azienda per essere compliant)
6. Elenca le azioni prioritarie ordinate per importanza

Rispondi SOLO con JSON valido, senza testo aggiuntivo. Usa questa struttura esatta:
{
  "riskCategory": "unacceptable" | "high" | "limited" | "minimal",
  "riskScore": number,
  "applicableArticles": [{ "article": string, "description": string }],
  "rationale": string,
  "obligations": [{ "area": string, "description": string, "deadline": string }],
  "gaps": [{ "area": string, "description": string, "severity": "high" | "medium" | "low" }],
  "priorityActions": [{ "action": string, "priority": "high" | "medium" | "low" }]
}`;
}

export function buildReportPrompt(
  riskCategory: string,
  riskScore: number,
  rationale: string,
  gaps: { area: string; description: string; severity: string }[],
  obligations: { area: string; description: string; deadline: string }[],
  priorityActions: { action: string; priority: string }[],
): string {
  return `Sei un consulente compliance AI Act. Genera un report in linguaggio chiaro per un imprenditore o manager non tecnico.

## DATI DEL REPORT
Classificazione: ${riskCategory}
Punteggio rischio: ${riskScore}/100
Motivazione: ${rationale}
Obblighi: ${JSON.stringify(obligations)}
Gap individuati: ${JSON.stringify(gaps)}
Azioni prioritarie: ${JSON.stringify(priorityActions)}

## STRUTTURA RICHIESTA

Genera un report in Markdown con queste sezioni:

### 1. Riepilogo Esecutivo (2-3 frasi)
Spiega in parole semplici qual è la classificazione e cosa significa per l'azienda.

### 2. Classificazione del Sistema
- Categoria di rischio assegnata
- Punteggio (1-100)
- Motivazione dettagliata in linguaggio chiaro

### 3. Obblighi Applicabili
Per ogni obbligo: cosa richiede la legge, a cosa serve, scadenza.

### 4. Gap Analysis
Per ogni gap: cosa manca, perché è importante, severità (alta/media/bassa).

### 5. Azioni Prioritarie
Elenco ordinato di azioni concrete che l'azienda deve intraprendere, con priorità.

### 6. Next Steps
Cosa fare ora: passi immediati, consiglio se serve consulente esterno, tempistiche.

Tono: professionale ma accessibile. Evita gergo legale non necessario. Output in Markdown.`;
}
