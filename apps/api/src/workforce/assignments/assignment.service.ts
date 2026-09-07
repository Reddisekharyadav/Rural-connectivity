import { Injectable, NotFoundException } from '@nestjs/common';
import { AssignmentStateMachine, JobAssignmentStatus } from './assignment-state-machine';

export interface CreateAssignmentDto {
  jobPostingId: string;
  workerId: string;
  jobApplicationId?: string;
  jobOfferId?: string;
  startDate: string;
  endDate?: string;
  payAmount: number;
  payType?: 'DAILY' | 'HOURLY' | 'FIXED_PROJECT' | 'PER_ACRE' | 'PER_UNIT';
}

@Injectable()
export class WorkforceAssignmentService {
  private assignments = new Map<string, any>([
    [
      'asgn-01',
      {
        id: 'asgn-01',
        jobPostingId: 'job-post-001',
        workerId: 'wp-laxman-004',
        workerName: 'Laxman Naik',
        jobTitle: 'Cotton Picking & Manual Harvesting Crew (50 Acres)',
        jobApplicationId: 'app-01',
        jobOfferId: null,
        startDate: '2026-09-15',
        endDate: '2026-09-22',
        payAmount: 700,
        payType: 'DAILY',
        status: 'CONFIRMED' as JobAssignmentStatus,
        assignedAt: '2026-09-03T10:00:00Z',
        completedAt: null,
      },
    ],
    [
      'asgn-02',
      {
        id: 'asgn-02',
        jobPostingId: 'job-post-002',
        workerId: 'wp-laxman-004',
        workerName: 'Laxman Naik',
        jobTitle: 'Precision Bio-Fertilizer & Micronutrient Sprayer Operator',
        jobApplicationId: 'app-02',
        jobOfferId: 'offer-01',
        startDate: '2026-09-12',
        endDate: '2026-09-13',
        payAmount: 750,
        payType: 'DAILY',
        status: 'ACTIVE' as JobAssignmentStatus,
        assignedAt: '2026-09-06T12:00:00Z',
        completedAt: null,
      },
    ],
  ]);

  async createAssignment(dto: CreateAssignmentDto) {
    const id = `asgn-${Date.now().toString(36)}`;
    const newAssignment = {
      id,
      jobPostingId: dto.jobPostingId,
      workerId: dto.workerId,
      workerName: dto.workerId === 'wp-laxman-004' ? 'Laxman Naik' : 'Assigned Worker',
      jobTitle: 'Agricultural Employment Job',
      jobApplicationId: dto.jobApplicationId || null,
      jobOfferId: dto.jobOfferId || null,
      startDate: dto.startDate,
      endDate: dto.endDate || null,
      payAmount: dto.payAmount,
      payType: dto.payType || 'DAILY',
      status: 'CONFIRMED' as JobAssignmentStatus,
      assignedAt: new Date().toISOString(),
      completedAt: null,
    };

    this.assignments.set(id, newAssignment);
    return newAssignment;
  }

  async getAssignmentsByJob(jobId: string) {
    return Array.from(this.assignments.values()).filter((a) => a.jobPostingId === jobId);
  }

  async getMyAssignments(workerId: string) {
    return Array.from(this.assignments.values()).filter((a) => a.workerId === workerId);
  }

  async getAssignmentById(id: string) {
    const asgn = this.assignments.get(id);
    if (!asgn) {
      throw new NotFoundException(`JobAssignment ${id} not found`);
    }
    return asgn;
  }

  async transitionStatus(id: string, newStatus: JobAssignmentStatus) {
    const asgn = await this.getAssignmentById(id);
    AssignmentStateMachine.validateTransition(asgn.status, newStatus);
    asgn.status = newStatus;
    if (newStatus === 'COMPLETED') {
      asgn.completedAt = new Date().toISOString();
    }
    this.assignments.set(id, asgn);
    return asgn;
  }

  async confirmAssignment(id: string) {
    return this.transitionStatus(id, 'CONFIRMED');
  }

  async activateAssignment(id: string) {
    return this.transitionStatus(id, 'ACTIVE');
  }

  async completeAssignment(id: string) {
    return this.transitionStatus(id, 'COMPLETED');
  }

  async cancelAssignment(id: string, reason?: string) {
    const asgn = await this.getAssignmentById(id);
    asgn.status = 'CANCELLED';
    asgn.cancelReason = reason || 'Assignment cancelled';
    this.assignments.set(id, asgn);
    return asgn;
  }
}
