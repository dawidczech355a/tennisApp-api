import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { IRouter } from 'express-serve-static-core';

import { MailSender } from '../../mails';
import { User } from '../entity/user';
import { translations } from '../helper/translations';
import { ICreateAccountBody } from './routes-types';

const router: IRouter = Router();
const userRepository = () => getRepository(User);

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

export default router;
