import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { IRouter } from 'express-serve-static-core';

import {
  IAddGameResult,
  IUpdateResultById,
  IGameResultBody,
} from './routes-types';
import { Games } from '../entity/games';
import { authenticationToken } from '../helper/authenticateToken';

const router: IRouter = Router();
const date: Date = new Date();

const getSingleGame = (id: string): Promise<Games> => {
  return getRepository(Games).findOne(id);
};

// get game result
router.get('/', authenticationToken, async (req: Request, res: Response) => {
  try {
    const games: Array<Games> | void = await getRepository(Games).find();

    res.json(games);
  } catch (error) {
    res.json({ ...error, status: 401 });
  }
});

// get single game result
router.get('/:id', authenticationToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const selectedGame: Games = await getSingleGame(id);

    res.json(selectedGame);
  } catch (error) {
    res.json({ ...error, status: 401 });
  }
});

// add game result
router.post(
  '/',
  authenticationToken,
  async ({ body }: IAddGameResult, res: Response) => {
    try {
      const { winner, loser, result }: IGameResultBody = body;

      const addedGame: Games = await getRepository(Games).save({
        winner,
        loser,
        result,
        date,
      });

      res.json({ addedGame, message: 'Game added' });
    } catch (error) {
      res.json({ ...error, status: 401 });
    }
  },
);

// delete single game result
router.delete(
  '/:id',
  authenticationToken,
  async ({ params }, res: Response) => {
    try {
      const { id } = params;

      const singleGame: Games = await getSingleGame(id);
      await getRepository(Games).remove(singleGame);

      res.json({ message: 'Game deleted' });
    } catch (error) {
      res.json({ ...error, status: 401 });
    }
  },
);

// update result by id
router.patch(
  '/:id',
  authenticationToken,
  async ({ params, body }: IUpdateResultById, res: Response) => {
    try {
      const { id } = params;
      const { winner, loser, result }: IGameResultBody = body;

      const singleGame: Games = await getSingleGame(id);
      singleGame.winner = winner;
      singleGame.loser = loser;
      singleGame.result = result;
      await getRepository(Games).save(singleGame);

      res.json({ message: 'Game updated' });
    } catch (error) {
      res.json({ ...error, status: 401 });
    }
  },
);

export default router;
