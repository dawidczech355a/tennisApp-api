import { Pool } from "pg";

require('dotenv').config();
export const env = process.env;

export const pool = new Pool({
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DATABASE,
});

