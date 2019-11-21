const { createLogger, format, transports } = require('winston');

const {
  combine, colorize, align, printf,
} = format;

const log = createLogger({
  format: combine(
    colorize(),
    align(),
    printf((info) => `${info.level} ${info.message}`),
  ),
  transports: [new transports.Console()],
});

log.stream = { write: (message) => log.info(message) };

module.exports = log;
