import { ApiError } from '@/lib/error-utils';
import logger from '@/lib/logger';

export function validateFaceComparisonRequest(data: any) {
  logger.info('Validating face comparison request data', {
    hasImage1: !!data?.image1,
    hasImage2: !!data?.image2,
    image1Length: data?.image1?.length,
    image2Length: data?.image2?.length
  });

  if (!data?.image1 || !data?.image2) {
    logger.warn('Invalid request data', {
      missingImage1: !data?.image1,
      missingImage2: !data?.image2
    });
    throw new ApiError('Both images are required', 400);
  }
}