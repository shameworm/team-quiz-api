import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  image: string;
  createdGames: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: false },
  createdGames: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
    default: [],
  },
});

export const User = mongoose.model<IUser>('User', userSchema);
