import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#4f46e5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: "#6b7280",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1f2937",
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#374151",
  },
  value: {
    fontSize: 10,
    marginBottom: 4,
    color: "#4b5563",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    fontSize: 9,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  riskBadge: {
    backgroundColor: "#4f46e5",
    color: "white",
  },
  gapHigh: {
    backgroundColor: "#fef2f2",
    color: "#991b1b",
  },
  gapMedium: {
    backgroundColor: "#fefce8",
    color: "#92400e",
  },
  gapLow: {
    backgroundColor: "#f0fdf4",
    color: "#166534",
  },
  card: {
    marginBottom: 8,
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  col: {
    flex: 1,
  },
  gap: { width: 12 },
  articleItem: {
    marginBottom: 4,
    padding: 6,
    backgroundColor: "#f9fafb",
    borderRadius: 3,
  },
  articleTitle: {
    fontSize: 9,
    fontWeight: "bold",
  },
  articleDesc: {
    fontSize: 9,
    color: "#6b7280",
  },
  priorityNum: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#eef2ff",
    textAlign: "center",
    lineHeight: 18,
    fontSize: 10,
    fontWeight: "bold",
    color: "#4f46e5",
    marginRight: 8,
  },
  priorityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  priorityText: {
    flex: 1,
    fontSize: 10,
  },
  footer: {
    marginTop: 32,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    fontSize: 8,
    color: "#9ca3af",
    textAlign: "center",
  },
  disclaimer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#fffbeb",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  disclaimerText: {
    fontSize: 9,
    color: "#92400e",
    lineHeight: 1.4,
  },
  markdownSection: {
    marginTop: 12,
  },
  markdownH2: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 14,
    marginBottom: 6,
    color: "#1f2937",
  },
  markdownH3: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 4,
    color: "#374151",
  },
  markdownParagraph: {
    fontSize: 10,
    marginBottom: 4,
    color: "#4b5563",
  },
  markdownListItem: {
    fontSize: 10,
    marginBottom: 2,
    color: "#4b5563",
    paddingLeft: 12,
  },
});

const severityStyle = (severity: string) => {
  switch (severity) {
    case "high": return styles.gapHigh;
    case "medium": return styles.gapMedium;
    case "low": return styles.gapLow;
    default: return {};
  }
};

const severityLabel = (severity: string) => {
  switch (severity) {
    case "high": return "Alta";
    case "medium": return "Media";
    case "low": return "Bassa";
    default: return severity;
  }
};

function MarkdownBlock({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactElement[] = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      elements.push(<Text key={key++} style={styles.markdownH3}>{trimmed.replace("### ", "")}</Text>);
    } else if (trimmed.startsWith("## ")) {
      elements.push(<Text key={key++} style={styles.markdownH2}>{trimmed.replace("## ", "")}</Text>);
    } else if (trimmed.startsWith("- ")) {
      elements.push(<Text key={key++} style={styles.markdownListItem}>• {trimmed.replace("- ", "")}</Text>);
    } else if (trimmed === "") {
      elements.push(<Text key={key++}>{""}</Text>);
    } else {
      elements.push(<Text key={key++} style={styles.markdownParagraph}>{trimmed}</Text>);
    }
  }

  return <View style={styles.markdownSection}>{elements}</View>;
}

interface ReportPdfProps {
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
}

const riskLabels: Record<string, string> = {
  unacceptable: "Inaccettabile",
  high: "Alto",
  limited: "Limitato",
  minimal: "Minimo",
};

export function ReportPdf({ riskCategory, riskScore, classification, reportMarkdown, createdAt }: ReportPdfProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("it-IT", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Report di Conformità AI Act</Text>
          <Text style={styles.subtitle}>
            Rischio {riskLabels[riskCategory] ?? riskCategory} — Punteggio: {riskScore}/100
          </Text>
          <Text style={styles.subtitle}>Generato il {formattedDate}</Text>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ Questo report è una valutazione preliminare generata automaticamente. Non costituisce consulenza legale. Per la documentazione di conformità ufficiale, consulta un professionista abilitato.
          </Text>
        </View>

        {/* Motivazione */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Classificazione del Sistema</Text>
          <View style={styles.card}>
            <Text style={styles.value}>{classification.rationale}</Text>
          </View>
        </View>

        {/* Articoli Applicabili */}
        {classification.applicableArticles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Articoli Applicabili</Text>
            {classification.applicableArticles.map((a, i) => (
              <View key={i} style={styles.articleItem}>
                <Text style={styles.articleTitle}>{a.article}</Text>
                <Text style={styles.articleDesc}>{a.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Obblighi */}
        {classification.obligations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Obblighi Applicabili</Text>
            {classification.obligations.map((o, i) => (
              <View key={i} style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.col}>
                    <Text style={styles.label}>{o.area}</Text>
                    <Text style={styles.value}>{o.description}</Text>
                  </View>
                  <View style={styles.gap} />
                  <Text style={{ fontSize: 9, color: "#6b7280", width: 80, textAlign: "right" }}>
                    {o.deadline}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Gap Analysis */}
        {classification.gaps.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gap Analysis</Text>
            {classification.gaps.map((g, i) => (
              <View key={i} style={[styles.card, severityStyle(g.severity)]}>
                <View style={styles.row}>
                  <View style={styles.col}>
                    <Text style={styles.label}>{g.area}</Text>
                    <Text style={styles.value}>{g.description}</Text>
                  </View>
                  <Text style={{ fontSize: 9, fontWeight: "bold", width: 50, textAlign: "right" }}>
                    {severityLabel(g.severity)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Azioni Prioritarie */}
        {classification.priorityActions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Azioni Prioritarie</Text>
            {classification.priorityActions.map((a, i) => (
              <View key={i} style={styles.priorityRow}>
                <Text style={styles.priorityNum}>{i + 1}</Text>
                <Text style={styles.priorityText}>{a.action}</Text>
                <Text style={{ fontSize: 9, fontWeight: "bold", width: 50, textAlign: "right" }}>
                  {a.priority === "high" ? "Alta" : a.priority === "medium" ? "Media" : "Bassa"}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Report Markdown */}
        {reportMarkdown && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Report Dettagliato</Text>
            <MarkdownBlock text={reportMarkdown} />
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>AI Act Check — Report generato automaticamente il {formattedDate}</Text>
          <Text>Questo report non costituisce consulenza legale.</Text>
        </View>
      </Page>
    </Document>
  );
}
