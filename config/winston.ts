import _ from 'lodash';
import { format, createLogger, transports } from 'winston';
import config from './config';


function prodFormat() {
  const formatMessage = ({ level, timestamp, message }) => `${timestamp} ${level} ${message}`;
  const replaceError = error => _.pick(error, ['label', 'level', 'message', 'stack']);
  const replacer = info => (info instanceof Error ? replaceError(info) : formatMessage(info));
  return format.combine(format.timestamp(), format.printf(replacer));
}

function devFormat() {
  const formatMessage = ({ level, message, ...rest }) => {
    let formatted = `${level} ${message}`;
    if (rest.meta?.req.body) {
      formatted = `${formatted}\n${JSON.stringify(rest.meta.req.body, null, 2)}`;
    }
    return formatted;
  };
  const formatError = info => `${info.level} ${info.message}\n\n${info.stack}\n`;
  const formatDev = info => (info instanceof Error ? formatError(info) : formatMessage(info));
  return format.combine(format.colorize(), format.printf(formatDev));
}

const logger = createLogger({
  level: config.env === 'development' ? 'verbose' : 'info',
  transports: [new transports.Console()],
  format: config.env === 'production' ? prodFormat() : devFormat(),
});

export default logger;
