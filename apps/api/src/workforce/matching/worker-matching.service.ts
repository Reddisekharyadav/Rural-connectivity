import { Injectable } from '@nestjs/common';
import { WorkforceRankingService, WorkerCandidate, MatchRequirement } from './worker-ranking.service';

export const MOCK_WORKER_POOL: WorkerCandidate[] = [
  {
    id: 'wp-laxman-004',
    userId: 'usr-laxman-004',
    name: 'Laxman Naik',
    phone: '+91 98483 44556',
    village: 'Kotbaspalli',
    mandal: 'Tandur',
    distanceKm: 3.5,
    serviceRadiusKm: 20,
    expectedDailyRate: 650,
    experienceYears: 6,
    rating: 4.85,
    completedJobs: 92,
    reliabilityRate: 0.98,
    availabilityStatus: 'LOOKING_FOR_WORK',
    skills: [
      { skillCode: 'SPRAYER_OPERATOR', skillLevel: 'EXPERT', yearsExperience: 6, verified: true },
      { skillCode: 'GENERAL_AGRICULTURAL_WORKER', skillLevel: 'ADVANCED', yearsExperience: 6, verified: true },
      { skillCode: 'AGRICULTURAL_MACHINERY_OPERATOR', skillLevel: 'INTERMEDIATE', yearsExperience: 3, verified: true },
    ],
    certifications: [
      { name: 'Certified Agricultural Power Sprayer Operator', verificationStatus: 'VERIFIED' },
    ],
  },
  {
    id: 'wp-shankar-005',
    userId: 'usr-shankar-005',
    name: 'Shankar Rao',
    phone: '+91 98484 11223',
    village: 'Tangipalli',
    mandal: 'Tandur',
    distanceKm: 4.2,
    serviceRadiusKm: 15,
    expectedDailyRate: 600,
    experienceYears: 4,
    rating: 4.7,
    completedJobs: 44,
    reliabilityRate: 0.95,
    availabilityStatus: 'AVAILABLE',
    skills: [
      { skillCode: 'GENERAL_AGRICULTURAL_WORKER', skillLevel: 'INTERMEDIATE', yearsExperience: 4, verified: true },
      { skillCode: 'PUMP_OPERATOR', skillLevel: 'INTERMEDIATE', yearsExperience: 3, verified: false },
    ],
  },
  {
    id: 'wp-anjaiah-006',
    userId: 'usr-anjaiah-006',
    name: 'Anjaiah Kurva',
    phone: '+91 98485 22334',
    village: 'Malkapur',
    mandal: 'Tandur',
    distanceKm: 8.5,
    serviceRadiusKm: 12,
    expectedDailyRate: 550,
    experienceYears: 2,
    rating: 4.6,
    completedJobs: 28,
    reliabilityRate: 0.92,
    availabilityStatus: 'AVAILABLE',
    skills: [
      { skillCode: 'GENERAL_AGRICULTURAL_WORKER', skillLevel: 'INTERMEDIATE', yearsExperience: 2, verified: true },
    ],
  },
  {
    id: 'wp-ramesh-007',
    userId: 'usr-ramesh-007',
    name: 'Ramesh Varma',
    phone: '+91 98486 33445',
    village: 'Vikarabad Outskirts',
    mandal: 'Vikarabad',
    distanceKm: 28.0,
    serviceRadiusKm: 15,
    expectedDailyRate: 700,
    experienceYears: 8,
    rating: 4.9,
    completedJobs: 110,
    reliabilityRate: 0.99,
    availabilityStatus: 'AVAILABLE',
    skills: [
      { skillCode: 'SPRAYER_OPERATOR', skillLevel: 'EXPERT', yearsExperience: 8, verified: true },
      { skillCode: 'TRACTOR_OPERATOR', skillLevel: 'EXPERT', yearsExperience: 7, verified: true },
    ],
  },
];

@Injectable()
export class WorkforceMatchingService {
  constructor(private readonly rankingService: WorkforceRankingService) {}

  matchWorkers(req: MatchRequirement, candidates: WorkerCandidate[] = MOCK_WORKER_POOL) {
    const matched: any[] = [];
    const excluded: any[] = [];

    for (const cand of candidates) {
      const result = this.rankingService.evaluateCandidate(cand, req);
      if (result.eligible) {
        matched.push({
          worker: cand,
          score: result.score,
          breakdown: result.breakdown,
        });
      } else {
        excluded.push({
          worker: cand,
          reason: result.reason,
        });
      }
    }

    // Rank descending by total score
    matched.sort((a, b) => b.score - a.score);

    return {
      requirement: req,
      totalMatched: matched.length,
      totalExcluded: excluded.length,
      matchedCandidates: matched,
      excludedCandidates: excluded,
    };
  }
}

