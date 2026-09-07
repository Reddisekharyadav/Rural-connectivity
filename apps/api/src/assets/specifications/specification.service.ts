import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetService } from '../assets/asset.service';

export interface CreateSpecDto {
  key: string;
  value: string;
  unit?: string;
}

@Injectable()
export class AssetSpecificationService {
  private specs = new Map<string, any[]>();

  constructor(private readonly assetService: AssetService) {}

  async addSpecification(assetId: string, dto: CreateSpecDto): Promise<any> {
    const asset = await this.assetService.getAssetById(assetId);
    const id = `sp-${Date.now()}`;
    const newSpec = { id, assetId, key: dto.key, value: dto.value, unit: dto.unit, createdAt: new Date() };

    const currentSpecs = this.specs.get(assetId) || asset.specifications || [];
    currentSpecs.push(newSpec);
    this.specs.set(assetId, currentSpecs);
    asset.specifications = currentSpecs;

    return newSpec;
  }

  async getSpecifications(assetId: string): Promise<any[]> {
    const asset = await this.assetService.getAssetById(assetId);
    return this.specs.get(assetId) || asset.specifications || [];
  }

  async updateSpecification(assetId: string, specId: string, dto: Partial<CreateSpecDto>): Promise<any> {
    const specs = await this.getSpecifications(assetId);
    const spec = specs.find((s) => s.id === specId);
    if (!spec) throw new NotFoundException(`Specification '${specId}' not found`);

    Object.assign(spec, dto);
    return spec;
  }

  async deleteSpecification(assetId: string, specId: string): Promise<{ success: boolean; deletedId: string }> {
    const specs = await this.getSpecifications(assetId);
    const index = specs.findIndex((s) => s.id === specId);
    if (index === -1) throw new NotFoundException(`Specification '${specId}' not found`);

    specs.splice(index, 1);
    this.specs.set(assetId, specs);
    return { success: true, deletedId: specId };
  }
}

