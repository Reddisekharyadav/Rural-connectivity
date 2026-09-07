import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

export interface ApplyJobDto {
  message?: string;
  expectedPay?: number;
}

@Injectable()
export class WorkforceApplicationService {
  private applications = new Map<string, any>([
    [
      'app-01',
      {
        id: 'app-01',
        jobPostingId: 'job-post-001',
        workerId: 'wp-laxman-004',
        workerName: 'Laxman Naik',
        workerPhone: '+91 98483 44556',
        rating: 4.85,
        skillCode: 'GENERAL_AGRICULTURAL_WORKER',
        skillLevel: 'ADVANCED',
        message: 'Experienced in rapid hand-picking cotton with minimal leaf impurities.',
        expectedPay: 700,
        status: 'SHORTLISTED',
        appliedAt: '2026-09-02T10:15:00Z',
        reviewedAt: '2026-09-03T09:00:00Z',
      },
    ],
    [
      'app-02',
      {
        id: 'app-02',
        jobPostingId: 'job-post-002',
        workerId: 'wp-laxman-004',
        workerName: 'Laxman Naik',
        workerPhone: '+91 98483 44556',
        rating: 4.85,
        skillCode: 'SPRAYER_OPERATOR',
        skillLevel: 'EXPERT',
        message: 'Certified in chemical safety with PJTSAU diploma. Ready for 4.5 acres bio-spray.',
        expectedPay: 750,
        status: 'OFFERED',
        appliedAt: '2026-09-06T08:00:00Z',
        reviewedAt: '2026-09-06T11:00:00Z',
      },
    ],
  ]);

  async applyForJob(workerId: string, jobId: string, dto: ApplyJobDto) {
    const existing = Array.from(this.applications.values()).find(
      (a) => a.jobPostingId === jobId && a.workerId === workerId && a.status !== 'WITHDRAWN' && a.status !== 'REJECTED'
    );

    if (existing) {
      throw new BadRequestException('You have already submitted an active application for this job posting.');
    }

    const id = `app-${Date.now().toString(36)}`;
    const newApp = {
      id,
      jobPostingId: jobId,
      workerId,
      workerName: workerId === 'wp-laxman-004' ? 'Laxman Naik' : 'Ravi Kumar (Worker)',
      workerPhone: workerId === 'wp-laxman-004' ? '+91 98483 44556' : '+91 98765 43210',
      rating: 4.8,
      skillCode: 'GENERAL_AGRICULTURAL_WORKER',
      skillLevel: 'ADVANCED',
      message: dto.message || 'Available and ready for assigned work schedule.',
      expectedPay: dto.expectedPay || 650,
      status: 'SUBMITTED',
      appliedAt: new Date().toISOString(),
      reviewedAt: null,
    };

    this.applications.set(id, newApp);
    return newApp;
  }

  async getJobApplications(jobId: string) {
    return Array.from(this.applications.values()).filter((a) => a.jobPostingId === jobId);
  }

  async getMyApplications(workerId: string) {
    return Array.from(this.applications.values()).filter((a) => a.workerId === workerId);
  }

  async getApplicationById(id: string) {
    const app = this.applications.get(id);
    if (!app) {
      throw new NotFoundException(`Application ${id} not found`);
    }
    return app;
  }

  async shortlistApplication(id: string) {
    const app = await this.getApplicationById(id);
    app.status = 'SHORTLISTED';
    app.reviewedAt = new Date().toISOString();
    this.applications.set(id, app);
    return app;
  }

  async rejectApplication(id: string, reason?: string) {
    const app = await this.getApplicationById(id);
    app.status = 'REJECTED';
    app.rejectionReason = reason || 'Not matching current staffing requirements';
    app.reviewedAt = new Date().toISOString();
    this.applications.set(id, app);
    return app;
  }

  async withdrawApplication(id: string, workerId: string) {
    const app = await this.getApplicationById(id);
    if (app.workerId !== workerId) {
      throw new BadRequestException('Unauthorized to withdraw this application');
    }
    app.status = 'WITHDRAWN';
    this.applications.set(id, app);
    return app;
  }
}
