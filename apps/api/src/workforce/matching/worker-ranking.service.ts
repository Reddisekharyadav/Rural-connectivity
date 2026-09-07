import { Injectable } from '@nestjs/common';

export interface WorkerCandidate {
  id: string;
  userId: string;
  name: string;
  phone: string;
  village: string;
  mandal: string;
  distanceKm: number;
  serviceRadiusKm: number;
  expectedDailyRate: number;
  experienceYears: number;
  rating: number;
  completedJobs: number;
  reliabilityRate: number; // e.g. 0.96 (96%)
  availabilityStatus: string;
  skills: {
    skillCode: string;
    skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
    yearsExperience: number;
    verified: boolean;
  }[];
  certifications?: {
    name: string;
    verificationStatus: string;
  }[];
}

export interface MatchRequirement {
  skillCode: string;
  skillLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  minExperienceYears?: number;
  certificationRequired?: boolean;
  maxDistanceKm?: number;
  budgetDailyWage?: number;
}

const SKILL_LEVEL_WEIGHT: Record<string, number> = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
};

@Injectable()
export class WorkforceRankingService {
  evaluateCandidate(candidate: WorkerCandidate, req: MatchRequirement) {
    // 1. Hard Filters
    // Availability
    if (candidate.availabilityStatus === 'UNAVAILABLE' || candidate.availabilityStatus === 'BUSY') {
      return { eligible: false, reason: `Worker is currently ${candidate.availabilityStatus}` };
    }

    // Skill Filter
    const matchedSkill = candidate.skills.find(
      (s) => s.skillCode.toUpperCase() === req.skillCode.toUpperCase()
    );
    if (!matchedSkill) {
      return { eligible: false, reason: `Missing required skill: ${req.skillCode}` };
    }

    // Skill Level Filter
    const reqLevelVal = SKILL_LEVEL_WEIGHT[req.skillLevel || 'BEGINNER'] || 1;
    const candLevelVal = SKILL_LEVEL_WEIGHT[matchedSkill.skillLevel] || 1;
    if (candLevelVal < reqLevelVal) {
      return {
        eligible: false,
        reason: `Skill level ${matchedSkill.skillLevel} is lower than required ${req.skillLevel}`,
      };
    }

    // Experience Filter
    const minExp = req.minExperienceYears || 0;
    if (matchedSkill.yearsExperience < minExp && candidate.experienceYears < minExp) {
      return {
        eligible: false,
        reason: `Experience (${matchedSkill.yearsExperience} yrs) is less than required (${minExp} yrs)`,
      };
    }

    // Service Radius Filter
    if (candidate.distanceKm > candidate.serviceRadiusKm) {
      return {
        eligible: false,
        reason: `Distance ${candidate.distanceKm} km exceeds worker service radius of ${candidate.serviceRadiusKm} km`,
      };
    }

    // Certification Filter
    if (req.certificationRequired) {
      const hasCert = candidate.certifications?.some(
        (c) => c.verificationStatus === 'VERIFIED'
      );
      if (!hasCert && !matchedSkill.verified) {
        return { eligible: false, reason: 'Required certified/verified credentials missing' };
      }
    }

    // 2. Deterministic Scoring Formula (0 to 100)
    // - Skill & Proficiency: up to 25 pts
    const skillScore = Math.min(25, (candLevelVal / 4) * 20 + (matchedSkill.verified ? 5 : 0));

    // - Distance Proximity: up to 20 pts (closer is higher)
    const distanceScore = Math.max(0, 20 - (candidate.distanceKm / (candidate.serviceRadiusKm || 20)) * 10);

    // - Rating: up to 20 pts (rating/5.0 * 20)
    const ratingScore = Math.min(20, (candidate.rating / 5.0) * 20);

    // - Reliability & History: up to 15 pts
    const reliabilityScore = Math.min(15, (candidate.reliabilityRate || 0.9) * 15);

    // - Experience: up to 10 pts
    const experienceScore = Math.min(10, (matchedSkill.yearsExperience / 10) * 10);

    // - Rate Competitiveness: up to 10 pts
    let rateScore = 10;
    if (req.budgetDailyWage && candidate.expectedDailyRate > req.budgetDailyWage) {
      const diffRatio = (candidate.expectedDailyRate - req.budgetDailyWage) / req.budgetDailyWage;
      rateScore = Math.max(0, 10 - diffRatio * 20);
    }

    const totalScore = Math.round((skillScore + distanceScore + ratingScore + reliabilityScore + experienceScore + rateScore) * 10) / 10;

    return {
      eligible: true,
      score: Math.min(100, totalScore),
      breakdown: {
        skillScore,
        distanceScore: Math.round(distanceScore * 10) / 10,
        ratingScore: Math.round(ratingScore * 10) / 10,
        reliabilityScore: Math.round(reliabilityScore * 10) / 10,
        experienceScore: Math.round(experienceScore * 10) / 10,
        rateScore: Math.round(rateScore * 10) / 10,
      },
    };
  }
}
