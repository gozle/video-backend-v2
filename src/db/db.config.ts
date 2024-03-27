import { Sequelize } from 'sequelize-typescript';
import { IDatabaseConfig } from './db.interface';
// import * as dotenv from 'dotenv'

// dotenv.config()

import * as conf from '../config/config.json';

export const dataBaseConfig: IDatabaseConfig = {
  dev: {
    username: conf.username, //process.env.USR,
    password: conf.password, //process.env.PASS,
    database: conf.database, //process.env.DB_NAME,
    host: conf.host, //process.env.HOST,
    port: conf.dbport, //process.env.PORT,
    dialect: conf.dialect, //process.env.DIALECT
  },
};
