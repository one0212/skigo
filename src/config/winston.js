const winston = require('winston');

const log = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
  exitOnError: false,
});

log.stream = { write: (message) => log.info(message) };

module.exports = log;
