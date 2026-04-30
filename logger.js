const winston = require("winston");
const LokiTransport = require("winston-loki");

const classLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, ...meta }) => {
      return JSON.stringify({
        level,
        message,
        ...meta
      });
    })
  ),
  transports: [
    new winston.transports.Console(),
    new LokiTransport({
      host: "http://loki:3100",
      labels: {
        app: "OED",
        env: process.env.NODE_ENV || "development"
      },
      json: true,
      replaceTimestamp: true,
      interval: 1,
      disableBatching: true,
      gracefulShutdown: true
    })
  ]
});

module.exports = classLogger;