import Joi from '@hapi/joi';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(4040),
  LOG_LEVEL: Joi.string()
    .allow('info', 'verbose', 'debug', 'error')
    .default(process.env.NODE_ENV === 'development' ? 'verbose' : 'info'),

  DB_HOST: Joi.string().required().description('Database host'),
  DB_NAME: Joi.string().required().description('Database name'),
  DB_USER: Joi.string().required().description('Database user'),
  DB_PASS: Joi.string().required().description('Database password'),

  JWT_PUBLIC_KEY: Joi.string().required().description('JWT Public key used to verify token'),
  JWT_PRIVATE_KEY: Joi.string().required().description('JWT Private key required to sign'),
}).unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  logLevel: envVars.LOG_LEVEL,
  dbHost: envVars.DB_HOST,
  dbName: envVars.DB_NAME,
  dbUser: envVars.DB_USER,
  dbPass: envVars.DB_PASS,
  jwtPublicKey: envVars.JWT_PUBLIC_KEY.replace(/\\n/g, '\n'),
  jwtPrivateKey: envVars.JWT_PRIVATE_KEY.replace(/\\n/g, '\n'),
};
