import mongoose, { Document, Schema } from 'mongoose';
import { Brainstorm } from './brainstorm.schema';
import { Comments } from './comments.schema';
import { TimeRace } from './time-race.schema';

export interface IGame extends Document {
  name: string;
  description: string;
  image: string;
  createdBy: mongoose.Types.ObjectId;
  brainstorm: mongoose.Types.ObjectId;
  comments: mongoose.Types.ObjectId;
  timeRace: mongoose.Types.ObjectId;
}

const gameSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  brainstorm: {
    type: Schema.Types.ObjectId,
    ref: 'Brainstorm',
    default: function () {
      return new Brainstorm()._id;
    },
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: 'Comments',
    default: function () {
      return new Comments()._id;
    },
  },
  timeRace: {
    type: Schema.Types.ObjectId,
    ref: 'TimeRace',
    default: function () {
      return new TimeRace()._id;
    },
  },
});

export const Game = mongoose.model<IGame>('Game', gameSchema);
