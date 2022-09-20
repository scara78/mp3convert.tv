const { createLogger, transports } = require("winston")

export const logger = createLogger({
    transports: [
      new transports.File({ level: "info", filename: 'logs/queueInfo.log' }),
      new transports.File({ level: "error", filename: 'logs/queueError.log' }),
    ]
  });