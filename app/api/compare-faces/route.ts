import { NextRequest, NextResponse } from 'next/server';
import { compareFaces } from '@/lib/rekognition';
import logger from '@/lib/logger';
import { ApiError } from '@/lib/error-utils';
import { validateMethod } from '@/lib/api/middleware';
import { validateFaceComparisonRequest } from '@/lib/api/validation';

export const dynamic = 'force-dynamic';

const ALLOWED_METHODS = ['POST'];

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  
  try {
    logger.info('Received API request', {
      requestId,
      method: request.method,
      url: request.url,
      path: new URL(request.url).pathname
    });

    const methodValidation = validateMethod(request, ALLOWED_METHODS);
    if (methodValidation) return methodValidation;

    const contentType = request.headers.get('content-type');
    logger.info('Request content type', { requestId, contentType });

    if (!contentType?.includes('application/json')) {
      logger.warn('Invalid content type', { requestId, contentType });
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 415 }
      );
    }

    const data = await request.json();
    validateFaceComparisonRequest(data);

    logger.info('Processing face comparison', { requestId });
    const result = await compareFaces(data.image1, data.image2);
    
    logger.info('Face comparison completed', { requestId, success: true });
    return NextResponse.json(result);
  } catch (error) {
    logger.error('Error in face comparison API', {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error
    });
    
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process face comparison. Please try again.' },
      { status: 500 }
    );
  }
}