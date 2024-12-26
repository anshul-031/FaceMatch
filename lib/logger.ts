import winston from 'winston';
import { loggerConfig } from './config/logging';
import { createConsoleTransport, createFileTransports } from './logger/transports';
import { logFormat } from './logger/formats';

const isProduction = process.env.NODE_ENV === 'production';

const logger = winston.createLogger({
  ...loggerConfig,
  format: logFormat,
  transports: [
    createConsoleTransport(),
    ...(isProduction ? [] : createFileTransports())
  ]
});

export default logger;