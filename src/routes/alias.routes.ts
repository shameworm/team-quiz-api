import express from 'express';

import {
  getAliasById,
  addWords,
  updateWords,
  deleteWord,
  resetWords,
} from '../controllers/alias.controller';
import { validateRequest } from '../middleware/zod-validation.middleware';
import { auth } from '../middleware/auth.middleware';
import { aliasZodSchema } from '../models/zod-schemas/alias.zod.schema';

export const router = express.Router();

router.use(auth);

router.get('/:gameId/alias', getAliasById);

router.post('/:gameId/alias/words', validateRequest(aliasZodSchema), addWords);

router.patch(
  '/:gameId/alias/:wordId',
  validateRequest(aliasZodSchema),
  updateWords
);

router.delete('/:gameId/alias/:wordId', deleteWord);

router.delete('/:gameId/alias', resetWords);
