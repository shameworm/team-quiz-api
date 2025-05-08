import express from 'express';

import {
  getTimeRaceById,
  addCategory,
  updateCategory,
  deleteCategory,
  resetTimeRace,
} from '../controllers/time-race.controller';
import { validateRequest } from '../middleware/zod.validation';
import { timeRaceCategorySchema } from '../models/zod-schemas/time-race.zod.schema';

export const router = express.Router();

router.get('/:gameId/time-race', getTimeRaceById);

router.post(
  '/:gameId/time-race/categories',
  validateRequest(timeRaceCategorySchema),
  addCategory
);

router.patch(
  '/:gameId/time-race/:categoryId',
  validateRequest(timeRaceCategorySchema),
  updateCategory
);

router.delete('/:gameId/time-race/:categoryId', deleteCategory);

router.delete('/:gameId/time-race', resetTimeRace);
