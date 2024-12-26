import winston from 'winston';

export const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);