import mongoose, { type Model, type Schema } from "mongoose";

/**
 * 註冊 mongoose model。
 * 開發模式熱重載時，mongoose.models 裡會留著「舊版 schema」的 model，
 * 直接沿用的話新加的欄位會被靜默丟掉，所以每次都用最新的 schema 重新註冊。
 */
export function defineModel<T>(name: string, schema: Schema<T>): Model<T> {
  if (mongoose.models[name]) {
    mongoose.deleteModel(name);
  }
  return mongoose.model<T>(name, schema);
}
