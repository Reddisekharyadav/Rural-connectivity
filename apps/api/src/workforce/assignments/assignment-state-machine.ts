import { BadRequestException } from '@nestjs/common';

export type JobAssignmentStatus =
  | 'ASSIGNED'
  | 'CONFIRMED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'DISPUTED';

const VALID_ASSIGNMENT_TRANSITIONS: Record<JobAssignmentStatus, JobAssignmentStatus[]> = {
  ASSIGNED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['ACTIVE', 'NO_SHOW', 'CANCELLED'],
  ACTIVE: ['COMPLETED', 'DISPUTED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
  DISPUTED: ['COMPLETED', 'CANCELLED'],
};

export class AssignmentStateMachine {
  static canTransition(from: JobAssignmentStatus, to: JobAssignmentStatus): boolean {
    const allowed = VALID_ASSIGNMENT_TRANSITIONS[from] || [];
    return allowed.includes(to);
  }

  static validateTransition(from: JobAssignmentStatus, to: JobAssignmentStatus): void {
    if (!this.canTransition(from, to)) {
      throw new BadRequestException(
        `Invalid Assignment state transition from '${from}' to '${to}'. Allowed next states: [${(
          VALID_ASSIGNMENT_TRANSITIONS[from] || []
        ).join(', ')}]`
      );
    }
  }
}
