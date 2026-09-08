import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
  status: string;
  createdAt: Date;
  children?: ServiceCategory[];
}

@Injectable()
export class ServiceCategoryService {
  private categories = new Map<string, ServiceCategory>([
    [
      'scat-001',
      {
        id: 'scat-001',
        name: 'Machinery & Tractor Repair',
        description: 'Heavy farm machinery engine diagnostics, transmission, clutch & hydraulic overhaul',
        parentId: null,
        status: 'ACTIVE',
        createdAt: new Date('2026-08-01T10:00:00Z'),
      },
    ],
    [
      'scat-002',
      {
        id: 'scat-002',
        name: 'Pump & Motor Rewinding',
        description: 'Borewell submersible, open-well & monoblock motor rewinding & pump maintenance',
        parentId: null,
        status: 'ACTIVE',
        createdAt: new Date('2026-08-01T10:00:00Z'),
      },
    ],
    [
      'scat-003',
      {
        id: 'scat-003',
        name: 'Agricultural Welding & Fabrication',
        description: 'Trailer body repairs, cultivator shank strengthening & custom implement fabrication',
        parentId: null,
        status: 'ACTIVE',
        createdAt: new Date('2026-08-01T10:00:00Z'),
      },
    ],
    [
      'scat-004',
      {
        id: 'scat-004',
        name: 'Farm Electrical & Solar Installation',
        description: 'Star-delta starter wiring, solar pump panel installation, and line fault fixing',
        parentId: null,
        status: 'ACTIVE',
        createdAt: new Date('2026-08-01T10:00:00Z'),
      },
    ],
  ]);

  async createCategory(data: {
    name: string;
    description?: string;
    parentId?: string;
  }): Promise<ServiceCategory> {
    if (!data.name) {
      throw new BadRequestException('Category name is required');
    }

    if (data.parentId && !this.categories.has(data.parentId)) {
      throw new NotFoundException(`Parent category with ID '${data.parentId}' not found`);
    }

    const id = `scat-${Date.now().toString().slice(-6)}`;
    const cat: ServiceCategory = {
      id,
      name: data.name,
      description: data.description || null,
      parentId: data.parentId || null,
      status: 'ACTIVE',
      createdAt: new Date(),
    };

    this.categories.set(id, cat);
    return cat;
  }

  async listCategories(): Promise<ServiceCategory[]> {
    const all = Array.from(this.categories.values());
    const roots = all.filter((c) => !c.parentId && c.status === 'ACTIVE');
    return roots.map((root) => ({
      ...root,
      children: all.filter((c) => c.parentId === root.id && c.status === 'ACTIVE'),
    }));
  }

  async getCategoryById(id: string): Promise<ServiceCategory> {
    const cat = this.categories.get(id);
    if (!cat) {
      throw new NotFoundException(`ServiceCategory with ID '${id}' not found`);
    }
    return cat;
  }
}

