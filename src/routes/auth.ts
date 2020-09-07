import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { IRouter } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
import passwordCrypt from 'bcrypt';

import { MailSender } from '../../mails';
import { User } from '../entity/user';
import { translations } from '../helper/translations';
import { ICreateAccountBody, IAuthData, IJwtAuthData } from './routes-types';
import { env } from '../../environment';

const saltRounds = 10;
const router: IRouter = Router();
const userRepository = () => getRepository(User);

const generateAccessToken = (authData: IAuthData): string => {
  return jwt.sign(authData, env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

// TODO: store refresh tokens - below variable is only for testing
let refreshTokens: any[] = [];

const prepareEmail = async (email: string) => {
  const sendMail = new MailSender();

  const payload = {
    subject: translations.CREATE_ACCOUNT_MAIL_SUBJECT,
    text: translations.CREATE_ACCOUNT_MAIL_MESSAGE,
    to: email,
  };

  await sendMail.sendingMail(payload);
};

// create account
router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, password, phone = null }: ICreateAccountBody =
      req.body || {};

    const user:
      | ICreateAccountBody
      | undefined = await userRepository().findOne({ where: { email } });

    if (!user) {
      await passwordCrypt.hash(
        password,
        saltRounds,
        async (err: Error, hash: string) => {
          if (!err) {
            await userRepository().save({ email, password: hash, phone });
          }
        },
      );
      res.json({ message: 'User created' });
      await prepareEmail(email);

      return;
    }

    res.json({ message: 'User with this email already exist.' });
  } catch (error) {
    res.json({ ...error, status: 401 });
  }
});

// login to account
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository().findOne({
      where: { email },
    });
    const isPasswordValid = passwordCrypt.compareSync(password, user.password);

    if (!user || !isPasswordValid) {
      return res.json({
        message: 'User doesnt exist - incorrect email or password',
        status: 404,
      });
    }

    const authData = { name: email };
    const accessToken = generateAccessToken(authData);
    const refreshToken = jwt.sign(authData, env.ACCESS_TOKEN_REFRESH_SECRET);
    // TODO: remove below line after find way to storing refresh tokens
    refreshTokens.push(refreshToken);
    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.json({ ...error, status: 401 });
  }
});

// refresh token
router.post('/refresh-token', async (req: Request, res: Response) => {
  const { token = '' } = req.body || {};
  if (!token) {
    return res.sendStatus(401);
  }

  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }

  jwt.verify(
    token,
    env.ACCESS_TOKEN_REFRESH_SECRET,
    (err: Error, user: IJwtAuthData) => {
      if (err) {
        return res.sendStatus(403);
      }

      const accessToken = generateAccessToken({ name: user.email });
      res.json({ accessToken });
    },
  );
});

export default router;
