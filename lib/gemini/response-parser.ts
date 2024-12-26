import { ApiError } from '../error-utils';

export function parseFaceComparisonResponse(response: string) {
  try {
    const lines = response.toLowerCase().split('\n');
    const percentageLine = lines.find(line => line.startsWith('percentage:'));
    const matchLine = lines.find(line => line.startsWith('match:'));

    if (!percentageLine || !matchLine) {
      throw new Error('Invalid response format');
    }

    const percentage = parseInt(percentageLine.split(':')[1].trim());
    const isMatch = matchLine.split(':')[1].trim() === 'true';

    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      throw new Error('Invalid percentage value');
    }

    return { isMatch, matchPercentage: percentage };
  } catch (error) {
    throw new ApiError('Failed to parse face comparison response', 500);
  }
}