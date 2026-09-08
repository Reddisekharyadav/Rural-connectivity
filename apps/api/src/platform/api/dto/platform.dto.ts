/**
 * External DTOs for Platform API v1
 * Guarantees zero Prisma internal model leakage
 */

export interface ExternalFarmDto {
  id: string;
  name: string;
  totalAcres: number;
  soilType: string;
  primaryCrop?: string;
  location: {
    village: string;
    mandal: string;
    district: string;
  };
}

export interface ExternalJobDto {
  id: string;
  title: string;
  skillCategory: string;
  requiredWorkers: number;
  dailyWage: number;
  startDate: string;
  status: string;
  location: {
    village: string;
    mandal: string;
    district: string;
  };
}

export interface ExternalAssetDto {
  id: string;
  code: string;
  name: string;
  category: string;
  modelNumber?: string;
  condition: string;
  status: string;
  location: {
    village: string;
    mandal: string;
    district: string;
  };
}

export interface ExternalOrderDto {
  id: string;
  orderNumber: string;
  totalAmount: number;
  currency: string;
  status: string;
  fulfillmentMethod: string;
  itemCount: number;
  createdAt: string;
}

export interface ExternalProduceDto {
  id: string;
  code: string;
  cropName: string;
  variety?: string;
  quantity: number;
  unit: string;
  qualityGrade?: string;
  askingPrice?: number;
  status: string;
  location: {
    village: string;
    mandal: string;
    district: string;
  };
}

export interface ExternalTransportDto {
  id: string;
  code: string;
  cargoType: string;
  weightTons: number;
  status: string;
  distanceKm: number;
  pickupDate: string;
}

export interface ExternalAnalyticsDto {
  mandal: string;
  activeFarms: number;
  activeJobs: number;
  activeMachinery: number;
  totalTransactionVolumeInr: number;
  generatedAt: string;
}
