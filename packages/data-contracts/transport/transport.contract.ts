export interface TransportCreatedV1 {
  transportRequestId: string;
  senderId: string;
  goodsType: string;
  weightTons: number;
  origin: {
    village: string;
    mandal: string;
    district: string;
  };
  destination: {
    village: string;
    mandal: string;
    district: string;
  };
  distanceKm: number;
  requestedPickupDate: string;
}

export interface TransportStartedV1 {
  transportBookingId: string;
  vehicleId: string;
  driverId: string;
  startedAt: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

export interface TransportDeliveredV1 {
  transportBookingId: string;
  deliveredAt: string;
  receiverSignatureUrl?: string;
  finalWeightTons?: number;
}

