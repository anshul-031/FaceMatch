import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

export function validateMethod(request: NextRequest, allowedMethods: string[]) {
  logger.info('Validating request method', {
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
    allowedMethods
  });

  if (!allowedMethods.includes(request.method)) {
    logger.warn('Method not allowed', {
      method: request.method,
      allowedMethods,
      path: new URL(request.url).pathname
    });
    return NextResponse.json(
      { error: `Method ${request.method} Not Allowed` },
      { status: 405, headers: { 'Allow': allowedMethods.join(', ') } }
    );
  }
  return null;
}