// src/database/sequelize.js
import { Sequelize } from 'sequelize';
import config from '../config/config.js';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        ...dbConfig,
        dialect: 'postgres',
        logging: false, 
    }
);

export default sequelize;