import { Injectable, NotFoundException } from '@nestjs/common';

export type PayoutDestinationType = 'BANK_ACCOUNT' | 'UPI' | 'OTHER_SUPPORTED_METHOD';
export type PayoutDestinationStatus = 'ACTIVE' | 'INACTIVE' | 'VERIFIED';

export interface PayoutDestination {
  id: string;
  userId: string;
  type: PayoutDestinationType;
  provider: string;
  externalReference?: string | null;
  maskedIdentifier: string;
  accountHolderName: string;
  status: PayoutDestinationStatus;
  createdAt: Date;
}

@Injectable()
export class PayoutDestinationService {
  private destinations = new Map<string, PayoutDestination>([
    [
      'dest-suresh-01',
      {
        id: 'dest-suresh-01',
        userId: 'to-suresh-002',
        type: 'UPI',
        provider: 'NPCI_UPI',
        maskedIdentifier: 'sur•••@oksbi',
        accountHolderName: 'Suresh Rao',
        status: 'VERIFIED',
        createdAt: new Date(),
      },
    ],
    [
      'dest-suresh-02',
      {
        id: 'dest-suresh-02',
        userId: 'to-suresh-002',
        type: 'BANK_ACCOUNT',
        provider: 'SBI_DIRECT',
        maskedIdentifier: '••••4829',
        accountHolderName: 'Suresh Rao',
        status: 'VERIFIED',
        createdAt: new Date(),
      },
    ],
    [
      'dest-mallesh-01',
      {
        id: 'dest-mallesh-01',
        userId: 'wkr-mallesh-001',
        type: 'UPI',
        provider: 'NPCI_UPI',
        maskedIdentifier: 'mal•••@apl',
        accountHolderName: 'Kuruva Mallesh',
        status: 'VERIFIED',
        createdAt: new Date(),
      },
    ],
  ]);

  async createDestination(params: {
    userId: string;
    type: PayoutDestinationType;
    accountHolderName: string;
    identifier: string;
    provider?: string;
  }): Promise<PayoutDestination> {
    let masked = params.identifier;
    if (params.type === 'BANK_ACCOUNT') {
      masked = '••••' + params.identifier.slice(-4);
    } else if (params.type === 'UPI') {
      const parts = params.identifier.split('@');
      masked = parts[0].slice(0, 3) + '•••@' + (parts[1] || 'upi');
    }

    const dest: PayoutDestination = {
      id: `dest-${Date.now()}`,
      userId: params.userId,
      type: params.type,
      provider: params.provider || (params.type === 'UPI' ? 'NPCI_UPI' : 'SBI_DIRECT'),
      accountHolderName: params.accountHolderName,
      maskedIdentifier: masked,
      status: 'VERIFIED',
      createdAt: new Date(),
    };

    this.destinations.set(dest.id, dest);
    return dest;
  }

  async getDestinations(userId: string): Promise<PayoutDestination[]> {
    const list: PayoutDestination[] = [];
    for (const d of this.destinations.values()) {
      if (d.userId === userId && d.status !== 'INACTIVE') {
        list.push(d);
      }
    }
    return list;
  }

  async deleteDestination(id: string, userId: string): Promise<PayoutDestination> {
    const dest = this.destinations.get(id);
    if (!dest) throw new NotFoundException('Destination not found');
    dest.status = 'INACTIVE';
    return dest;
  }

  async getDestinationById(id: string): Promise<PayoutDestination | undefined> {
    return this.destinations.get(id);
  }
}
