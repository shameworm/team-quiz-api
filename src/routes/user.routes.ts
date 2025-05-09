import express from 'express';

import { getUsers, signup } from '../controllers/user.controller';
import { validateRequest } from '../middleware/zod-validation.middleware';
import { userZodSchema } from '../models/zod-schemas/user.zod.schema';

import { upload } from '../middleware/file-upload.middleware';

export const router = express.Router();

router.get('/', getUsers);

router.post(
  '/signup',
  upload.single('image'),
  validateRequest(userZodSchema),
  signup
);
