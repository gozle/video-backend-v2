import { Sequelize } from 'sequelize-typescript';
import { IDatabaseConfig } from './db.interface';
import * as dotenv from 'dotenv';

dotenv.config();

import * as conf from '../config/config.json';

export const dataBaseConfig: IDatabaseConfig = {
  dev: {
    username: process.env.DB_USERNAME || conf.username,
    password: process.env.DB_PASSWORD || conf.password,
    database: process.env.DB_DATABASE || conf.database,
    host: process.env.DB_HOST || conf.host,
    port: process.env.DB_PORT || conf.dbport,
    dialect: process.env.DB_DIALECT || conf.dialect,
  },
};
