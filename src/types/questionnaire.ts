export interface QuestionnaireAnswers {
  sector:
    | "healthcare"
    | "finance"
    | "hr"
    | "education"
    | "public-admin"
    | "ecommerce"
    | "entertainment"
    | "other";
  sectorOther?: string;
  purpose: string;
  endUsers: (
    | "professionals"
    | "general-public"
    | "minors"
    | "employees"
    | "vulnerable-persons"
  )[];
  autonomousDecisions: boolean;
  decisionTypes?: (
    | "hiring"
    | "credit"
    | "access-to-service"
    | "insurance"
    | "promotion"
    | "other"
  )[];
  processesBiometricData: boolean;
  processesGeneticData: boolean;
  processesSpecialCategoryData: boolean;
  isSafetyComponent: boolean;
  safetyDomains?: (
    | "machinery"
    | "medical-device"
    | "toys"
    | "lift"
    | "ppi"
    | "other"
  )[];
  humanInteraction:
    | "chatbot"
    | "deepfake"
    | "emotional-recognition"
    | "none"
    | "other";
  contactEmail?: string;
}
