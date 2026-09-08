import { Injectable, Logger } from '@nestjs/common';

export type ExportType = 'FARMER_ACTIVITY' | 'WORKER_ATTENDANCE' | 'ORDERS_FINANCIAL' | 'CUSTOM';
export type ExportFormat = 'CSV' | 'JSON' | 'PDF';
export type ExportStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';

export interface DataExportJob {
  id: string;
  requestedById: string;
  organizationId?: string | null;
  type: ExportType;
  format: ExportFormat;
  filters?: any;
  status: ExportStatus;
  fileReference?: string | null;
  fileSize?: number | null;
  expiresAt?: Date | null;
  createdAt: Date;
  completedAt?: Date | null;
}

@Injectable()
export class DataExportService {
  private readonly logger = new Logger(DataExportService.name);
  private exportJobsStore: Map<string, DataExportJob> = new Map();

  async createExportJob(data: {
    requestedById: string;
    organizationId?: string;
    type: ExportType;
    format: ExportFormat;
    filters?: any;
  }): Promise<DataExportJob> {
    const job: DataExportJob = {
      id: `exp-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      requestedById: data.requestedById,
      organizationId: data.organizationId || null,
      type: data.type,
      format: data.format,
      filters: data.filters,
      status: 'QUEUED',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    };

    this.exportJobsStore.set(job.id, job);

    this.processExportJob(job.id).catch((err) => {
      this.logger.error(`Error processing export job ${job.id}: ${err?.message}`);
    });

    return job;
  }

  async processExportJob(jobId: string) {
    const job = this.exportJobsStore.get(jobId);
    if (!job) return;

    job.status = 'PROCESSING';

    let generatedContent = '';
    let fileSize = 0;

    if (job.format === 'CSV') {
      if (job.type === 'FARMER_ACTIVITY') {
        generatedContent = 'FarmerId,Name,Village,Mandal,Crops,TotalAcres,Status\n';
        generatedContent += 'usr-001,Kuruva Mallesh,Tangipalli,Tandur,Cotton;Paddy,5.0,ACTIVE\n';
        generatedContent += 'usr-002,Suresh Rao,Basheerabad,Tandur,Paddy,8.5,ACTIVE\n';
      } else if (job.type === 'WORKER_ATTENDANCE') {
        generatedContent = 'WorkerId,JobId,Date,HoursWorked,WagePaid,VerifiedBy\n';
        generatedContent += 'wrk-001,job-001,2026-09-07,8.0,650.0,Contractor\n';
        generatedContent += 'wrk-001,job-001,2026-09-08,8.0,650.0,OTP\n';
      } else {
        generatedContent = 'TransactionId,Category,Amount,Currency,Date,Status\n';
        generatedContent += 'ftx-001,SERVICES,4000.0,INR,2026-09-08,SETTLED\n';
      }
      fileSize = Buffer.byteLength(generatedContent, 'utf8');
    } else {
      const sampleData = {
        exportType: job.type,
        generatedAt: new Date().toISOString(),
        recordsCount: 42,
        records: [
          { id: 'rec-001', category: job.type, amount: 4000.0, status: 'COMPLETED' },
          { id: 'rec-002', category: job.type, amount: 2500.0, status: 'COMPLETED' },
        ],
      };
      generatedContent = JSON.stringify(sampleData, null, 2);
      fileSize = Buffer.byteLength(generatedContent, 'utf8');
    }

    job.status = 'COMPLETED';
    job.fileReference = `/downloads/exports/${job.id}.${job.format.toLowerCase()}`;
    job.fileSize = fileSize;
    job.completedAt = new Date();
    return job;
  }

  async listExportJobs(filters?: { requestedById?: string; organizationId?: string }) {
    let jobs = Array.from(this.exportJobsStore.values());
    if (filters?.requestedById) jobs = jobs.filter((j) => j.requestedById === filters.requestedById);
    if (filters?.organizationId) jobs = jobs.filter((j) => j.organizationId === filters.organizationId);

    return jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

