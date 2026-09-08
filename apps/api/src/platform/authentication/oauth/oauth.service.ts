import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { randomBytes, createHash } from 'crypto';

export interface OAuthClient {
  id: string;
  clientId: string;
  clientSecretHash: string;
  name: string;
  redirectUris: string[];
  organizationId?: string | null;
  status: string;
  createdAt: Date;
}

export interface OAuthToken {
  id: string;
  oauthClientId: string;
  accessToken: string;
  refreshToken: string;
  scopes: string[];
  expiresAt: Date;
  createdAt: Date;
}

@Injectable()
export class OAuthService {
  private readonly logger = new Logger(OAuthService.name);
  private clientsStore: Map<string, OAuthClient> = new Map();
  private tokensStore: Map<string, OAuthToken> = new Map();

  async registerOAuthClient(data: {
    name: string;
    redirectUris: string[];
    organizationId?: string;
  }) {
    const clientId = `rc_client_${randomBytes(12).toString('hex')}`;
    const rawClientSecret = `rc_secret_${randomBytes(24).toString('hex')}`;
    const clientSecretHash = createHash('sha256').update(rawClientSecret).digest('hex');

    const client: OAuthClient = {
      id: `oauth-cl-${Date.now()}`,
      clientId,
      clientSecretHash,
      name: data.name,
      redirectUris: data.redirectUris,
      organizationId: data.organizationId || null,
      status: 'ACTIVE',
      createdAt: new Date(),
    };
    this.clientsStore.set(clientId, client);

    return { client, rawClientSecret };
  }

  async issueAccessToken(data: {
    clientId: string;
    clientSecret: string;
    scopes: string[];
    expiresHours?: number;
  }) {
    const clientSecretHash = createHash('sha256').update(data.clientSecret).digest('hex');
    const client = this.clientsStore.get(data.clientId);

    if (!client || client.clientSecretHash !== clientSecretHash || client.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid OAuth client credentials');
    }

    const accessToken = `rc_tok_${randomBytes(32).toString('hex')}`;
    const refreshToken = `rc_ref_${randomBytes(32).toString('hex')}`;
    const expiresAt = new Date(Date.now() + (data.expiresHours ?? 24) * 60 * 60 * 1000);

    const token: OAuthToken = {
      id: `tok-${Date.now()}`,
      oauthClientId: client.id,
      accessToken,
      refreshToken,
      scopes: data.scopes,
      expiresAt,
      createdAt: new Date(),
    };
    this.tokensStore.set(accessToken, token);

    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      tokenType: 'Bearer',
      expiresIn: (data.expiresHours ?? 24) * 3600,
      scopes: token.scopes,
    };
  }

  async validateAccessToken(accessToken: string) {
    const token = this.tokensStore.get(accessToken);

    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException('OAuth access token is invalid or expired');
    }

    const client = Array.from(this.clientsStore.values()).find((c) => c.id === token.oauthClientId);

    return {
      clientId: client?.clientId,
      clientName: client?.name,
      scopes: token.scopes,
      organizationId: client?.organizationId,
    };
  }
}
