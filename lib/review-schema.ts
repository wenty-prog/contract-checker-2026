export type RiskLevel = "low" | "medium" | "high";

export interface RiskyClause {
  title: string;
  originalText: string;
  riskLevel: RiskLevel;
  explanation: string;
  suggestion: string;
}

export interface MissingClause {
  title: string;
  reason: string;
}

export interface ReviewResult {
  contractType: string;
  parties: string[];
  summary: string;
  overallRisk: RiskLevel;
  riskScore: number;
  riskyClauses: RiskyClause[];
  missingClauses: MissingClause[];
  recommendations: string[];
}

const riskLevelSchema = { type: "string", enum: ["low", "medium", "high"] };

// OpenAI Structured Outputs（strict 模式）用的 JSON Schema：所有欄位都必須列在 required
export const reviewJsonSchema: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  required: [
    "contractType",
    "parties",
    "summary",
    "overallRisk",
    "riskScore",
    "riskyClauses",
    "missingClauses",
    "recommendations",
  ],
  properties: {
    contractType: { type: "string", description: "合約類型，例如：租賃契約、勞動契約" },
    parties: { type: "array", items: { type: "string" }, description: "合約當事人" },
    summary: { type: "string", description: "合約重點摘要" },
    overallRisk: riskLevelSchema,
    riskScore: { type: "integer", description: "整體風險分數 0-100，越高越危險" },
    riskyClauses: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "originalText", "riskLevel", "explanation", "suggestion"],
        properties: {
          title: { type: "string" },
          originalText: { type: "string", description: "引用合約原文" },
          riskLevel: riskLevelSchema,
          explanation: { type: "string", description: "為什麼有風險" },
          suggestion: { type: "string", description: "具體修改建議" },
        },
      },
    },
    missingClauses: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "reason"],
        properties: {
          title: { type: "string" },
          reason: { type: "string", description: "為什麼應該補上" },
        },
      },
    },
    recommendations: { type: "array", items: { type: "string" } },
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isRiskLevel(value: unknown): value is RiskLevel {
  return value === "low" || value === "medium" || value === "high";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

export function isReviewResult(value: unknown): value is ReviewResult {
  if (!isRecord(value)) return false;
  return (
    typeof value.contractType === "string" &&
    isStringArray(value.parties) &&
    typeof value.summary === "string" &&
    isRiskLevel(value.overallRisk) &&
    typeof value.riskScore === "number" &&
    Array.isArray(value.riskyClauses) &&
    value.riskyClauses.every(
      (c: unknown) =>
        isRecord(c) &&
        typeof c.title === "string" &&
        typeof c.originalText === "string" &&
        isRiskLevel(c.riskLevel) &&
        typeof c.explanation === "string" &&
        typeof c.suggestion === "string",
    ) &&
    Array.isArray(value.missingClauses) &&
    value.missingClauses.every(
      (c: unknown) => isRecord(c) && typeof c.title === "string" && typeof c.reason === "string",
    ) &&
    isStringArray(value.recommendations)
  );
}
