const winston = require("winston");

// format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.printf(
//       (info) => `${info.timestamp} ${info.level}: ${info.message}`
//     )
//   ),

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/app.log" })
    ]
});

exports.logger = logger;