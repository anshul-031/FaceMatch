import logger from '../logger';

export class GeminiKeyManager {
  private keys: string[] = [];
  private currentIndex: number = 0;

  constructor() {
    this.loadKeys();
  }

  private loadKeys() {
    const keys = process.env.GEMINI_API_KEYS?.split(',') || [];
    if (keys.length === 0) {
      throw new Error('No Gemini API keys found in environment variables');
    }
    this.keys = keys.map(key => key.trim());
    logger.info(`Loaded ${this.keys.length} Gemini API keys`);
  }

  getNextKey(): string {
    const key = this.keys[this.currentIndex];
    logger.info('Using Gemini API key', {
      keyIndex: this.currentIndex,
      totalKeys: this.keys.length
    });
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    return key;
  }
}