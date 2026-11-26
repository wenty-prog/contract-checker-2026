import { Schema, type Model, type Types } from "mongoose";
import { defineModel } from "@/lib/define-model";
import type { ReviewResult } from "@/lib/review-schema";

export interface IContractReview {
  userId: Types.ObjectId;
  originalFileName: string;
  fileType: "pdf" | "docx" | "txt";
  fileSize: number;
  blobUrl: string;
  blobPathname: string;
  model: string;
  result: ReviewResult;
  createdAt: Date;
  updatedAt: Date;
}

export type ContractReviewDoc = IContractReview & { _id: Types.ObjectId };

const riskLevel = { type: String, enum: ["low", "medium", "high"], required: true };

const ContractReviewSchema = new Schema<IContractReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    originalFileName: { type: String, required: true },
    fileType: { type: String, enum: ["pdf", "docx", "txt"], required: true },
    fileSize: { type: Number, required: true },
    blobUrl: { type: String, required: true },
    blobPathname: { type: String, required: true },
    model: { type: String, required: true },
    result: {
      contractType: { type: String, required: true },
      parties: { type: [String], default: [] },
      summary: { type: String, required: true },
      overallRisk: riskLevel,
      riskScore: { type: Number, required: true },
      riskyClauses: [
        {
          _id: false,
          title: String,
          originalText: String,
          riskLevel,
          explanation: String,
          suggestion: String,
        },
      ],
      missingClauses: [{ _id: false, title: String, reason: String }],
      recommendations: { type: [String], default: [] },
    },
  },
  { timestamps: true },
);

// 查詢一律帶 userId，依時間排序
ContractReviewSchema.index({ userId: 1, createdAt: -1 });

export const ContractReview: Model<IContractReview> = defineModel(
  "ContractReview",
  ContractReviewSchema,
);
