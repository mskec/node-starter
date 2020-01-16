import Sequelize from 'sequelize';
import config from '../config/config';
import database from '../config/database';

// @ts-ignore
export default new Sequelize(database[config.env]);
