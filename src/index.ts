import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { createConnection } from 'typeorm';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';

import GameResultRouter from './routes/game-results';
import AuthRouter from './routes/auth';

createConnection().then(() => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use('/game-results', GameResultRouter);
  app.use('/auth', AuthRouter);

  app.listen(5000);
});
