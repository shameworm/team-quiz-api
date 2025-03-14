import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { router as usersRoutes } from './routes/user.routes';
import { router as gameRoutes } from './routes/game.routes';

import { HttpError } from './models/custom/http-error';

dotenv.config();

const MONGODB_ACCESS_STR = process.env['MONGODB_ACCESS_STR'];

if (!MONGODB_ACCESS_STR) {
  console.error('No MongoDB access string provided');
  process.exit(1);
}

const app = express();

app.use(bodyParser.json());

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/api/users', usersRoutes);
app.use('/api/game', gameRoutes);

app.use((_req, _res, _next) => {
  const error = new HttpError('Could not find this route', 404);
  throw error;
});

app.use(
  (error: HttpError, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(error);
    }

    const statusCode =
      error.code && error.code >= 100 && error.code < 600 ? error.code : 500;

    res
      .status(statusCode)
      .json({ message: error.message || 'An unknown error occurred!' });
  }
);

mongoose
  .connect(MONGODB_ACCESS_STR, {
    dbName: 'team-quiz',
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    },
  })
  .then(() => {
    app.listen(5000);
  })
  .catch((error) => {
    console.log(error);
  });
