import { Injectable, Logger } from '@nestjs/common';

export type DataConsentPurpose =
  | 'FARM_DATA_SHARING'
  | 'FINANCIAL_DATA_SHARING'
  | 'MARKET_DATA_SHARING'
  | 'RESEARCH_DATA_SHARING'
  | 'LOGISTICS_SHARING'
  | 'CREDIT_ASSESSMENT'
  | 'CUSTOM';

export type ConsentStatus = 'PENDING' | 'GRANTED' | 'REVOKED' | 'EXPIRED';

export interface DataConsent {
  id: string;
  userId: string;
  organizationId?: string | null;
  purpose: DataConsentPurpose;
  scope: string[];
  status: ConsentStatus;
  grantedAt: Date;
  revokedAt?: Date | null;
  expiresAt?: Date | null;
  version: number;
}

@Injectable()
export class DataPrivacyService {
  private readonly logger = new Logger(DataPrivacyService.name);
  private consentsStore: Map<string, DataConsent> = new Map();

  constructor() {
    // Seed default consent for research and FPO
    const defaultConsent: DataConsent = {
      id: 'consent-001',
      userId: 'usr-farmer-mallesh',
      organizationId: 'org-tandur-fpo',
      purpose: 'FARM_DATA_SHARING',
      scope: ['farms:location', 'crops:yield'],
      status: 'GRANTED',
      grantedAt: new Date(),
      expiresAt: new Date(Date.now() + 90 * 24 * 3600 * 1000),
      version: 1,
    };
    this.consentsStore.set(defaultConsent.id, defaultConsent);
  }

  async grantConsent(data: {
    userId: string;
    organizationId?: string;
    purpose: DataConsentPurpose;
    scope: string[];
    validDays?: number;
  }): Promise<DataConsent> {
    const expiresAt = new Date(Date.now() + (data.validDays ?? 90) * 24 * 60 * 60 * 1000);

    const consent: DataConsent = {
      id: `consent-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: data.userId,
      organizationId: data.organizationId || null,
      purpose: data.purpose,
      scope: data.scope,
      status: 'GRANTED',
      grantedAt: new Date(),
      expiresAt,
      version: 1,
    };

    this.consentsStore.set(consent.id, consent);
    return consent;
  }

  async revokeConsent(consentId: string): Promise<DataConsent | undefined> {
    const consent = this.consentsStore.get(consentId);
    if (consent) {
      consent.status = 'REVOKED';
      consent.revokedAt = new Date();
    }
    return consent;
  }

  async hasActiveConsent(userId: string, purpose: DataConsentPurpose, organizationId?: string): Promise<boolean> {
    const now = new Date();
    const consent = Array.from(this.consentsStore.values()).find(
      (c) =>
        c.userId === userId &&
        c.purpose === purpose &&
        c.status === 'GRANTED' &&
        (!c.expiresAt || c.expiresAt > now) &&
        (!organizationId || c.organizationId === organizationId),
    );
    return !!consent;
  }

  maskSensitiveFields<T extends Record<string, any>>(
    record: T,
    options: {
      isAuthorized: boolean;
      sensitiveFields?: string[];
      highlySensitiveFields?: string[];
    },
  ): T {
    if (options.isAuthorized) {
      return record;
    }

    const masked: any = { ...record };
    const sens = options.sensitiveFields || ['phone', 'exactLocation', 'acreageDetails', 'landRecordNumber'];
    const highlySens = options.highlySensitiveFields || ['bankAccountNumber', 'ifscCode', 'upiId', 'passwordHash', 'creditScore'];

    for (const field of sens) {
      if (masked[field] !== undefined) {
        if (typeof masked[field] === 'string' && masked[field].length > 4) {
          masked[field] = `••••${masked[field].slice(-4)}`;
        } else {
          masked[field] = '[REDACTED_SENSITIVE]';
        }
      }
    }

    for (const field of highlySens) {
      if (masked[field] !== undefined) {
        masked[field] = '[REDACTED_HIGHLY_SENSITIVE]';
      }
    }

    return masked;
  }
}

