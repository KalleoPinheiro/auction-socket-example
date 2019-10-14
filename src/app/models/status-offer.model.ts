export interface StatusOffer {
  highestAuctionBet: {
    documentNumber: string;
    customerName: string;
    redemptionEndDate: string;
    bidPoints: number;
    pointsReserved: boolean;
  };
  customerAuctionBet: {
    documentNumber: string;
    customerName: string;
    redemptionEndDate: string;
    bidPoints: number;
    pointsReserved: boolean;
  };
  auctionEndDate: Date | string;
}
