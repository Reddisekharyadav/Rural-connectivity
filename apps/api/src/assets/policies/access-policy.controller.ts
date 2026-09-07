import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AssetAccessPolicyService, CreateAccessPolicyDto } from './access-policy.service';

@Controller('asset-access-policies')
export class AssetAccessPolicyController {
  constructor(private readonly policyService: AssetAccessPolicyService) {}

  @Post()
  async createPolicy(@Body() dto: CreateAccessPolicyDto) {
    return this.policyService.createPolicy(dto);
  }

  @Get('organization/:orgId')
  async getPoliciesForOrganization(@Param('orgId') orgId: string) {
    return this.policyService.getPoliciesForOrganization(orgId);
  }

  @Get('asset/:assetId')
  async getPoliciesForAsset(@Param('assetId') assetId: string) {
    return this.policyService.getPoliciesForAsset(assetId);
  }
}

