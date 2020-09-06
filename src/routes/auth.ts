import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { IRouter } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';

import { MailSender } from '../../mails';
import { User } from '../entity/user';
import { translations } from '../helper/translations';
import { ICreateAccountBody, IAuthData, IJwtAuthData } from './routes-types';
import { env } from '../../environment';

const router: IRouter = Router();
const userRepository = () => getRepository(User);

const generateAccessToken = (authData: IAuthData): string => {
  return jwt.sign(authData, env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

// TODO: store refresh tokens - below variable is only for testing
let refreshTokens: any[] = [];

const prepareEmail = (email: string) => {
  const sendMail = new MailSender();

  const payload = {
    subject: translations.CREATE_ACCOUNT_MAIL_SUBJECT,
    text: translations.CREATE_ACCOUNT_MAIL_MESSAGE,
    to: email,
  };

  sendMail.sendingMail(payload);
};

// create account
router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, password, phone = null }: ICreateAccountBody =
      req.body || {};

    const isUserExist:
      | ICreateAccountBody
      | undefined = await userRepository().findOne({ where: { email } });

    if (isUserExist === undefined) {
      await userRepository().save({ email, password, phone });
      res.json({ message: 'User created' });
      prepareEmail(email);

      return;
    }

    res.json({ message: 'User with this email already exist.' });
  } catch (error) {
    console.log('error - create account ', error);
    res.json({ ...error });
  }
});

// login to account
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const isUserExist = await userRepository().findOne({
      where: { email, password },
    });

    if (isUserExist === undefined) {
      res.json({ message: 'User doesnt exist' });

      return;
    }

    const authData = { name: email };
    const accessToken = generateAccessToken(authData);
    const refreshToken = jwt.sign(authData, env.ACCESS_TOKEN_REFRESH_SECRET);
    // TODO: remove below line after find way to storing refresh tokens
    refreshTokens.push(refreshToken);
    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.log('error - login to account ', error);
    res.json({ ...error });
  }
});

// refresh token
router.post('/token', async (req: Request, res: Response) => {
  const { token = '' } = req.body || {};
  if (!token) {
    res.sendStatus(401);
    return;
  }

  if (!refreshTokens.includes(token)) {
    res.sendStatus(403);
    return;
  }

  jwt.verify(
    token,
    env.ACCESS_TOKEN_REFRESH_SECRET,
    (err: Error, user: IJwtAuthData) => {
      if (err) {
        res.sendStatus(403);
        return;
      }

      const accessToken = generateAccessToken({ name: user.email });
      res.json({ accessToken });
    },
  );
});

export default router;
