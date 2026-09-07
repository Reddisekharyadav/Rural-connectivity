import { Injectable } from '@nestjs/common';

export interface ExperienceDto {
  jobTitle: string;
  organizationName: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
}

@Injectable()
export class WorkforceExperienceService {
  private experiences = new Map<string, any[]>([
    [
      'wp-laxman-004',
      [
        {
          id: 'exp-laxman-01',
          workerId: 'wp-laxman-004',
          jobTitle: 'Lead Chemical Sprayer & Harvest Coordinator',
          organizationName: 'Sri Sai Agri Contracting & Tandur Cluster',
          description: 'Supervised 12 field sprayers across 250 acres of commercial cotton and pigeon pea crops.',
          startDate: '2023-05-01',
          endDate: '2025-12-31',
          isCurrent: false,
          createdAt: '2023-05-01T08:00:00Z',
        },
        {
          id: 'exp-laxman-02',
          workerId: 'wp-laxman-004',
          jobTitle: 'Senior Agricultural Equipment Operator',
          organizationName: 'Tangipalli Rythu Seva Cooperative',
          description: 'Operated power sprayers, rotavators, and multi-crop threshers with zero safety incidents.',
          startDate: '2026-01-10',
          endDate: null,
          isCurrent: true,
          createdAt: '2026-01-10T09:00:00Z',
        },
      ],
    ],
  ]);

  async getExperience(workerId: string) {
    return this.experiences.get(workerId) || [];
  }

  async addExperience(workerId: string, dto: ExperienceDto) {
    const current = this.experiences.get(workerId) || [];
    const newExp = {
      id: `exp-${Date.now().toString(36)}`,
      workerId,
      jobTitle: dto.jobTitle,
      organizationName: dto.organizationName,
      description: dto.description || '',
      startDate: dto.startDate,
      endDate: dto.endDate || null,
      isCurrent: dto.isCurrent || false,
      createdAt: new Date().toISOString(),
    };

    current.push(newExp);
    this.experiences.set(workerId, current);
    return newExp;
  }
}
