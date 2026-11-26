// 審查紀錄的資料存取層：每個查詢都在這裡解析目前會員，
// 並以 userId 過濾，確保會員只能看到自己的紀錄
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import type { ReviewResult } from "@/lib/review-schema";
import { requireUser } from "@/lib/session";
import { ContractReview, type ContractReviewDoc } from "@/models/ContractReview";

export interface ReviewSummary {
  id: string;
  originalFileName: string;
  fileType: string;
  contractType: string;
  overallRisk: ReviewResult["overallRisk"];
  riskScore: number;
  createdAt: string;
}

export interface ReviewDetail extends ReviewSummary {
  fileSize: number;
  blobUrl: string;
  model: string;
  result: ReviewResult;
}

function toSummary(doc: ContractReviewDoc): ReviewSummary {
  return {
    id: doc._id.toString(),
    originalFileName: doc.originalFileName,
    fileType: doc.fileType,
    contractType: doc.result.contractType,
    overallRisk: doc.result.overallRisk,
    riskScore: doc.result.riskScore,
    createdAt: doc.createdAt.toISOString(),
  };
}

export async function listMyReviews(limit = 50): Promise<ReviewSummary[]> {
  const user = await requireUser("/history");
  await connectToDatabase();
  const docs = await ContractReview.find({ userId: user.id })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean<ContractReviewDoc[]>();
  return docs.map(toSummary);
}

/** 找不到、或不是自己的紀錄，一律回傳 null（不透露紀錄是否存在） */
export async function getMyReview(id: string): Promise<ReviewDetail | null> {
  const user = await requireUser(`/history/${id}`);
  if (!isValidObjectId(id)) return null;
  await connectToDatabase();
  const doc = await ContractReview.findOne({ _id: id, userId: user.id }).lean<ContractReviewDoc>();
  if (!doc) return null;
  return {
    ...toSummary(doc),
    fileSize: doc.fileSize,
    blobUrl: doc.blobUrl,
    model: doc.model,
    result: doc.result,
  };
}
