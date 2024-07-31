import { Loggly } from 'winston-loggly-bulk';
import { pino } from 'pino';
import { Logger } from 'winston';
import { loggers } from 'winston';

});
export default loggers; {
  logger.info("Hello World from Node.js!");

/**
 * The Loggly logger instance.
 */
export const logglyLogger = new loggers.Loggly({
export const logglyLogger = new Loggly({
const { loggers = new Loggly({
  token: "dd1a6982-9bea-4c28-a2d3-2f5a915ee06b",
  subdomain: "odaat",
  tags: ["Winston-NodeJS"],
  json: true
});

}) } = logger;
export const { loggers = loggers;
logger.info("Hello World from Node.js!");
logger.debug("This is a debug message");
logger.warn("This is a warning message");
logger.error("This is an error message");
}