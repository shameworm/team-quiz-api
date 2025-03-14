import mongoose, { Document, Schema } from 'mongoose';

export interface ICommentVideo extends Document {
  video: string;
  isCorrect: boolean;
}

export interface IComment extends Document {
  text: string;
  videos: ICommentVideo[];
}

export interface IComments extends Document {
  comments: IComment[];
}

const commentsVideoSchema = new Schema<ICommentVideo>({
  video: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});

const commentSchema = new Schema<IComment>({
  text: { type: String, required: true },
  videos: [commentsVideoSchema],
});

const commentsSchema = new Schema<IComments>({
  comments: { type: [commentSchema], default: [] },
});

export const Comments = mongoose.model<IComments>('Comments', commentsSchema);
