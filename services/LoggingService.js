const winston = require("winston");
winston.level = process.env.LOG_LEVEL;
const tsFormat = () => new Date().toLocaleString();
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      timestamp: tsFormat,
    }),
    new winston.transports.File({
      filename: "combined.log",
      timestamp: tsFormat,
    }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV != "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
      timestamp: tsFormat,
      colorize: true,
    })
  );
}

module.exports = logger;
