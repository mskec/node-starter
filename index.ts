/* eslint-disable import/no-import-module-exports */
// config must be imported before importing the app
import config from './config/config';
import app from './config/express';

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    console.info(`Server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
  });
}

export default app;
