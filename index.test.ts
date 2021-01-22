// import mock from 'mock-require';
import logger from './config/winston';

logger.info('Starting tests', { prefix: 'Init' });
logger.info(`Environment "${process.env.NODE_ENV}"`, { prefix: 'Init' });

// mock('some-module', {
//
// });
