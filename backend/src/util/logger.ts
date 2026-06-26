import winston from "winston";


const logFileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.splat(),
    winston.format.errors({ stack: true })
);

//const logConsoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
    winston.format.splat(),
    winston.format.errors({ stack: true }),
    winston.format.timestamp({ format: "HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message, stack }) => {  
        return `[${timestamp}] ${level}: ${message} ${stack || ""}`;
    })
//);

const logger = winston.createLogger({  
    level: "info",
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error", format: logFileFormat }),
        new winston.transports.File({ filename: "all.log" , format: logFileFormat})
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: "exceptions.log"})
    ]
});
    
export default logger;
