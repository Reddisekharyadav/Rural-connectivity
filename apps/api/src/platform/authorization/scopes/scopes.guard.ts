import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiScope } from './api-scopes';

export const SCOPES_KEY = 'platform_scopes';
export const RequireScopes = (...scopes: ApiScope[]) => SetMetadata(SCOPES_KEY, scopes);

@Injectable()
export class ScopesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredScopes = this.reflector.getAllAndOverride<ApiScope[]>(SCOPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredScopes || requiredScopes.length === 0) {
      return true; // No scopes required
    }

    const request = context.switchToHttp().getRequest();
    const apiClient = request.apiClient;

    if (!apiClient || !apiClient.scopes) {
      throw new ForbiddenException('No API scopes associated with this client');
    }

    // Platform admin scope grants everything
    if (apiClient.scopes.includes(ApiScope.PLATFORM_ADMIN)) {
      return true;
    }

    // Check if client has all required scopes
    const hasAllScopes = requiredScopes.every((scope) =>
      apiClient.scopes.includes(scope),
    );

    if (!hasAllScopes) {
      throw new ForbiddenException(
        `Insufficient scopes. Required: [${requiredScopes.join(', ')}]. Granted: [${apiClient.scopes.join(', ')}]`,
      );
    }

    return true;
  }
}
