-- CreateTable
CREATE TABLE "SessionReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionnaireAnswers" TEXT NOT NULL,
    "riskCategory" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "classificationJson" TEXT NOT NULL,
    "reportMarkdown" TEXT NOT NULL,
    "pdfGenerated" BOOLEAN NOT NULL DEFAULT false,
    "leadId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewedAt" DATETIME,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "SessionReport_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "name" TEXT,
    "source" TEXT NOT NULL,
    "hasBookedCall" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contactedAt" DATETIME
);
