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

  if (!games || games.length === 0) {
    return next(new HttpError('No games found.', 404));
  }

  res
    .status(200)
    .json({ games: games.map((game) => game.toObject({ getters: true })) });
};

export const getGameById = async (
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

  if (!game) {
    return next(new HttpError('Game not found.', 404));
  }

  res.status(200).json({ game: game.toObject({ getters: true }) });
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

  if (!userWithCreatedGames) {
    return next(new HttpError('User not found.', 404));
  }

  if (
    !userWithCreatedGames.createdGames ||
    userWithCreatedGames.createdGames.length === 0
  ) {
    return next(new HttpError('No games found for this user.', 404));
  }

  res.status(200).json({
    games: userWithCreatedGames?.createdGames.map((game: any) =>
      game.toObject({ getters: true })
    ),
  });
};

export const createGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description, createdBy } = req.body;

  const createdGame = new Game({
    name,
    description,
    image: req.file ? req.file.path : null,
    createdBy,
  });

  let user;
  try {
    user = await User.findById(createdBy);
  } catch (_error) {
    return next(new HttpError('Creating game failed. Try again later.', 500));
  }

  if (!user) {
    return next(
      new HttpError('Creating game failed. Could not find user.', 500)
    );
  }

  await createdGame.save();
  user.createdGames.push(createdGame.id!);
  await user.save();

  res
    .status(201)
    .json({ game: createGame, message: 'Game successfully created.' });
};

export const updateGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId } = req.params;
  const { name, description } = req.body;

  let game;

  try {
    game = await Game.findById(gameId);
  } catch (_error) {
    return next(new HttpError('Updating game failed, please try again.', 500));
  }

  if (!game) {
    return next(new HttpError('Game not found.', 404));
  }

  game.name = name;
  game.description = description;

  try {
    await game.save();
  } catch (_error) {
    return next(new HttpError('Updating game failed, please try again.', 500));
  }

  res.status(200).json({
    game: game.toObject({ getters: true }),
    message: 'Game successfully updated.',
  });
};

export const deleteGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId } = req.params;

  let game;

  try {
    game = await Game.findById(gameId).populate('createdBy');
  } catch (_error) {
    return next(new HttpError('Deleting game failed, please try again.', 500));
  }

  if (!game) {
    return next(new HttpError('Game not found.', 404));
  }

  try {
    if (game.createdBy) {
      const user = await User.findById(game.createdBy);
      if (user) {
        user.createdGames = user.createdGames.filter(
          (id) => id.toString() !== gameId
        );
        await user.save();
      }
    }

    await game.deleteOne();
  } catch (_error) {
    return next(new HttpError('Deleting game failed, please try again.', 500));
  }

  res.status(200).json({ message: 'Game deleted successfully' });
};
