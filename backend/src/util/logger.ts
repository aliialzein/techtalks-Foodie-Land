import winston from "winston";

const logFileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
  winston.format.splat(),
  winston.format.errors({ stack: true }),
);

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      format: logFileFormat,
    }),
    new winston.transports.File({ filename: "all.log", format: logFileFormat }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "exceptions.log" }),
  ],
});

export default logger;
