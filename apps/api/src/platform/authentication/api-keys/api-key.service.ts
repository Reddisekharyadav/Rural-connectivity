import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';

export type ApiEnvironment = 'SANDBOX' | 'PRODUCTION';
export type ApiClientStatus = 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
export type ApiKeyStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED';

export interface ApiClient {
  id: string;
  name: string;
  organizationId?: string | null;
  userId?: string | null;
  environment: ApiEnvironment;
  status: ApiClientStatus;
  scopes: string[];
  createdAt: Date;
  lastUsedAt?: Date | null;
}

export interface ApiKey {
  id: string;
  apiClientId: string;
  keyPrefix: string;
  keyHash: string;
  status: ApiKeyStatus;
  expiresAt?: Date | null;
  lastUsedAt?: Date | null;
  createdAt: Date;
}

@Injectable()
export class ApiKeyService {
  private readonly logger = new Logger(ApiKeyService.name);
  private clientsStore: Map<string, ApiClient> = new Map();
  private keysStore: Map<string, ApiKey> = new Map();

  constructor() {
    // Seed default sandbox partner client
    const defaultClient: ApiClient = {
      id: 'client-tandur-fpo-001',
      name: 'Tandur Rythu Seva Samithi FPO Client',
      organizationId: 'org-tandur-fpo',
      userId: 'usr-fpo-lead',
      environment: 'PRODUCTION',
      status: 'ACTIVE',
      scopes: [
        'farms:read',
        'jobs:read',
        'jobs:write',
        'assets:read',
        'orders:read',
        'produce:read',
        'transport:read',
        'analytics:read',
      ],
      createdAt: new Date(),
    };
    this.clientsStore.set(defaultClient.id, defaultClient);

    const defaultKeyRaw = 'rc_live_tandurfpo_sec99847192841';
    const keyPrefix = defaultKeyRaw.slice(0, 15);
    const keyHash = this.hashKey(defaultKeyRaw);
    const defaultKey: ApiKey = {
      id: 'key-tandur-001',
      apiClientId: defaultClient.id,
      keyPrefix,
      keyHash,
      status: 'ACTIVE',
      createdAt: new Date(),
    };
    this.keysStore.set(keyHash, defaultKey);
  }

  hashKey(rawKey: string): string {
    return createHash('sha256').update(rawKey).digest('hex');
  }

  async createApiClientWithKey(data: {
    name: string;
    organizationId?: string;
    userId?: string;
    environment?: ApiEnvironment;
    scopes: string[];
    expiresDays?: number;
  }) {
    const environment = data.environment || 'SANDBOX';
    const prefix = environment === 'PRODUCTION' ? 'rc_live_' : 'rc_test_';
    const randomSecret = randomBytes(24).toString('hex');
    const rawApiKey = `${prefix}${randomSecret}`;
    const keyPrefix = rawApiKey.slice(0, 15);
    const keyHash = this.hashKey(rawApiKey);

    const expiresAt = data.expiresDays
      ? new Date(Date.now() + data.expiresDays * 24 * 60 * 60 * 1000)
      : null;

    const clientId = `client-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const client: ApiClient = {
      id: clientId,
      name: data.name,
      organizationId: data.organizationId || null,
      userId: data.userId || null,
      environment,
      status: 'ACTIVE',
      scopes: data.scopes,
      createdAt: new Date(),
    };
    this.clientsStore.set(client.id, client);

    const keyRecord: ApiKey = {
      id: `key-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      apiClientId: client.id,
      keyPrefix,
      keyHash,
      status: 'ACTIVE',
      expiresAt,
      createdAt: new Date(),
    };
    this.keysStore.set(keyHash, keyRecord);

    this.logger.log(`Created ApiClient [${client.id}] with keyPrefix [${keyPrefix}]`);

    return {
      client,
      apiKeyRecord: {
        id: keyRecord.id,
        keyPrefix: keyRecord.keyPrefix,
        expiresAt: keyRecord.expiresAt,
        status: keyRecord.status,
      },
      rawApiKey,
    };
  }

  async validateApiKey(rawKey: string) {
    if (!rawKey || typeof rawKey !== 'string') {
      throw new UnauthorizedException('Missing or invalid API key');
    }

    const keyHash = this.hashKey(rawKey);
    const keyRecord = this.keysStore.get(keyHash);

    if (!keyRecord) {
      throw new UnauthorizedException('Invalid API key provided');
    }

    if (keyRecord.status !== 'ACTIVE') {
      throw new UnauthorizedException(`API key is ${keyRecord.status.toLowerCase()}`);
    }

    if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
      keyRecord.status = 'EXPIRED';
      throw new UnauthorizedException('API key has expired');
    }

    const client = this.clientsStore.get(keyRecord.apiClientId);
    if (!client || client.status !== 'ACTIVE') {
      throw new UnauthorizedException('API client is inactive or suspended');
    }

    keyRecord.lastUsedAt = new Date();
    client.lastUsedAt = new Date();

    return {
      apiClientId: keyRecord.apiClientId,
      clientName: client.name,
      environment: client.environment,
      scopes: client.scopes,
      organizationId: client.organizationId,
      userId: client.userId,
    };
  }

  async revokeApiKey(keyId: string) {
    const keyRecord = Array.from(this.keysStore.values()).find((k) => k.id === keyId);
    if (keyRecord) {
      keyRecord.status = 'REVOKED';
    }
    return keyRecord;
  }

  async listApiClients(filters?: { organizationId?: string; userId?: string }) {
    let clients = Array.from(this.clientsStore.values());
    if (filters?.organizationId) clients = clients.filter((c) => c.organizationId === filters.organizationId);
    if (filters?.userId) clients = clients.filter((c) => c.userId === filters.userId);

    return clients.map((c) => {
      const keys = Array.from(this.keysStore.values())
        .filter((k) => k.apiClientId === c.id)
        .map((k) => ({
          id: k.id,
          keyPrefix: k.keyPrefix,
          status: k.status,
          expiresAt: k.expiresAt,
          lastUsedAt: k.lastUsedAt,
          createdAt: k.createdAt,
        }));
      return { ...c, apiKeys: keys };
    });
  }
}
