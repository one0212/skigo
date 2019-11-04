const { createLogger, format, transports } = require('winston');

const {
  combine, colorize, timestamp, align, printf,
} = format;

const log = createLogger({
  format: combine(
    colorize(),
    timestamp(),
    align(),
    printf((info) => `${info.timestamp} ${info.level} ${info.message}`),
  ),
  transports: [new transports.Console()],
});

log.stream = { write: (message) => log.info(message) };

module.exports = log;
