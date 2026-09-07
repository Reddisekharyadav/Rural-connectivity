import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

export interface SkillDefinition {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
}

export const WORKFORCE_SKILL_CATALOG: SkillDefinition[] = [
  {
    id: 'sk-01',
    code: 'TRACTOR_OPERATOR',
    name: 'Tractor Operator',
    category: 'Machinery Operation',
    description: 'Operation of 35-75 HP tractors with rotavators, cultivators, disc harrows, and seed drills.',
  },
  {
    id: 'sk-02',
    code: 'SPRAYER_OPERATOR',
    name: 'Sprayer Operator',
    category: 'Crop Protection',
    description: 'Calibrated application of bio-pesticides and micronutrients with motorized power sprayers and PPE.',
  },
  {
    id: 'sk-03',
    code: 'PUMP_OPERATOR',
    name: 'Pump Operator',
    category: 'Irrigation',
    description: 'Management of electric, solar, and diesel submersible/centrifugal irrigation pumps.',
  },
  {
    id: 'sk-04',
    code: 'PUMP_TECHNICIAN',
    name: 'Pump Technician',
    category: 'Technical / Repair',
    description: 'Electrical winding, mechanical seal replacement, and impeller overhaul for agricultural pumps.',
  },
  {
    id: 'sk-05',
    code: 'IRRIGATION_WORKER',
    name: 'Irrigation Worker',
    category: 'Irrigation',
    description: 'Drip line installation, emitter flushing, sprinkler layout, and moisture-controlled field irrigation.',
  },
  {
    id: 'sk-06',
    code: 'AGRICULTURAL_MACHINERY_OPERATOR',
    name: 'Harvester & Machinery Operator',
    category: 'Machinery Operation',
    description: 'Combine harvester, multi-crop thresher, paddy transplanter, and power reaper handling.',
  },
  {
    id: 'sk-07',
    code: 'MACHINERY_MECHANIC',
    name: 'Machinery Mechanic',
    category: 'Technical / Repair',
    description: 'Field diagnostics, diesel engine repair, hydraulic cylinder maintenance, and implement alignment.',
  },
  {
    id: 'sk-08',
    code: 'GENERAL_AGRICULTURAL_WORKER',
    name: 'General Agricultural Labor',
    category: 'Field Labor',
    description: 'Manual sowing, weeding, intercultural operations, cotton picking, and crop harvest packaging.',
  },
  {
    id: 'sk-09',
    code: 'HEAVY_VEHICLE_DRIVER',
    name: 'Rural Logistics Driver',
    category: 'Logistics',
    description: 'Safe transport of agricultural commodities, fertilizer loads, and farm machinery across rural corridors.',
  },
];

@Injectable()
export class WorkforceSkillService {
  private workerSkills = new Map<string, any[]>([
    [
      'wp-laxman-004',
      [
        {
          id: 'ws-laxman-01',
          workerId: 'wp-laxman-004',
          skillId: 'sk-02',
          skillCode: 'SPRAYER_OPERATOR',
          name: 'Sprayer Operator',
          category: 'Crop Protection',
          skillLevel: 'EXPERT',
          yearsExperience: 6,
          isPrimary: true,
          verified: true,
          verifiedAt: '2025-06-15T10:00:00Z',
        },
        {
          id: 'ws-laxman-02',
          workerId: 'wp-laxman-004',
          skillId: 'sk-08',
          skillCode: 'GENERAL_AGRICULTURAL_WORKER',
          name: 'General Agricultural Labor',
          category: 'Field Labor',
          skillLevel: 'ADVANCED',
          yearsExperience: 6,
          isPrimary: false,
          verified: true,
          verifiedAt: '2025-06-15T10:00:00Z',
        },
        {
          id: 'ws-laxman-03',
          workerId: 'wp-laxman-004',
          skillId: 'sk-06',
          skillCode: 'AGRICULTURAL_MACHINERY_OPERATOR',
          name: 'Harvester & Machinery Operator',
          category: 'Machinery Operation',
          skillLevel: 'INTERMEDIATE',
          yearsExperience: 3,
          isPrimary: false,
          verified: true,
          verifiedAt: '2025-11-20T14:30:00Z',
        },
      ],
    ],
  ]);

  async getCatalog() {
    return WORKFORCE_SKILL_CATALOG;
  }

  async getWorkerSkills(workerId: string) {
    return this.workerSkills.get(workerId) || [];
  }

  async addWorkerSkill(
    workerId: string,
    dto: {
      skillCode: string;
      skillLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
      yearsExperience?: number;
      isPrimary?: boolean;
    }
  ) {
    const code = dto.skillCode.toUpperCase();
    const skillDef = WORKFORCE_SKILL_CATALOG.find((s) => s.code === code || s.id === code);
    if (!skillDef) {
      throw new BadRequestException(`Skill ${dto.skillCode} not found in catalog.`);
    }

    const current = this.workerSkills.get(workerId) || [];
    const existingIndex = current.findIndex((s) => s.skillCode === skillDef.code);

    if (existingIndex >= 0) {
      current[existingIndex] = {
        ...current[existingIndex],
        skillLevel: dto.skillLevel || current[existingIndex].skillLevel,
        yearsExperience: dto.yearsExperience || current[existingIndex].yearsExperience,
        isPrimary: dto.isPrimary ?? current[existingIndex].isPrimary,
      };
      this.workerSkills.set(workerId, current);
      return current[existingIndex];
    }

    const newSkill = {
      id: `ws-${Date.now().toString(36)}`,
      workerId,
      skillId: skillDef.id,
      skillCode: skillDef.code,
      name: skillDef.name,
      category: skillDef.category,
      skillLevel: dto.skillLevel || 'INTERMEDIATE',
      yearsExperience: dto.yearsExperience || 1,
      isPrimary: dto.isPrimary || false,
      verified: true,
      verifiedAt: new Date().toISOString(),
    };

    current.push(newSkill);
    this.workerSkills.set(workerId, current);
    return newSkill;
  }

  async updateWorkerSkill(
    workerId: string,
    skillRecordId: string,
    dto: {
      skillLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
      yearsExperience?: number;
      isPrimary?: boolean;
    }
  ) {
    const current = this.workerSkills.get(workerId) || [];
    const index = current.findIndex((s) => s.id === skillRecordId || s.skillId === skillRecordId);
    if (index === 0 && !current[0]) {
      throw new NotFoundException(`Skill record ${skillRecordId} not found for worker.`);
    }

    current[index] = { ...current[index], ...dto };
    this.workerSkills.set(workerId, current);
    return current[index];
  }

  async removeWorkerSkill(workerId: string, skillRecordId: string) {
    const current = this.workerSkills.get(workerId) || [];
    const filtered = current.filter((s) => s.id !== skillRecordId && s.skillId !== skillRecordId);
    this.workerSkills.set(workerId, filtered);
    return { success: true, removedId: skillRecordId };
  }
}

