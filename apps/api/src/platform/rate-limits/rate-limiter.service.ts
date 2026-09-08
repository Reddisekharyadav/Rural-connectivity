import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';

interface RateLimitBucket {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimiterService {
  private readonly logger = new Logger(RateLimiterService.name);
  private buckets: Map<string, RateLimitBucket> = new Map();

  /**
   * Checks if an identifier exceeds rate limits within a 1-minute window
   */
  checkRateLimit(identifier: string, maxRequestsPerMinute: number = 100): {
    allowed: boolean;
    limit: number;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const windowMs = 60 * 1000;

    let bucket = this.buckets.get(identifier);

    if (!bucket || now > bucket.resetTime) {
      bucket = { count: 1, resetTime: now + windowMs };
      this.buckets.set(identifier, bucket);
      return {
        allowed: true,
        limit: maxRequestsPerMinute,
        remaining: maxRequestsPerMinute - 1,
        resetTime: bucket.resetTime,
      };
    }

    if (bucket.count >= maxRequestsPerMinute) {
      const retryAfterSeconds = Math.ceil((bucket.resetTime - now) / 1000);
      return {
        allowed: false,
        limit: maxRequestsPerMinute,
        remaining: 0,
        resetTime: bucket.resetTime,
      };
    }

    bucket.count += 1;
    return {
      allowed: true,
      limit: maxRequestsPerMinute,
      remaining: maxRequestsPerMinute - bucket.count,
      resetTime: bucket.resetTime,
    };
  }
}
