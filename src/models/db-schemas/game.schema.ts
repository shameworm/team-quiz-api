import mongoose, { Document, Schema } from 'mongoose';
import { Brainstorm } from './brainstorm.schema';
import { Comments } from './comments.schema';
import { TimeRace } from './time-race.schema';
import { Alias } from './alias.schema';

export interface IGame extends Document {
  name: string;
  description: string;
  image: string;
  createdBy: mongoose.Types.ObjectId;
  brainstorm: mongoose.Types.ObjectId;
  comments: mongoose.Types.ObjectId;
  timeRace: mongoose.Types.ObjectId;
  alias: mongoose.Types.ObjectId;
}

const gameSchema = new Schema<IGame>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  brainstorm: {
    type: Schema.Types.ObjectId,
    ref: 'Brainstorm',
    default: () => new Brainstorm().id,
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: 'Comments',
    default: () => new Comments().id,
  },
  timeRace: {
    type: Schema.Types.ObjectId,
    ref: 'TimeRace',
    default: () => new TimeRace().id,
  },
  alias: {
    type: Schema.Types.ObjectId,
    ref: 'Alias',
    default: () => new Alias().id,
  },
});

export const Game = mongoose.model<IGame>('Game', gameSchema);
