import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodEffects, ZodError } from 'zod';

import { HttpError } from '../models/custom/http-error';

export const validateRequest =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new HttpError(error.errors[0].message, 422));
      }
      return next(new HttpError('Invalid input', 422));
    }
  };
