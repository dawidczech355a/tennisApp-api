import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { env } from '../../environment';
import { IJwtAuthData } from '../routes/routes-types';

export const authenticationToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(
    token,
    env.ACCESS_TOKEN_SECRET,
    (err: Error, authData: IJwtAuthData) => {
      if (err) {
        res.sendStatus(403);
        return;
      }
      // @ts-ignore
      req.authData = authData;
      next();
    },
  );
};
