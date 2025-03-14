import { Request, Response, NextFunction } from 'express';

import { Game } from '../models/db-schemas/game.schema';
import { User } from '../models/db-schemas/user.schema';
import { HttpError } from '../models/custom/http-error';

export const getGames = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  let games;

  try {
    games = await Game.find();
  } catch (_error) {
    return next(new HttpError('Fetching games failed, please try again', 500));
  }

  res.json({ games: games.map((game) => game.toObject({ getters: true })) });
};

export const getGamesById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId } = req.params;
  let game;

  try {
    game = await Game.findById(gameId);
  } catch (_error) {
    return next(new HttpError('Fetching game failed, please try again', 500));
  }

  res.json({ games: game?.toObject({ getters: true }) });
};

export const getGameByCreatorId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  let userWithCreatedGames;

  try {
    userWithCreatedGames = await User.findById(userId).populate({
      path: 'createdGames',
    });
  } catch (_error) {
    return next(
      new HttpError(
        'Fetching games for created by user failed, please try again',
        500
      )
    );
  }

  res.json({
    games: userWithCreatedGames?.createdGames.map((game: any) =>
      game.toObject({ getters: true })
    ),
  });
};
