import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RateLimiterService } from './rate-limiter.service';

@Injectable()
export class RateLimiterGuard implements CanActivate {
  constructor(private readonly rateLimiterService: RateLimiterService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const identifier =
      request.apiClient?.apiClientId ||
      request.ip ||
      request.headers['x-forwarded-for'] ||
      'anonymous-client';

    const limit = request.apiClient?.environment === 'PRODUCTION' ? 1000 : 100;
    const rateCheck = this.rateLimiterService.checkRateLimit(identifier, limit);

    if (response?.setHeader) {
      response.setHeader('X-RateLimit-Limit', rateCheck.limit.toString());
      response.setHeader('X-RateLimit-Remaining', rateCheck.remaining.toString());
      response.setHeader('X-RateLimit-Reset', rateCheck.resetTime.toString());
    }

    if (!rateCheck.allowed) {
      const retryAfter = Math.ceil((rateCheck.resetTime - Date.now()) / 1000);
      if (response?.setHeader) {
        response.setHeader('Retry-After', retryAfter.toString());
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Too Many Requests. Rate limit of ${limit} requests/minute exceeded.`,
          retryAfterSeconds: retryAfter,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}

