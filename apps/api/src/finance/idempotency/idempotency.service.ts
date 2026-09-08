import { Injectable } from '@nestjs/common';

@Injectable()
export class IdempotencyService {
  private cache = new Map<string, { result: any; expiresAt: number }>();

  async executeWithIdempotency<T>(
    key: string | undefined,
    fn: () => Promise<T>,
    ttlMs = 86400000 // 24 hours
  ): Promise<T> {
    if (!key) return fn();

    const cached = this.cache.get(key);
    if (cached) {
      if (Date.now() < cached.expiresAt) {
        return cached.result as T;
      }
      this.cache.delete(key);
    }

    const result = await fn();
    this.cache.set(key, { result, expiresAt: Date.now() + ttlMs });
    return result;
  }
}
