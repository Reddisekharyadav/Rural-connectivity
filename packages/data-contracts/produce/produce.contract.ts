export interface ProduceListedV1 {
  listingId: string;
  sellerId: string;
  cropName: string;
  variety?: string;
  quantityQuintals: number;
  askingPricePerQuintal?: number;
  qualityGrade?: string;
  location: {
    village: string;
    mandal: string;
    district: string;
  };
  listedAt: string;
}

export interface ProduceSoldV1 {
  orderId: string;
  listingId: string;
  sellerId: string;
  buyerId: string;
  quantityQuintals: number;
  agreedPricePerQuintal: number;
  totalAmount: number;
  soldAt: string;
}
