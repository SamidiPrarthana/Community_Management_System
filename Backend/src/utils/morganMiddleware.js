const morgan = require('morgan');
const logger = require('./logger');

const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {
        stream: {
            write: (message) => logger.info(message.trim())
        }
    }
);

module.exports = morganMiddleware;