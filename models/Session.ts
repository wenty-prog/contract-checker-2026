import { Schema, type Model, type Types } from "mongoose";
import { defineModel } from "@/lib/define-model";

export interface ISession {
  // 只存 token 的 SHA-256，資料庫外洩也拿不到可用的 cookie
  tokenHash: string;
  userId: Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    tokenHash: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

// TTL 索引：過期的 session 由 MongoDB 自動刪除
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session: Model<ISession> = defineModel("Session", SessionSchema);
