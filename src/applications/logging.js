import winston, { format } from 'winston';

const { combine, printf, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  if (typeof message === 'object') {
    return `${timestamp} [${level}] ${JSON.stringify(message, null, 3)}`;
  }

  return `${timestamp} [${level}] ${stack || message}`;
});

const logger = winston.createLogger({
  format: combine(
    format.prettyPrint(),
    format.splat(),
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss Z' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [new winston.transports.Console({})],
});

export default logger;
