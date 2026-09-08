import { Injectable, Logger } from '@nestjs/common';

export type SyncOpType = 'CREATE' | 'UPDATE' | 'DELETE';
export type SyncStatus = 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED' | 'CONFLICT';

export interface SyncBatchItem {
  operationId: string;
  operationType: SyncOpType;
  entityType: string;
  entityId: string;
  payload: any;
  entityVersion: number;
}

export interface SyncOperation {
  id: string;
  userId: string;
  deviceId: string;
  operationId: string;
  operationType: SyncOpType;
  entityType: string;
  entityId: string;
  payload: any;
  status: SyncStatus;
  entityVersion: number;
  serverVersion: number;
  conflictReason?: string | null;
  createdAt: Date;
  syncedAt?: Date | null;
}

export interface PlatformDevice {
  id: string;
  userId: string;
  deviceType: string;
  appVersion: string;
  deviceVersion?: string | null;
  locale: string;
  lastSyncAt?: Date | null;
  status: string;
  createdAt: Date;
}

@Injectable()
export class OfflineSyncService {
  private readonly logger = new Logger(OfflineSyncService.name);
  private devicesStore: Map<string, PlatformDevice> = new Map();
  private syncOpsStore: Map<string, SyncOperation> = new Map();
  private entityServerVersions: Map<string, number> = new Map();

  async registerDevice(data: {
    userId: string;
    deviceType?: string;
    appVersion?: string;
    locale?: string;
  }): Promise<PlatformDevice> {
    const device: PlatformDevice = {
      id: `dev-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: data.userId,
      deviceType: data.deviceType || 'ANDROID',
      appVersion: data.appVersion || '1.0.0',
      locale: data.locale || 'te',
      lastSyncAt: new Date(),
      status: 'ACTIVE',
      createdAt: new Date(),
    };

    this.devicesStore.set(device.id, device);
    return device;
  }

  async processSyncBatch(data: {
    userId: string;
    deviceId: string;
    operations: SyncBatchItem[];
  }) {
    const results = [];

    for (const op of data.operations) {
      const entityKey = `${op.entityType}:${op.entityId}`;
      const currentServerVersion = this.entityServerVersions.get(entityKey) || 1;

      // 1. Check for duplicate operationId (Idempotency)
      const existingOp = this.syncOpsStore.get(op.operationId);

      if (existingOp) {
        results.push({
          operationId: op.operationId,
          status: existingOp.status,
          serverVersion: existingOp.serverVersion,
          message: 'Operation already processed (idempotent)',
        });
        continue;
      }

      // 2. Conflict Detection (Server-authoritative state guard)
      if (op.entityVersion < currentServerVersion) {
        const conflictReason = `Client entity version (${op.entityVersion}) is behind server version (${currentServerVersion}). State conflict detected.`;
        this.logger.warn(`Sync Conflict on [${entityKey}]: ${conflictReason}`);

        const conflictRecord: SyncOperation = {
          id: `sync-op-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: data.userId,
          deviceId: data.deviceId,
          operationId: op.operationId,
          operationType: op.operationType,
          entityType: op.entityType,
          entityId: op.entityId,
          payload: op.payload,
          status: 'CONFLICT',
          entityVersion: op.entityVersion,
          serverVersion: currentServerVersion,
          conflictReason,
          createdAt: new Date(),
        };
        this.syncOpsStore.set(op.operationId, conflictRecord);

        results.push({
          operationId: op.operationId,
          status: 'CONFLICT',
          serverVersion: currentServerVersion,
          error: conflictReason,
        });
        continue;
      }

      // 3. Increment server version and apply operation
      const newServerVersion = currentServerVersion + 1;
      this.entityServerVersions.set(entityKey, newServerVersion);

      const syncRecord: SyncOperation = {
        id: `sync-op-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        userId: data.userId,
        deviceId: data.deviceId,
        operationId: op.operationId,
        operationType: op.operationType,
        entityType: op.entityType,
        entityId: op.entityId,
        payload: op.payload,
        status: 'SYNCED',
        entityVersion: op.entityVersion,
        serverVersion: newServerVersion,
        createdAt: new Date(),
        syncedAt: new Date(),
      };
      this.syncOpsStore.set(op.operationId, syncRecord);

      this.logger.log(`Successfully synced [${entityKey}] to server version ${newServerVersion}`);
      results.push({
        operationId: op.operationId,
        status: 'SYNCED',
        serverVersion: newServerVersion,
      });
    }

    const device = this.devicesStore.get(data.deviceId);
    if (device) {
      device.lastSyncAt = new Date();
    }

    return {
      syncedOperationsCount: results.filter((r) => r.status === 'SYNCED').length,
      conflictsCount: results.filter((r) => r.status === 'CONFLICT').length,
      results,
    };
  }

  setEntityServerVersion(entityType: string, entityId: string, version: number) {
    this.entityServerVersions.set(`${entityType}:${entityId}`, version);
  }
}

