import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { HttpError } from '../models/custom/http-error';

declare global {
  namespace Express {
    interface Request {
      userData?: { userId: string };
    }
  }
}

export const auth = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new HttpError('Authentication failed', 401));
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (_error) {
    return next(new HttpError('Authentication failed', 401));
  }

  if (!decodedToken) {
    return next(new HttpError('Authentication failed', 401));
  }

  req.userData = { userId: (decodedToken as any).userId };
  next();
};
