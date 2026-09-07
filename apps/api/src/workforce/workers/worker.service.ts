import { Injectable, NotFoundException } from '@nestjs/common';

export interface WorkerProfileDto {
  experienceYears?: number;
  serviceRadiusKm?: number;
  expectedDailyRate?: number;
  expectedHourlyRate?: number;
  employmentType?: string;
  availabilityStatus?: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE' | 'LOOKING_FOR_WORK';
  bio?: string;
}

@Injectable()
export class WorkforceWorkerService {
  private workers = new Map<string, any>([
    [
      'usr-laxman-004',
      {
        id: 'wp-laxman-004',
        userId: 'usr-laxman-004',
        name: 'Laxman Naik',
        phone: '+91 98483 44556',
        village: 'Kotbaspalli',
        mandal: 'Tandur',
        district: 'Vikarabad',
        experienceYears: 6,
        serviceRadiusKm: 20,
        expectedDailyRate: 650,
        expectedHourlyRate: 90,
        employmentType: 'DAILY_WAGE',
        availabilityStatus: 'LOOKING_FOR_WORK',
        verificationStatus: 'VERIFIED',
        rating: 4.85,
        completedJobs: 92,
        bio: 'Specialist in calibrated agrochemical spraying, cotton picking, and harvester operation.',
        status: 'ACTIVE',
      },
    ],
    [
      'usr-ravi-001',
      {
        id: 'wp-ravi-001',
        userId: 'usr-ravi-001',
        name: 'Ravi Kumar',
        phone: '+91 98765 43210',
        village: 'Tangipalli',
        mandal: 'Tandur',
        district: 'Vikarabad',
        experienceYears: 4,
        serviceRadiusKm: 15,
        expectedDailyRate: 600,
        expectedHourlyRate: 85,
        employmentType: 'DAILY_WAGE',
        availabilityStatus: 'AVAILABLE',
        verificationStatus: 'VERIFIED',
        rating: 4.78,
        completedJobs: 48,
        bio: 'Skilled agricultural labor, tractor operations, and irrigation setup.',
        status: 'ACTIVE',
      },
    ],
  ]);

  async getProfile(userId: string) {
    const worker = this.workers.get(userId) || Array.from(this.workers.values()).find((w) => w.id === userId);
    if (!worker) {
      // Default initial profile
      const newWorker = {
        id: `wp-${userId}`,
        userId,
        experienceYears: 1,
        serviceRadiusKm: 15,
        expectedDailyRate: 550,
        expectedHourlyRate: 80,
        employmentType: 'DAILY_WAGE',
        availabilityStatus: 'AVAILABLE',
        verificationStatus: 'VERIFIED',
        rating: 4.5,
        completedJobs: 0,
        bio: 'Skilled rural worker ready for agricultural and technical assignments.',
        status: 'ACTIVE',
      };
      this.workers.set(userId, newWorker);
      return newWorker;
    }
    return worker;
  }

  async updateProfile(userId: string, dto: WorkerProfileDto) {
    const worker = await this.getProfile(userId);
    const updated = { ...worker, ...dto, updatedAt: new Date().toISOString() };
    this.workers.set(userId, updated);
    return updated;
  }

  async updateAvailability(userId: string, status: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE' | 'LOOKING_FOR_WORK') {
    const worker = await this.getProfile(userId);
    worker.availabilityStatus = status;
    worker.updatedAt = new Date().toISOString();
    this.workers.set(userId, worker);
    return worker;
  }

  async getWorkerById(workerId: string) {
    const worker = Array.from(this.workers.values()).find((w) => w.id === workerId || w.userId === workerId);
    if (!worker) {
      throw new NotFoundException(`Worker ${workerId} not found`);
    }
    return worker;
  }

  async getAllWorkers() {
    return Array.from(this.workers.values());
  }
}

