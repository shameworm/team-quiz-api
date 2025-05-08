import mongoose, { Document, Schema } from 'mongoose';

export interface ITimeRaceCategory extends Document {
  name: string;
  examples: string[];
}

export interface ITimeRace extends Document {
  categories: ITimeRaceCategory[];
}

const timeRaceCategorySchema = new Schema<ITimeRaceCategory>({
  name: { type: String, required: true },
  examples: [{ type: String, required: true }],
});

const timeRaceSchema = new Schema<ITimeRace>({
  categories: { type: [timeRaceCategorySchema], default: [] },
});

export const TimeRace = mongoose.model<ITimeRace>('TimeRace', timeRaceSchema);
