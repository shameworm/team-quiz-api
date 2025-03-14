import mongoose, { Document, Schema } from 'mongoose';

export interface IBrainstormQuestion extends Document {
  question: string;
  answer: string;
  points: number;
}

export interface IBrainstormCategory extends Document {
  name: string;
  easy: IBrainstormQuestion;
  hard: IBrainstormQuestion;
}

export interface IBrainstorm extends Document {
  categories: IBrainstormCategory[];
}

const brainstormCategorySchema = new Schema<IBrainstormCategory>({
  name: { type: String, required: true },
  easy: {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    points: { type: String, required: true, default: 1 },
  },
  hard: {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    points: { type: String, required: true, default: 2 },
  },
});

const brainstormSchema = new Schema<IBrainstorm>({
  categories: { type: [brainstormCategorySchema], default: [] },
});

export const Brainstorm = mongoose.model<IBrainstorm>(
  'Brainstorm',
  brainstormSchema
);
