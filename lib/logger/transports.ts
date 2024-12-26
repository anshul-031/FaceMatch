import winston from 'winston';
import { LOG_DIR, LOG_LEVEL } from '../config/logging';

export function createConsoleTransport() {
  return new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  });
}

export function createFileTransports() {
  // Only create file transports if not in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    return [];
  }

  return [
    new winston.transports.File({ 
      filename: `${LOG_DIR}/error.log`,
      level: 'error',
      silent: isProduction
    }),
    new winston.transports.File({ 
      filename: `${LOG_DIR}/combined.log`,
      silent: isProduction
    })
  ];
}