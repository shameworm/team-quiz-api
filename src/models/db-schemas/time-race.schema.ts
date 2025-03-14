import mongoose, { Document, Schema } from 'mongoose';

export interface ITimeRaceCategory extends Document {
  name: string;
  examples: string[];
}

export interface ITimeRace extends Document {
  timeLimit: number;
  numberOfItems: number;
  categories: ITimeRaceCategory[];
}

const timeRaceCategorySchema = new Schema<ITimeRaceCategory>({
  name: { type: String, required: true },
  examples: [{ type: String, required: true }],
});

const timeRaceSchema = new Schema<ITimeRace>({
  timeLimit: { type: Number, required: true },
  numberOfItems: { type: Number, required: true },
  categories: [timeRaceCategorySchema],
});

export const TimeRace = mongoose.model<ITimeRace>('TimeRace', timeRaceSchema);
