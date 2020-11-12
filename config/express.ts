import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import { CelebrateError, isCelebrateError } from 'celebrate';
import helmet from 'helmet';
import Sequelize from 'sequelize';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import routes from '../index.route';
import APIError from '../server/helpers/APIError';
import config from './config';
import winstonInstance from './winston';

const app = express();

// Swagger UI documentation
if (config.env !== 'production') {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(YAML.load(path.join(__dirname, '../docs/swagger.yaml')), {
    customCss: '.swagger-ui .topbar, .swagger-ui .models { display: none };',
  }));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable detailed API logging in dev env
if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
}
if (config.env !== 'test') {
  app.use(expressWinston.logger({
    winstonInstance,
    expressFormat: true,
  }));
}

// mount all routes on /api path
app.use('/api', routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    const messages = [];
    // Validation segments: body, cookies, headers, etc.
    (err as CelebrateError).details.forEach(segmentError => {
      // Validation errors per segment
      segmentError.details.forEach(value => {
        messages.push(value.message);
      });
    });
    return next(new APIError({
      message: messages.join(' and '),
      status: httpStatus.BAD_REQUEST,
      isPublic: true,
    }));
  }
  if (err instanceof Sequelize.ValidationError) {
    const message = err.errors.map(error => error.message).join('. ');
    return next(new APIError({ message, status: httpStatus.BAD_REQUEST, isPublic: true }));
  }

  if (!(err instanceof APIError) || config.env === 'development') {
    winstonInstance.error(err.stack); // log other errors
    return next(err);
  }

  return next(err); // APIError
});

// catch 404 and forward to error handler
app.use((req, res, next) => next(new APIError({ status: httpStatus.NOT_FOUND })));

// error handler, send stacktrace only during development
app.use(
  (err, req, res, next) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    const { status = httpStatus.INTERNAL_SERVER_ERROR, message, stack } = err;

    res.status(status)
      .json({
        message: message || httpStatus[status],
        stack: config.env !== 'production' ? stack : undefined,
      });
  },
);

export default app;
