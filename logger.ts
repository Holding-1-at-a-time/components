import winston from 'winston';
import { Loggly } from 'winston-loggly-bulk';

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

logger.info("Hello World from Node.js!");

logger.debug("This is a debug message");
logger.warn("This is a warning message");
logger.error("This is an error message");