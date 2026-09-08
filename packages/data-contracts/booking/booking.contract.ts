export interface BookingCreatedV1 {
  bookingId: string;
  requestId: string;
  farmerId: string;
  providerId: string;
  resourceType: 'TRACTOR' | 'WORKER' | 'EQUIPMENT';
  scheduledDate: string;
  scheduledTime?: string;
  acres?: number;
  totalAmount: number;
  location: {
    village: string;
    mandal: string;
    district: string;
  };
}

export interface BookingConfirmedV1 {
  bookingId: string;
  farmerId: string;
  providerId: string;
  confirmedAt: string;
  totalAmount: number;
}

export interface BookingCompletedV1 {
  bookingId: string;
  farmerId: string;
  providerId: string;
  completedAt: string;
  totalAmount: number;
  rating?: number;
}

export interface BookingCancelledV1 {
  bookingId: string;
  farmerId: string;
  providerId: string;
  cancelledBy: string;
  reason: string;
  refundAmount?: number;
}

