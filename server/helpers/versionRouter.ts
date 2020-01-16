import { RequestHandler } from 'express';
import validate from 'express-validation';
import Joi from './joi';

interface VersionRouterConfig {
  [key: number]: RequestHandler[]
  otherwise: RequestHandler[]
}

/**
 * A middleware that will route requests based on version number from
 * headers 'app-build'. app-build is the default header key.
 *
 * config:
 *   - use `'otherwise'` key for default handler
 *   - use version number to handle versions greater than specified version.
 *       eg. `config: { 10: [handler] }` handler will handle all requests
 *       with header `app-build` greater than 10.
 */
export default (config: VersionRouterConfig) => {
  if (!config || !config.otherwise) {
    throw new Error('missing version router config');
  }

  return [
    validate({
      headers: {
        'app-build': Joi.number().min(1),
      },
    }),
    (req, res, next) => {
      const { 'app-build': appBuild } = req.headers;

      let handlers: RequestHandler[] = config.otherwise; // default handlers

      if (appBuild) {
        // Determine which handler to use
        Object.keys(config)
          .forEach(version => {
            if (!Number.isNaN(Number.parseInt(version, 10)) && version < appBuild) {
              handlers = config[version];
            }
          });
      }

      let shouldStop = false;
      for (let i = 0; !shouldStop && i < handlers.length; i += 1) {
        handlers[i](req, res, err => {
          if (err) {
            shouldStop = true;
            next(err);
          }
        });
      }
    },
  ];
};
