import { Loggly } from 'winston-loggly-bulk';
import { pino } from 'pino';
import { Logger } from 'winston';
import { loggers } from 'winston';

/**
 * Creates a logger instance with the specified transport options.
 *
 * @param {object} opts - The transport options for the logger.
 * @param {string} opts.level - The log level for the logger.
 * @param {object} opts.transport - The transport options for the logger.
 * @param {string} opts.transport.target - The target transport for the logger.
 * @param {object} opts.transport.options - The options for the transport.
 * @param {boolean} opts.transport.options.colorize - Whether to colorize the log output.
 * @param {object} options - The transport options for the logger.
 * @param {string} options.level - The log level for the logger.
 * @param {object} options.transport - The transport options for the logger.
 * @param {string} options.transport.target - The target transport for the logger.
 * @param {object} options.transport.options - The options for the transport.
 * @param {boolean} options.transport.options.colorize - Whether to colorize the log output.
 * @returns {Logger} The logger instance.
 */
export function createLogger(opts: {
export function createLogger(options: {
  level: string;
  transport: {
    target: string;
    options: {
      colorize?: boolean;
    };
  };
}): Logger {
  return pino({
    level: opts.level,
    level: options.level,
    transport: {
      target: opts.transport.target,
      options: opts.transport.options,
      target: options.transport.target,
      options: options.transport.options,
    },
  });
}

/**
 * The logger instance.
 */
export const logger = createLogger({
export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

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