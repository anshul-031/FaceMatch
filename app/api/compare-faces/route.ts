import { NextRequest, NextResponse } from 'next/server';
import { compareFaces } from '@/lib/gemini';
import logger from '@/lib/logger';
import { ApiError } from '@/lib/error-utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { image1, image2 } = data;

    if (!image1 || !image2) {
      throw new ApiError('Both images are required', 400);
    }

    logger.info('Processing face comparison request');
    const result = await compareFaces(image1, image2);

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Error processing face comparison:', error);
    
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