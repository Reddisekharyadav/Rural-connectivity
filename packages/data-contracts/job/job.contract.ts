export interface JobCreatedV1 {
  jobId: string;
  creatorId: string;
  organizationId?: string;
  title: string;
  skillCategory: string;
  requiredWorkers: number;
  dailyWage: number;
  startDate: string;
  endDate?: string;
  location: {
    village: string;
    mandal: string;
    district: string;
  };
}

export interface JobAssignedV1 {
  jobId: string;
  workerId: string;
  assignedAt: string;
  dailyWage: number;
}

export interface JobCompletedV1 {
  jobId: string;
  workerId: string;
  totalDaysWorked: number;
  totalWagePaid: number;
  completedAt: string;
  rating?: number;
}
