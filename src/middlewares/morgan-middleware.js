import morgan from 'morgan';
import logger from '../applications/logging.js';

const morganMiddleware = morgan(':method :url :status :res[content-length] :response-time ms', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});

export default morganMiddleware;
