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
  },
  comments: {
    type: Schema.Types.ObjectId,
    ref: 'Comments',
  },
  timeRace: {
    type: Schema.Types.ObjectId,
    ref: 'TimeRace',
  },
  alias: {
    type: Schema.Types.ObjectId,
    ref: 'Alias',
  },
});

gameSchema.pre('save', async function (next) {
  try {
    if (!this.brainstorm) {
      const brainstorm = new Brainstorm();
      await brainstorm.save();
      this.brainstorm = brainstorm._id as mongoose.Types.ObjectId;
    }

    if (!this.comments) {
      const comments = new Comments();
      await comments.save();
      this.comments = comments._id as mongoose.Types.ObjectId;
    }

    if (!this.timeRace) {
      const timeRace = new TimeRace();
      await timeRace.save();
      this.timeRace = timeRace._id as mongoose.Types.ObjectId;
    }

    if (!this.alias) {
      const alias = new Alias();
      await alias.save();
      this.alias = alias._id as mongoose.Types.ObjectId;
    }

    next();
  } catch (error: unknown) {
    next(error as any);
  }
});

export const Game = mongoose.model<IGame>('Game', gameSchema);
