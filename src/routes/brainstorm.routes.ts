import express from 'express';

import {
  getBrainstormById,
  addCategory,
  updateCategory,
  deleteCategory,
  resetBrainstorm,
} from '../controllers/brainstorm.controller';
import { validateRequest } from '../middleware/zod-validation.middleware';
import { auth } from '../middleware/auth.middleware';
import { brainstormZodCategorySchema } from '../models/zod-schemas/brainstorm.zod.schema';

export const router = express.Router();

router.use(auth);

router.get('/:gameId/brainstorm', getBrainstormById);

router.post(
  '/:gameId/brainstorm/categories',
  validateRequest(brainstormZodCategorySchema),
  addCategory
);

router.patch(
  '/:gameId/brainstorm/:categoryId',
  validateRequest(brainstormZodCategorySchema),
  updateCategory
);

router.delete('/:gameId/brainstorm/:categoryId', deleteCategory);

router.delete('/:gameId/brainstorm', resetBrainstorm);
