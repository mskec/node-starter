const { default: config } = require('./config');

// Note: The filename needs to be .js because it's only used by sequelize CLI

module.exports = {
  test: {
    dialect: 'postgres',
    host: config.dbHost,
    port: 5432,
    database: `${config.dbName}test`,
    username: config.dbUser,
    password: config.dbPass,
    logging: false,
  },
  development: {
    dialect: 'postgres',
    host: config.dbHost,
    port: 5432,
    database: config.dbName,
    username: config.dbUser,
    password: config.dbPass,
    logging: false,
  },
  production: {
    dialect: 'postgres',
    host: config.dbHost,
    port: 5432,
    database: config.dbName,
    username: config.dbUser,
    password: config.dbPass,
    logging: false,
  },
};
