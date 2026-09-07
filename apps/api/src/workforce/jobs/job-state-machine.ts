import { BadRequestException } from '@nestjs/common';

export type JobPostingStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'APPLICATIONS_OPEN'
  | 'SHORTLISTING'
  | 'STAFFING'
  | 'READY'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CLOSED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'DISPUTED';

const VALID_JOB_TRANSITIONS: Record<JobPostingStatus, JobPostingStatus[]> = {
  DRAFT: ['PUBLISHED', 'CANCELLED'],
  PUBLISHED: ['APPLICATIONS_OPEN', 'SHORTLISTING', 'STAFFING', 'CANCELLED', 'EXPIRED'],
  APPLICATIONS_OPEN: ['SHORTLISTING', 'STAFFING', 'CANCELLED', 'EXPIRED'],
  SHORTLISTING: ['STAFFING', 'READY', 'CANCELLED'],
  STAFFING: ['READY', 'IN_PROGRESS', 'CANCELLED'],
  READY: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'DISPUTED', 'CANCELLED'],
  COMPLETED: ['CLOSED'],
  CLOSED: [],
  CANCELLED: [],
  EXPIRED: [],
  DISPUTED: ['COMPLETED', 'CANCELLED', 'CLOSED'],
};

export class JobStateMachine {
  static canTransition(from: JobPostingStatus, to: JobPostingStatus): boolean {
    const allowed = VALID_JOB_TRANSITIONS[from] || [];
    return allowed.includes(to);
  }

  static validateTransition(from: JobPostingStatus, to: JobPostingStatus): void {
    if (!this.canTransition(from, to)) {
      throw new BadRequestException(
        `Invalid Job state transition from '${from}' to '${to}'. Allowed next states: [${(
          VALID_JOB_TRANSITIONS[from] || []
        ).join(', ')}]`
      );
    }
  }
}
