import { Injectable, NotFoundException } from '@nestjs/common';

export interface CertificationDto {
  name: string;
  issuingOrganization: string;
  certificateNumber?: string;
  issuedDate?: string;
  expiryDate?: string;
  documentReference?: string;
}

@Injectable()
export class WorkforceCertificationService {
  private certifications = new Map<string, any[]>([
    [
      'wp-laxman-004',
      [
        {
          id: 'cert-laxman-01',
          workerId: 'wp-laxman-004',
          name: 'Certified Agricultural Power Sprayer Operator & Chemical Safety',
          issuingOrganization: 'Telangana State Agricultural Extension & PJTSAU',
          certificateNumber: 'PJTSAU-EXT-2024-8891',
          issuedDate: '2024-04-10',
          expiryDate: '2027-04-09',
          verificationStatus: 'VERIFIED',
          documentReference: 'DOC-VERIFIED-HASH-99214',
          createdAt: '2024-04-10T09:00:00Z',
        },
        {
          id: 'cert-laxman-02',
          workerId: 'wp-laxman-004',
          name: 'Precision Harvester Equipment Operation Certificate',
          issuingOrganization: 'National Skill Development Corporation (NSDC Agri Sector)',
          certificateNumber: 'NSDC-AGR-2023-4412',
          issuedDate: '2023-08-15',
          expiryDate: '2028-08-14',
          verificationStatus: 'VERIFIED',
          documentReference: 'DOC-VERIFIED-HASH-33201',
          createdAt: '2023-08-15T11:30:00Z',
        },
      ],
    ],
  ]);

  async getCertifications(workerId: string) {
    return this.certifications.get(workerId) || [];
  }

  async addCertification(workerId: string, dto: CertificationDto) {
    const current = this.certifications.get(workerId) || [];
    const newCert = {
      id: `cert-${Date.now().toString(36)}`,
      workerId,
      name: dto.name,
      issuingOrganization: dto.issuingOrganization,
      certificateNumber: dto.certificateNumber || `CERT-${Date.now().toString().slice(-6)}`,
      issuedDate: dto.issuedDate || new Date().toISOString().split('T')[0],
      expiryDate: dto.expiryDate || null,
      verificationStatus: 'VERIFIED',
      documentReference: dto.documentReference || `DOC-REF-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    };

    current.push(newCert);
    this.certifications.set(workerId, current);
    return newCert;
  }

  async verifyCertification(workerId: string, certId: string, status: 'VERIFIED' | 'REJECTED' | 'EXPIRED') {
    const current = this.certifications.get(workerId) || [];
    const cert = current.find((c) => c.id === certId);
    if (!cert) {
      throw new NotFoundException(`Certification ${certId} not found`);
    }
    cert.verificationStatus = status;
    cert.updatedAt = new Date().toISOString();
    return cert;
  }
}

