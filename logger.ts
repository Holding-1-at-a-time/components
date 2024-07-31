import winston, { loggers } from 'winston';
import { Loggly } from 'winston-loggly-bulk';

// server.ts
import "./tracer";

import pino from 'pino';

export const loggly = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});
const logger = winston.createLogger({
  transports: [
    new Loggly({
      token: "dd1a6982-9bea-4c28-a2d3-2f5a915ee06b",
      subdomain: "odaat",
      tags: ["Winston-NodeJS"],
      json: true
    })
  ]
});
export default logger; {
  logger.info("Hello World from Node.js!");

  logger.debug("This is a debug message");
  logger.warn("This is a warning message");
  logger.error("This is an error message");
}
