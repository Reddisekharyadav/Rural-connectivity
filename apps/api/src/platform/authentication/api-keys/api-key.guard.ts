import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiKeyService } from './api-key.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 1. Extract API key from headers
    const apiKeyHeader =
      request.headers['x-api-key'] ||
      (request.headers['authorization']?.startsWith('Bearer rc_')
        ? request.headers['authorization'].replace('Bearer ', '')
        : null);

    if (!apiKeyHeader) {
      throw new UnauthorizedException('API key missing from headers (x-api-key or Bearer token required)');
    }

    // 2. Validate with ApiKeyService
    const clientAuth = await this.apiKeyService.validateApiKey(apiKeyHeader);

    // 3. Attach authenticated client to request
    request.apiClient = clientAuth;
    return true;
  }
}
