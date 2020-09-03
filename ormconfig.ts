import { env } from './environment';

module.exports = {
  name: env.DB_ORM_NAME,
  type: env.DB_TYPE,
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DATABASE,
  synchronize: true,
  logging: false,
  entities: ['./src/entity/**/*.ts'],
};
