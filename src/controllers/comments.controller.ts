import { Request, Response, NextFunction } from 'express';

import { Game } from '../models/db-schemas/game.schema';
import { Comments, IComment } from '../models/db-schemas/comments.schema';
import { HttpError } from '../models/custom/http-error';

export const getCommentsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId } = req.params;
  let game;

  try {
    game = await Game.findById(gameId).populate('comments');
  } catch (_error) {
    return next(
      new HttpError('Fetching comments for game failed, please try again', 500)
    );
  }

  if (!game) {
    return next(new HttpError('Game not found', 404));
  }

  if (!game.comments) {
    return next(new HttpError('Comments not found', 404));
  }

  res.status(200).json({ comments: game.comments });
};

export const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId } = req.params;
  const { text, videos } = req.body;

  let game;
  try {
    game = await Game.findById(gameId);
  } catch (_error) {
    return next(new HttpError('Adding comment failed, please try again', 500));
  }

  if (!game) {
    return next(new HttpError('Game not found', 404));
  }

  let comments;

  try {
    comments = await Comments.findById(game.comments);
  } catch (_error) {
    return next(
      new HttpError('Fetching comments failed, please try again', 500)
    );
  }

  if (!comments) {
    return next(new HttpError('Comments not found', 404));
  }

  const newComment: IComment = {
    text,
    videos,
  } as IComment;

  try {
    comments.comments.push(newComment);
    await comments.save();
  } catch (_error) {
    return next(new HttpError('Adding comment failed, please try again', 500));
  }

  res.status(200).json({
    message: 'Comment successfully added',
    comment: newComment.toObject({ getters: true }),
  });
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId, commentId } = req.params;
  const { text, videos } = req.body;

  let game;
  try {
    game = await Game.findById(gameId);
  } catch (_error) {
    return next(new HttpError('Adding comment failed, please try again', 500));
  }

  if (!game) {
    return next(new HttpError('Game not found', 404));
  }

  let comments;
  try {
    comments = await Comments.findById(game.comments);
  } catch (_error) {
    return next(
      new HttpError('Fetching comments failed, please try again', 500)
    );
  }

  if (!comments) {
    return next(new HttpError('Comments not found', 404));
  }

  const commentIndex = comments.comments.findIndex(
    (comment) => comment.id.toString() === commentId
  );

  if (commentIndex === -1) {
    return next(new HttpError('Comment not found', 404));
  }

  try {
    if (text) {
      comments.comments[commentIndex].text = text;
    }

    if (videos) {
      comments.comments[commentIndex].videos = videos;
    }

    await comments.save();
  } catch (_error) {
    return next(
      new HttpError('Updating category failed, please try again', 500)
    );
  }

  res.status(200).json({ message: `${text} successfully updated`, comments });
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId, commentId } = req.params;

  let game;
  try {
    game = await Game.findById(gameId);
  } catch (_error) {
    return next(
      new HttpError('Deleting category failed, please try again', 500)
    );
  }

  if (!game) {
    return next(new HttpError('Game not found', 404));
  }

  let comments;
  try {
    comments = await Comments.findById(game.comments);
  } catch (_error) {
    return next(
      new HttpError('Fetching comments failed, please try again', 500)
    );
  }

  if (!comments) {
    return next(new HttpError('Comments not found', 404));
  }

  try {
    comments.comments = comments.comments.filter(
      (category) => category.id.toString() !== commentId
    );
    await comments.save();
  } catch (_error) {
    return next(
      new HttpError('Deleting comment failed, please try again', 500)
    );
  }

  res.status(200).json({ message: 'Comment deleted successfully' });
};

export const resetComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId } = req.params;

  let game;
  try {
    game = await Game.findById(gameId);
  } catch (_error) {
    return next(
      new HttpError('Resetting comments failed, please try again', 500)
    );
  }

  if (!game) {
    return next(new HttpError('Game not found', 404));
  }

  let comments;
  try {
    comments = await Comments.findById(game.comments);
  } catch (_error) {
    return next(
      new HttpError('Fetching comments failed, please try again', 500)
    );
  }

  if (!comments) {
    return next(new HttpError('Comments not found', 404));
  }

  try {
    comments.comments = [];
    await comments.save();
  } catch (_error) {
    return next(
      new HttpError('Resetting comments failed, please try again', 500)
    );
  }

  res.status(200).json({ message: 'Comments reset successfully' });
};
