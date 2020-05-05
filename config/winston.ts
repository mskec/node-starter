import { format, createLogger, transports } from 'winston';
import config from './config';

/**
 * Print JSON in a readable way
 */
export const printJson = obj => JSON.stringify(obj)
  .replace(/"/g, '')
  .replace(/:/g, ': ')
  .replace(/,/g, ', ');

const formatMessage = ({ timestamp, level, message, prefix, requestId, ...rest }) => {
  let formatted = [
    timestamp,
    level,
    requestId,
    prefix,
    message,
  ]
    .filter(s => !!s)
    .join(' | ');

  if (config.env !== 'production' && rest.meta?.req.body) {
    formatted = `${formatted}\n${JSON.stringify(rest.meta.req.body, null, 2)}`;
  }
  return formatted;
};
const formatError = info => `${formatMessage(info)}\n${info.stack}`;
const replacer = info => (info instanceof Error ? formatError(info) : formatMessage(info));

function prodFormat() {
  return format.combine(format.timestamp(), format.printf(replacer));
}

function devFormat() {
  return format.combine(format.colorize(), format.printf(replacer));
}

const logger = createLogger({
  level: config.logLevel,
  transports: [new transports.Console()],
  format: config.env === 'production' ? prodFormat() : devFormat(),
});

export default logger;
