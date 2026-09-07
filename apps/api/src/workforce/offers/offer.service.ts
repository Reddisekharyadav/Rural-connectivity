import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

export interface CreateOfferDto {
  jobPostingId: string;
  workerId: string;
  payAmount: number;
  payType?: 'DAILY' | 'HOURLY' | 'FIXED_PROJECT' | 'PER_ACRE' | 'PER_UNIT';
  startDate: string;
  endDate?: string;
  message?: string;
  expiresInDays?: number;
}

@Injectable()
export class WorkforceOfferService {
  private offers = new Map<string, any>([
    [
      'offer-01',
      {
        id: 'offer-01',
        jobPostingId: 'job-post-002',
        workerId: 'wp-laxman-004',
        createdById: 'usr-ravi-001',
        creatorName: 'Ravi Kumar (Farmer)',
        jobTitle: 'Precision Bio-Fertilizer & Micronutrient Sprayer Operator',
        payAmount: 750,
        payType: 'DAILY',
        startDate: '2026-09-12',
        endDate: '2026-09-13',
        message: 'Offer for 2 days of bio-spraying on 4.5 acres Bt-Cotton. Power sprayer provided.',
        status: 'OFFERED',
        createdAt: '2026-09-06T11:30:00Z',
        expiresAt: '2026-09-11T23:59:59Z',
      },
    ],
  ]);

  async createOffer(employerId: string, dto: CreateOfferDto) {
    const id = `offer-${Date.now().toString(36)}`;
    const newOffer = {
      id,
      jobPostingId: dto.jobPostingId,
      workerId: dto.workerId,
      createdById: employerId,
      creatorName: employerId === 'usr-contractor-003' ? 'M. Anjaneyulu (Contractor)' : 'Ravi Kumar (Employer)',
      jobTitle: 'Agricultural Project Assignment',
      payAmount: dto.payAmount,
      payType: dto.payType || 'DAILY',
      startDate: dto.startDate,
      endDate: dto.endDate || null,
      message: dto.message || 'Formal employment offer on RuralConnect.',
      status: 'OFFERED',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (dto.expiresInDays || 3) * 86400000).toISOString(),
    };

    this.offers.set(id, newOffer);
    return newOffer;
  }

  async getMyOffers(workerId: string) {
    return Array.from(this.offers.values()).filter((o) => o.workerId === workerId);
  }

  async getOffersByJob(jobId: string) {
    return Array.from(this.offers.values()).filter((o) => o.jobPostingId === jobId);
  }

  async getOfferById(id: string) {
    const offer = this.offers.get(id);
    if (!offer) {
      throw new NotFoundException(`JobOffer ${id} not found`);
    }
    return offer;
  }

  async acceptOffer(id: string, workerId: string) {
    const offer = await this.getOfferById(id);
    if (offer.workerId !== workerId) {
      throw new BadRequestException('Unauthorized to accept this job offer');
    }
    if (offer.status !== 'OFFERED') {
      throw new BadRequestException(`Cannot accept offer in '${offer.status}' status`);
    }

    offer.status = 'ACCEPTED';
    offer.acceptedAt = new Date().toISOString();
    this.offers.set(id, offer);
    return offer;
  }

  async declineOffer(id: string, workerId: string, reason?: string) {
    const offer = await this.getOfferById(id);
    if (offer.workerId !== workerId) {
      throw new BadRequestException('Unauthorized to decline this job offer');
    }
    offer.status = 'DECLINED';
    offer.declinedReason = reason || 'Worker declined offer';
    offer.declinedAt = new Date().toISOString();
    this.offers.set(id, offer);
    return offer;
  }
}

