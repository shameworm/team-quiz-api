import mongoose, { Document, Schema } from 'mongoose';

export interface IAlias extends Document {
  words: string[];
}

const aliasSchema = new Schema<IAlias>({
  words: { type: [String], default: [] },
});

export const Alias = mongoose.model<IAlias>('Alias', aliasSchema);
