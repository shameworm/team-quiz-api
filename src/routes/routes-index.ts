import express from 'express';

import { router as gameRouter } from './game.routes';
import { router as brainstormRouter } from './brainstorm.routes';
import { router as commentsRoutes } from './comments.routes';
import { router as timeRaceRouter } from './time-race.routes';
import { router as aliasRouter } from './alias.routes';
import { router as userRouter } from './user.routes';

export const router = express.Router();

router.use('/users', userRouter);
router.use('/game', gameRouter);
router.use('/games', brainstormRouter);
router.use('/games', commentsRoutes);
router.use('/games', timeRaceRouter);
router.use('/games', aliasRouter);
