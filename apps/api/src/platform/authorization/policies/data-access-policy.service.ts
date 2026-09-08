import { Injectable, Logger } from '@nestjs/common';

export type DataClassification = 'PUBLIC' | 'INTERNAL' | 'SENSITIVE' | 'HIGHLY_SENSITIVE';

@Injectable()
export class DataAccessPolicyService {
  private readonly logger = new Logger(DataAccessPolicyService.name);

  /**
   * Evaluates if a given actor/role can perform an action on a classified resource.
   */
  async canAccessResource(data: {
    resource: string;
    action: string;
    classification: DataClassification;
    actorId?: string;
    organizationId?: string;
    isOwner?: boolean;
    hasConsent?: boolean;
  }): Promise<{ allowed: boolean; reason?: string }> {
    // 1. PUBLIC data is accessible to all
    if (data.classification === 'PUBLIC') {
      return { allowed: true };
    }

    // 2. Direct resource owner always has access
    if (data.isOwner) {
      return { allowed: true };
    }

    // 3. Consented third-party data sharing
    if (data.hasConsent) {
      return { allowed: true };
    }

    // 4. HIGHLY_SENSITIVE data strictly forbidden without ownership or explicit consent
    if (data.classification === 'HIGHLY_SENSITIVE') {
      return {
        allowed: false,
        reason: 'HIGHLY_SENSITIVE resource requires explicit user consent or primary ownership.',
      };
    }

    // 5. SENSITIVE data requires organization scope or consent
    if (data.classification === 'SENSITIVE') {
      if (data.organizationId) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: 'SENSITIVE data access requires active organization membership or consent.',
      };
    }

    return { allowed: true };
  }
}
