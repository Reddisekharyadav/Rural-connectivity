import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkforceHistoryService {
  private histories = new Map<string, any[]>([
    [
      'wp-laxman-004',
      [
        {
          id: 'hist-01',
          workerId: 'wp-laxman-004',
          jobAssignmentId: 'asgn-prev-8821',
          jobTitle: 'Cotton Sowing & Intercultural Weeding',
          organizationName: 'Sri Sai Agri Contracting',
          startDate: '2026-06-10',
          endDate: '2026-06-15',
          totalHours: 40.0,
          totalDays: 5.0,
          earnings: 3250.0,
          currency: 'INR',
          completionStatus: 'COMPLETED',
          rating: 4.9,
          employerFeedback: 'Extremely hardworking and punctual. High quality line-sowing.',
          createdAt: '2026-06-15T18:00:00Z',
        },
        {
          id: 'hist-02',
          workerId: 'wp-laxman-004',
          jobAssignmentId: 'asgn-prev-9904',
          jobTitle: 'Tandur Redgram Foliar Spraying Operation',
          organizationName: 'Tangipalli Rythu Seva Samithi',
          startDate: '2026-07-20',
          endDate: '2026-07-22',
          totalHours: 24.0,
          totalDays: 3.0,
          earnings: 2250.0,
          currency: 'INR',
          completionStatus: 'COMPLETED',
          rating: 4.8,
          employerFeedback: 'Expert handling of power sprayers with zero chemical waste.',
          createdAt: '2026-07-22T17:30:00Z',
        },
        {
          id: 'hist-03',
          workerId: 'wp-laxman-004',
          jobAssignmentId: 'asgn-02',
          jobTitle: 'Precision Bio-Fertilizer & Micronutrient Sprayer Operator',
          organizationName: 'Ravi Kumar (Farmer)',
          startDate: '2026-09-12',
          endDate: '2026-09-13',
          totalHours: 10.2,
          totalDays: 2.0,
          earnings: 1500.0,
          currency: 'INR',
          completionStatus: 'COMPLETED',
          rating: 5.0,
          employerFeedback: 'Excellent timing, covered full 4.5 acres seamlessly.',
          createdAt: '2026-09-13T12:00:00Z',
        },
      ],
    ],
  ]);

  async getWorkerHistory(workerId: string) {
    return this.histories.get(workerId) || [];
  }

  async getWorkerEarningsSummary(workerId: string) {
    const list = await this.getWorkerHistory(workerId);
    const totalEarnings = list.reduce((s, h) => s + (h.earnings || 0), 0);
    const totalJobsCompleted = list.filter((h) => h.completionStatus === 'COMPLETED').length;
    const avgRating =
      list.length > 0
        ? Math.round((list.reduce((s, h) => s + (h.rating || 0), 0) / list.length) * 10) / 10
        : 5.0;

    return {
      workerId,
      totalEarnings,
      currency: 'INR',
      totalJobsCompleted,
      averageRating: avgRating,
      reliabilityRate: 0.98,
      verifiedHours: list.reduce((s, h) => s + (h.totalHours || 0), 0),
    };
  }

  async recordCompletion(dto: {
    workerId: string;
    jobAssignmentId: string;
    jobTitle: string;
    organizationName: string;
    startDate: string;
    endDate?: string;
    totalHours?: number;
    totalDays?: number;
    earnings: number;
    rating?: number;
    employerFeedback?: string;
  }) {
    const current = this.histories.get(dto.workerId) || [];
    const newHistory = {
      id: `hist-${Date.now().toString(36)}`,
      workerId: dto.workerId,
      jobAssignmentId: dto.jobAssignmentId,
      jobTitle: dto.jobTitle,
      organizationName: dto.organizationName,
      startDate: dto.startDate,
      endDate: dto.endDate || new Date().toISOString().split('T')[0],
      totalHours: dto.totalHours || 8.0,
      totalDays: dto.totalDays || 1.0,
      earnings: dto.earnings,
      currency: 'INR',
      completionStatus: 'COMPLETED',
      rating: dto.rating || 5.0,
      employerFeedback: dto.employerFeedback || 'Job completed successfully.',
      createdAt: new Date().toISOString(),
    };

    current.unshift(newHistory);
    this.histories.set(dto.workerId, current);
    return newHistory;
  }
}

