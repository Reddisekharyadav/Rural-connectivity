export interface RentalCreatedV1 {
  rentalBookingId: string;
  assetId: string;
  ownerId: string;
  renterId: string;
  rentalMode: 'EQUIPMENT_ONLY' | 'EQUIPMENT_WITH_OPERATOR' | 'EQUIPMENT_WITH_OPERATOR_TRANSPORT';
  startDate: string;
  endDate: string;
  dailyRate: number;
  securityDeposit: number;
  totalAmount: number;
}

export interface RentalHandedOverV1 {
  rentalBookingId: string;
  assetId: string;
  meterReadingStart: number;
  condition: string;
  handedOverAt: string;
}

export interface RentalReturnedV1 {
  rentalBookingId: string;
  assetId: string;
  meterReadingEnd: number;
  hoursUsed: number;
  condition: string;
  returnedAt: string;
  depositRefunded: number;
}
