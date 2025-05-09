import express from 'express';

import {
  getGames,
  getGameById,
  getGameByCreatorId,
  createGame,
  updateGame,
  deleteGame,
} from '../controllers/game.controller';
import { validateRequest } from '../middleware/zod-validation.middleware';
import { gameZodSchema } from '../models/zod-schemas/game.zod.schema';
import { auth } from '../middleware/auth.middleware';

import { upload } from '../middleware/file-upload.middleware';

export const router = express.Router();

router.use(auth);

router.get('/', getGames);

router.get('/:gameId', getGameById);

router.get('/user/:userId', getGameByCreatorId);

router.post(
  '/create',
  upload.single('image'),
  validateRequest(gameZodSchema),
  createGame
);

router.patch(
  '/:gameId',
  upload.single('image'),
  validateRequest(gameZodSchema),
  updateGame
);

router.delete('/:gameId', deleteGame);
