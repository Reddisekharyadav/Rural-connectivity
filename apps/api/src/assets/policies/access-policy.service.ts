import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetService } from '../assets/asset.service';

export type AssetAccessType = 'PUBLIC_RENTAL' | 'MEMBERS_ONLY' | 'APPROVAL_REQUIRED' | 'INTERNAL_ONLY';

export interface CreateAccessPolicyDto {
  assetId: string;
  organizationId: string;
  accessType: AssetAccessType;
  memberEligibility?: string;
  pricingRuleId?: string;
  approvalRequired?: boolean;
}

@Injectable()
export class AssetAccessPolicyService {
  private policies = new Map<string, any[]>([
    [
      'org-tandur-fpo',
      [
        {
          id: 'pol-001',
          assetId: 'ast-003',
          organizationId: 'org-tandur-fpo',
          organizationName: 'Tangipalli Rythu Seva Samithi (FPO)',
          accessType: 'PUBLIC_RENTAL' as AssetAccessType,
          memberEligibility: 'ALL_MEMBERS',
          approvalRequired: false,
          status: 'ACTIVE',
          createdAt: new Date('2026-03-01T10:00:00Z'),
        },
        {
          id: 'pol-002',
          assetId: 'ast-004',
          organizationId: 'org-tandur-fpo',
          organizationName: 'Tangipalli Rythu Seva Samithi (FPO)',
          accessType: 'MEMBERS_ONLY' as AssetAccessType,
          memberEligibility: 'FPO_SHAREHOLDER_FARMERS',
          approvalRequired: true,
          status: 'ACTIVE',
          createdAt: new Date('2026-04-01T11:00:00Z'),
        },
      ],
    ],
  ]);

  constructor(private readonly assetService: AssetService) {}

  async createPolicy(dto: CreateAccessPolicyDto): Promise<any> {
    const asset = await this.assetService.getAssetById(dto.assetId);
    const id = `pol-${Date.now()}`;

    const policy = {
      id,
      assetId: dto.assetId,
      assetName: asset.name,
      organizationId: dto.organizationId,
      accessType: dto.accessType || 'PUBLIC_RENTAL',
      memberEligibility: dto.memberEligibility || 'ALL_MEMBERS',
      pricingRuleId: dto.pricingRuleId,
      approvalRequired: dto.approvalRequired ?? false,
      status: 'ACTIVE',
      createdAt: new Date(),
    };

    const list = this.policies.get(dto.organizationId) || [];
    list.push(policy);
    this.policies.set(dto.organizationId, list);

    return policy;
  }

  async getPoliciesForOrganization(organizationId: string): Promise<any[]> {
    return this.policies.get(organizationId) || [];
  }

  async getPoliciesForAsset(assetId: string): Promise<any[]> {
    const all = Array.from(this.policies.values()).flat();
    return all.filter((p) => p.assetId === assetId);
  }
}

