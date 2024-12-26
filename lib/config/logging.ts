import { LoggerOptions } from 'winston';

export const LOG_DIR = process.env.LOG_DIR || '.logs';
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

export const loggerConfig: LoggerOptions = {
  level: LOG_LEVEL,
  format: undefined, // Will be set in logger.ts
  transports: [], // Will be set in logger.ts
  exitOnError: false,
};