import express from 'express';

import {
  getGames,
  getGameById,
  getGameByCreatorId,
  createGame,
  updateGame,
  deleteGame,
} from '../controllers/game.controller';
import { validateRequest } from '../middleware/zod.validation';
import { gameSchema } from '../models/zod-schemas/game.zod.schema';

export const router = express.Router();

router.get('/', getGames);

router.get('/:gameId', getGameById);

router.get('/user/:userId', getGameByCreatorId);

router.post('/create', validateRequest(gameSchema), createGame);

router.patch('/:gameId', validateRequest(gameSchema), updateGame);

router.delete('/:gameId', deleteGame);
