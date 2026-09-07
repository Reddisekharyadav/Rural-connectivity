import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { JobStateMachine, JobPostingStatus } from './job-state-machine';

export interface CreateJobDto {
  title: string;
  description?: string;
  jobType?: string;
  organizationId?: string;
  projectId?: string;
  farmId?: string;
  farmActivityId?: string;
  locationId?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  workersRequired: number;
  payType?: 'DAILY' | 'HOURLY' | 'FIXED_PROJECT' | 'PER_ACRE' | 'PER_UNIT' | 'NEGOTIABLE';
  minPay?: number;
  maxPay?: number;
  currency?: string;
  requirements?: {
    resourceType?: string;
    quantity: number;
    skillCode?: string;
    skillLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    minExperienceYears?: number;
    certificationRequired?: boolean;
    equipmentRequired?: boolean;
    notes?: string;
  }[];
}

@Injectable()
export class WorkforceJobService {
  private jobs = new Map<string, any>([
    [
      'job-post-001',
      {
        id: 'job-post-001',
        createdById: 'usr-contractor-003',
        creatorName: 'M. Anjaneyulu (Sri Sai Logistics & Contracting)',
        organizationId: 'org-fpo-01',
        projectId: 'proj-cotton-01',
        title: 'Cotton Picking & Manual Harvesting Crew (50 Acres)',
        description: 'Urgent requirement for 20 experienced agricultural laborers for hand-picking clean seed cotton. Daily transport and clean drinking water provided.',
        jobType: 'HARVESTING',
        locationId: 'loc-tandur-01',
        locationName: 'Tangipalli / Kotbaspalli Farmlands, Tandur',
        startDate: '2026-09-15',
        endDate: '2026-09-22',
        startTime: '07:00',
        endTime: '17:00',
        workersRequired: 20,
        payType: 'DAILY',
        minPay: 650,
        maxPay: 750,
        currency: 'INR',
        status: 'PUBLISHED' as JobPostingStatus,
        createdAt: '2026-09-01T08:00:00Z',
        requirements: [
          {
            id: 'req-01',
            resourceType: 'WORKER',
            quantity: 20,
            skillCode: 'GENERAL_AGRICULTURAL_WORKER',
            skillLevel: 'INTERMEDIATE',
            minExperienceYears: 1,
            certificationRequired: false,
            notes: 'Hand picking without leaf trash or foreign debris.',
          },
        ],
        staffingStats: {
          required: 20,
          applied: 34,
          shortlisted: 22,
          offered: 20,
          accepted: 18,
          shortage: 2,
        },
      },
    ],
    [
      'job-post-002',
      {
        id: 'job-post-002',
        createdById: 'usr-ravi-001',
        creatorName: 'Ravi Kumar (Farmer)',
        farmId: 'farm-ravi-01',
        farmActivityId: 'act-spraying-cotton-04',
        title: 'Precision Bio-Fertilizer & Micronutrient Sprayer Operator',
        description: 'Need 2 certified power sprayer operators with calibrated nozzle handling for 4.5 acres Bt-Cotton pest control.',
        jobType: 'SPRAYING',
        locationId: 'loc-tangipalli-01',
        locationName: 'Ravi North Plot, Tangipalli',
        startDate: '2026-09-12',
        endDate: '2026-09-13',
        startTime: '06:30',
        endTime: '11:30',
        workersRequired: 2,
        payType: 'DAILY',
        minPay: 700,
        maxPay: 800,
        currency: 'INR',
        status: 'APPLICATIONS_OPEN' as JobPostingStatus,
        createdAt: '2026-09-05T09:30:00Z',
        requirements: [
          {
            id: 'req-02',
            resourceType: 'WORKER',
            quantity: 2,
            skillCode: 'SPRAYER_OPERATOR',
            skillLevel: 'ADVANCED',
            minExperienceYears: 2,
            certificationRequired: true,
            notes: 'Must follow CIBRC safety guidelines & PPE protocol.',
          },
        ],
        staffingStats: {
          required: 2,
          applied: 5,
          shortlisted: 3,
          offered: 2,
          accepted: 2,
          shortage: 0,
        },
      },
    ],
  ]);

