import { Request, Response, NextFunction } from 'express';

import { Game } from '../models/db-schemas/game.schema';
import { Alias, IAlias } from '../models/db-schemas/alias.schema';
import { HttpError } from '../models/custom/http-error';

export const getAliasById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId } = req.params;

  let game;

  try {
    game = await Game.findById(gameId).populate('alias');
  } catch (_error) {
    return next(
      new HttpError('Fetching alias for game failed, please try again', 500)
    );
  }

  if (!game) {
    return next(new HttpError('Game not found', 404));
  }

  if (!game.alias) {
    return next(new HttpError('Alias not found', 404));
  }

  res.status(200).json({ alias: game.alias });
};

export const addWords = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId } = req.params;
  const { words } = req.body;

  let game;
  try {
    game = await Game.findById(gameId);
  } catch (_error) {
    return next(new HttpError('Adding words failed, please try again', 500));
  }

  if (!game) {
    return next(new HttpError('Game not found', 404));
  }

  let alias;
  try {
    alias = await Alias.findById(game.alias);
  } catch (_error) {
    return next(new HttpError('Adding words failed, please try again', 500));
  }

  if (!alias) {
    return next(new HttpError('Alias not found', 404));
  }

  const newWords: IAlias = {
    words,
  } as IAlias;

  try {
    alias.words.push(...newWords.words);
    await alias.save();
  } catch (_error) {
    return next(new HttpError('Adding words failed, please try again', 500));
  }

  res.status(201).json({ alias });
};

export const updateWords = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId } = req.params;
  const { words } = req.body;

  let game;
  try {
    game = await Game.findById(gameId);
  } catch (_error) {
    return next(new HttpError('Updating words failed, please try again', 500));
  }

  if (!game) {
    return next(new HttpError('Game not found', 404));
  }

  let alias;
  try {
    alias = await Alias.findById(game.alias);
  } catch (_error) {
    return next(new HttpError('Updating words failed, please try again', 500));
  }

  if (!alias) {
    return next(new HttpError('Alias not found', 404));
  }

  alias.words = words;
  try {
    await alias.save();
  } catch (_error) {
    return next(new HttpError('Updating words failed, please try again', 500));
  }

  res.status(200).json({ alias });
};

export const deleteWord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId } = req.params;
  const { word } = req.body;

  let game;
  try {
    game = await Game.findById(gameId);
  } catch (_error) {
    return next(new HttpError('Deleting word failed, please try again', 500));
  }

  if (!game) {
    return next(new HttpError('Game not found', 404));
  }
  if (!game.alias) {
    return next(new HttpError('Alias not found', 404));
  }

  let alias;
  try {
    alias = await Alias.findById(game.alias);
  } catch (_error) {
    return next(new HttpError('Deleting word failed, please try again', 500));
  }

  if (!alias) {
    return next(new HttpError('Alias not found', 404));
  }
  try {
    alias.words = alias.words.filter((w) => w !== word);
    await alias.save();
  } catch (_error) {
    return next(new HttpError('Deleting word failed, please try again', 500));
  }

  res.status(200).json({ alias });
};

export const resetWords = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId } = req.params;
  const { words } = req.body;

  let game;
  try {
    game = await Game.findById(gameId);
  } catch (_error) {
    return next(new HttpError('Reset words failed, please try again', 500));
  }

  if (!game) {
    return next(new HttpError('Game not found', 404));
  }

  let alias;
  try {
    alias = await Alias.findById(game.alias);
  } catch (_error) {
    return next(new HttpError('Reset words failed, please try again', 500));
  }

  if (!alias) {
    return next(new HttpError('Alias not found', 404));
  }

  alias.words = alias.words.filter((word) => !words.includes(word));
  try {
    await alias.save();
  } catch (_error) {
    return next(new HttpError('Reset words failed, please try again', 500));
  }

  res.status(200).json({ alias });
};
