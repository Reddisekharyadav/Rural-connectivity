import { Controller, Post, Body } from '@nestjs/common';
import { OfflineSyncService, SyncBatchItem } from './offline-sync.service';

@Controller('platform/data/sync')
export class OfflineSyncController {
  constructor(private readonly syncService: OfflineSyncService) {}

  @Post('devices')
  async registerDevice(
    @Body()
    body: {
      userId: string;
      deviceType?: string;
      appVersion?: string;
      locale?: string;
    },
  ) {
    return this.syncService.registerDevice(body);
  }

  @Post('batch')
  async processBatch(
    @Body()
    body: {
      userId: string;
      deviceId: string;
      operations: SyncBatchItem[];
    },
  ) {
    return this.syncService.processSyncBatch(body);
  }
}