  async createJob(userId: string, dto: CreateJobDto) {
    const id = `job-post-${Date.now().toString(36)}`;
    const newJob = {
      id,
      createdById: userId,
      creatorName: dto.organizationId ? 'FPO / Cooperative Operations' : 'Farm / Contracting Employer',
      organizationId: dto.organizationId || null,
      projectId: dto.projectId || null,
      farmId: dto.farmId || null,
      farmActivityId: dto.farmActivityId || null,
      title: dto.title,
      description: dto.description || '',
      jobType: dto.jobType || 'AGRICULTURAL_LABOR',
      locationId: dto.locationId || 'loc-tandur-default',
      locationName: 'Tandur Agricultural Mandal',
      startDate: dto.startDate,
      endDate: dto.endDate || null,
      startTime: dto.startTime || '07:00',
      endTime: dto.endTime || '17:00',
      workersRequired: dto.workersRequired || 1,
      payType: dto.payType || 'DAILY',
      minPay: dto.minPay || 550,
      maxPay: dto.maxPay || 750,
      currency: dto.currency || 'INR',
      status: 'PUBLISHED' as JobPostingStatus,
      createdAt: new Date().toISOString(),
      requirements: dto.requirements?.map((r, i) => ({
        id: `req-${Date.now()}-${i}`,
        ...r,
      })) || [
        {
          id: `req-${Date.now()}-0`,
          resourceType: 'WORKER',
          quantity: dto.workersRequired || 1,
          skillCode: 'GENERAL_AGRICULTURAL_WORKER',
          skillLevel: 'INTERMEDIATE',
          minExperienceYears: 1,
          certificationRequired: false,
        },
      ],
      staffingStats: {
        required: dto.workersRequired || 1,
        applied: 0,
        shortlisted: 0,
        offered: 0,
        accepted: 0,
        shortage: dto.workersRequired || 1,
      },
    };

    this.jobs.set(id, newJob);
    return newJob;
  }

  async getJobs(filters?: { status?: string; jobType?: string; creatorId?: string }) {
    let result = Array.from(this.jobs.values());
    if (filters?.status) {
      result = result.filter((j) => j.status === filters.status);
    }
    if (filters?.jobType) {
      result = result.filter((j) => j.jobType === filters.jobType);
    }
    if (filters?.creatorId) {
      result = result.filter((j) => j.createdById === filters.creatorId);
    }
    return result;
  }

  async getJobById(id: string) {
    const job = this.jobs.get(id);
    if (!job) {
      throw new NotFoundException(`JobPosting ${id} not found`);
    }
    return job;
  }

  async updateJob(id: string, dto: Partial<CreateJobDto>) {
    const job = await this.getJobById(id);
    const updated = { ...job, ...dto, updatedAt: new Date().toISOString() };
    this.jobs.set(id, updated);
    return updated;
  }

  async transitionStatus(id: string, newStatus: JobPostingStatus) {
    const job = await this.getJobById(id);
    JobStateMachine.validateTransition(job.status, newStatus);
    job.status = newStatus;
    job.updatedAt = new Date().toISOString();
    this.jobs.set(id, job);
    return job;
  }

  async publishJob(id: string) {
    return this.transitionStatus(id, 'PUBLISHED');
  }

  async closeJob(id: string) {
    const job = await this.getJobById(id);
    job.status = 'CLOSED';
    job.updatedAt = new Date().toISOString();
    this.jobs.set(id, job);
    return job;
  }

  async cancelJob(id: string, reason?: string) {
    const job = await this.getJobById(id);
    job.status = 'CANCELLED';
    job.cancellationReason = reason || 'Cancelled by employer';
    job.updatedAt = new Date().toISOString();
    this.jobs.set(id, job);
    return job;
  }

  async createFromFarmActivity(dto: {
    farmActivityId: string;
    farmId: string;
    cropName: string;
    activityTitle: string;
    workersRequired: number;
    scheduledDate: string;
    expectedDailyWage?: number;
  }) {
    const jobDto: CreateJobDto = {
      title: `${dto.cropName} - ${dto.activityTitle}`,
      description: `Automated workforce requirement generated from Farm Planner for ${dto.activityTitle}.`,
      jobType: 'AGRICULTURAL_LABOR',
      farmId: dto.farmId,
      farmActivityId: dto.farmActivityId,
      startDate: dto.scheduledDate,
      workersRequired: dto.workersRequired,
      payType: 'DAILY',
      minPay: dto.expectedDailyWage || 600,
      maxPay: (dto.expectedDailyWage || 600) + 100,
      requirements: [
        {
          resourceType: 'WORKER',
          quantity: dto.workersRequired,
          skillCode: 'GENERAL_AGRICULTURAL_WORKER',
          skillLevel: 'INTERMEDIATE',
          minExperienceYears: 1,
        },
      ],
    };

    return this.createJob('usr-ravi-001', jobDto);
  }
}

