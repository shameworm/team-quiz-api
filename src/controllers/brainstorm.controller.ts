import { Request, Response, NextFunction } from 'express';

import { Game } from '../models/db-schemas/game.schema';
import {
  Brainstorm,
  IBrainstormCategory,
} from '../models/db-schemas/brainstorm.schema';
import { HttpError } from '../models/custom/http-error';

export const getBrainstormById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId } = req.params;
  let game;

  try {
    game = await Game.findById(gameId).populate('brainstorm');
  } catch (_error) {
    return next(
      new HttpError(
        'Fetching brainstorm for game failed, please try again',
        500
      )
    );
  }

  if (!game) {
    return next(new HttpError('Game not found', 404));
  }

  if (!game.brainstorm) {
    return next(new HttpError('Brainstorm not found', 404));
  }
  res.status(200).json({ brainstorm: game.brainstorm });
};

export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId } = req.params;
  const { name, easy, hard } = req.body;

  let game;
  try {
    game = await Game.findById(gameId);
  } catch (_error) {
    return next(new HttpError('Adding category failed, please try again', 500));
  }

  if (!game) {
    return next(new HttpError('Game not found', 404));
  }

  let brainstorm;
  try {
    brainstorm = await Brainstorm.findById(game.brainstorm);
  } catch (_error) {
    return next(
      new HttpError('Fetching brainstorm failed, please try again', 500)
    );
  }

  if (!brainstorm) {
    return next(new HttpError('Brainstorm not found', 404));
  }

  const newCategory: IBrainstormCategory = {
    name,
    easy: {
      question: easy.question,
      answer: easy.answer,
      points: easy.points || 1,
    },
    hard: {
      question: hard.question,
      answer: hard.answer,
      points: hard.points || 2,
    },
  } as IBrainstormCategory;

  try {
    brainstorm.categories.push(newCategory);
    await brainstorm.save();
  } catch (_error) {
    return next(new HttpError('Adding category failed, please try again', 500));
  }

  res.status(201).json({
    message: `${newCategory.name} successfully created`,
    brainstorm: brainstorm.toObject({ getters: true }),
  });
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId, categoryId } = req.params;
  const { name, easy, hard } = req.body;

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

  let brainstorm;
  try {
    brainstorm = await Brainstorm.findById(game.brainstorm);
  } catch (_error) {
    return next(
      new HttpError('Fetching brainstorm failed, please try again', 500)
    );
  }

  if (!brainstorm) {
    return next(new HttpError('Brainstorm not found', 404));
  }

  const categoryIndex = brainstorm.categories.findIndex(
    (category) => category.id.toString() === categoryId
  );

  if (categoryIndex === -1) {
    return next(new HttpError('Category not found', 404));
  }

  try {
    if (name) {
      brainstorm.categories[categoryIndex].name = name;
    }

    if (easy) {
      if (easy.question) {
        brainstorm.categories[categoryIndex].easy.question = easy.question;
      }
      if (easy.answer) {
        brainstorm.categories[categoryIndex].easy.answer = easy.answer;
      }
      if (easy.points) {
        brainstorm.categories[categoryIndex].easy.points = easy.points;
      }
    }

    if (hard) {
      if (hard.question) {
        brainstorm.categories[categoryIndex].hard.question = hard.question;
      }
      if (hard.answer) {
        brainstorm.categories[categoryIndex].hard.answer = hard.answer;
      }
      if (hard.points) {
        brainstorm.categories[categoryIndex].hard.points = hard.points;
      }
    }

    await brainstorm.save();
  } catch (_error) {
    return next(
      new HttpError('Updating category failed, please try again', 500)
    );
  }

  res.status(200).json({
    brainstorm: brainstorm.toObject({ getters: true }),
    message: 'Category successfully updated',
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

  let brainstorm;
  try {
    brainstorm = await Brainstorm.findById(game.brainstorm);
  } catch (_error) {
    return next(
      new HttpError('Fetching brainstorm failed, please try again', 500)
    );
  }

  if (!brainstorm) {
    return next(new HttpError('Brainstorm not found', 404));
  }

  try {
    brainstorm.categories = brainstorm.categories.filter(
      (category) => category.id.toString() !== categoryId
    );
    await brainstorm.save();
  } catch (_error) {
    return next(
      new HttpError('Deleting category failed, please try again', 500)
    );
  }

  res.status(200).json({ message: 'Category deleted successfully' });
};

export const resetBrainstorm = async (
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
      new HttpError('Resetting brainstorm failed, please try again', 500)
    );
  }

  if (!game) {
    return next(new HttpError('Game not found', 404));
  }

  let brainstorm;
  try {
    brainstorm = await Brainstorm.findById(game.brainstorm);
  } catch (_error) {
    return next(
      new HttpError('Fetching brainstorm failed, please try again', 500)
    );
  }

  if (!brainstorm) {
    return next(new HttpError('Brainstorm not found', 404));
  }

  try {
    brainstorm.categories = [];
    await brainstorm.save();
  } catch (_error) {
    return next(
      new HttpError('Resetting brainstorm failed, please try again', 500)
    );
  }

  res.status(200).json({ message: 'Brainstorm reset successfully' });
};
