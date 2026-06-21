export interface AiActClassification {
  riskCategory: "unacceptable" | "high" | "limited" | "minimal";
  riskScore: number;
  applicableArticles: { article: string; description: string }[];
  rationale: string;
  obligations: { area: string; description: string; deadline: string }[];
  gaps: { area: string; description: string; severity: "high" | "medium" | "low" }[];
  priorityActions: { action: string; priority: "high" | "medium" | "low" }[];
}
