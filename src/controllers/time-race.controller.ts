import { Request, Response, NextFunction } from 'express';

import { Game } from '../models/db-schemas/game.schema';
import {
  TimeRace,
  ITimeRaceCategory,
} from '../models/db-schemas/time-race.schema';

import { HttpError } from '../models/custom/http-error';

export const getTimeRaceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId } = req.params;
  let game;

  try {
    game = await Game.findById(gameId).populate('timeRace');
  } catch (_error) {
    return next(
      new HttpError('Fetching time race for game failed, please try again', 500)
    );
  }

  if (!game) {
    return next(new HttpError('Game not found', 404));
  }

  if (!game.timeRace) {
    return next(new HttpError('Time race not found', 404));
  }

  res.status(200).json({ timeRace: game.timeRace });
};

export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId } = req.params;
  const { name, examples } = req.body;

  let game;
  try {
    game = await Game.findById(gameId);
  } catch (_error) {
    return next(new HttpError('Adding category failed, please try again', 500));
  }

  if (!game) {
    return next(new HttpError('Game not found', 404));
  }

  let timeRace;
  try {
    timeRace = await TimeRace.findById(game.timeRace);
  } catch (_error) {
    return next(new HttpError('Adding category failed, please try again', 500));
  }

  if (!timeRace) {
    return next(new HttpError('Time race not found', 404));
  }

  const newCategory: ITimeRaceCategory = {
    name,
    examples,
  } as ITimeRaceCategory;

  try {
    timeRace.categories.push(newCategory);
    await timeRace.save();
  } catch (_error) {
    return next(new HttpError('Adding category failed, please try again', 500));
  }

  res.status(201).json({
    message: `${name} successfully added`,
    timeRace: timeRace.toObject({ getters: true }),
  });
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId, categoryId } = req.params;
  const { name, examples } = req.body;

  let game;
  try {
    game = await Game.findById(gameId);
  } catch (_error) {
    return next(
      new HttpError('Updating category failed, please try again', 500)
    );
  }

  if (!game) {
    return next(new HttpError('Game not found', 404));
  }

  let timeRace;
  try {
    timeRace = await TimeRace.findById(game.timeRace);
  } catch (_error) {
    return next(
      new HttpError('Updating category failed, please try again', 500)
    );
  }

  if (!timeRace) {
    return next(new HttpError('Time race not found', 404));
  }

  const categoryIndex = timeRace.categories.findIndex(
    (category) => category.id.toString() === categoryId
  );

  if (categoryIndex === -1) {
    return next(new HttpError('Category not found', 404));
  }

  try {
    if (name) {
      timeRace.categories[categoryIndex].name = name;
    }
    if (examples) {
      timeRace.categories[categoryIndex].examples = examples;
    }
    await timeRace.save();
  } catch (_error) {
    return next(
      new HttpError('Updating category failed, please try again', 500)
    );
  }

  res.status(200).json({
    message: `${name} successfully updated`,
    timeRace: timeRace.toObject({ getters: true }),
  });
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId, categoryId } = req.params;

  let game;
  try {
    game = await Game.findById(gameId);
  } catch (_error) {
    return next(
      new HttpError('Deleting category failed, please try again', 500)
    );
  }

  if (!game) {
    return next(new HttpError('Game not found', 404));
  }

  let timeRace;
  try {
    timeRace = await TimeRace.findById(game.timeRace);
  } catch (_error) {
    return next(
      new HttpError('Deleting category failed, please try again', 500)
    );
  }

  if (!timeRace) {
    return next(new HttpError('Time race not found', 404));
  }

  try {
    timeRace.categories = timeRace.categories.filter(
      (category) => category.id.toString() !== categoryId
    );
    await timeRace.save();
  } catch (_error) {
    return next(
      new HttpError('Deleting category failed, please try again', 500)
    );
  }

  res.status(200).json({ message: 'Category deleted' });
};

export const resetTimeRace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId } = req.params;

  let game;
  try {
    game = await Game.findById(gameId);
  } catch (_error) {
    return next(
      new HttpError('Deleting category failed, please try again', 500)
    );
  }

  if (!game) {
    return next(new HttpError('Game not found', 404));
  }

  let timeRace;
  try {
    timeRace = await TimeRace.findById(game.timeRace);
  } catch (_error) {
    return next(
      new HttpError('Deleting category failed, please try again', 500)
    );
  }

  if (!timeRace) {
    return next(new HttpError('Time race not found', 404));
  }

  try {
    timeRace.categories = [];
    await timeRace.save();
  } catch (_error) {
    return next(
      new HttpError('Resetting time race failed, please try again', 500)
    );
  }

  res.status(200).json({ message: 'Time race reset successfully' });
};
