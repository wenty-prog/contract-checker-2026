import { Schema, type Model, type Types } from "mongoose";
import { defineModel } from "@/lib/define-model";

export interface IUser {
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDoc = IUser & { _id: Types.ObjectId };

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

export const User: Model<IUser> = defineModel("User", UserSchema);
