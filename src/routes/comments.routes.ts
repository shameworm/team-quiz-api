import express from 'express';

import {
  getCommentsById,
  addComment,
  updateComment,
  deleteComment,
  resetComments,
} from '../controllers/comments.controller';
import { validateRequest } from '../middleware/zod-validation.middleware';
import { auth } from '../middleware/auth.middleware';
import { commentZodSchema } from '../models/zod-schemas/comments.zod.schema';

export const router = express.Router();

router.use(auth);

router.get('/:gameId/comments', getCommentsById);

router.post(
  '/:gameId/comments/comment',
  validateRequest(commentZodSchema),
  addComment
);

router.patch(
  '/:gameId/comments/:commentId',
  validateRequest(commentZodSchema),
  updateComment
);

router.delete('/:gameId/comments/:commentId', deleteComment);

router.delete('/:gameId/comments', resetComments);
