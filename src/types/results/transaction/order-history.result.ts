
export interface OrderHistoryResult {
  id: number;
  transactionStartDate: Date;
  transactionEndDate: Date;
  status: number;
  tableName: string;
  tableOrderId: number;
  listSeatOrder: SeatOrderResult[];
  total: number;
  isEnableSeat: boolean;
}

interface SeatOrderResult {
  id: number;
  seatName: string;
  listSeatProductOrder: SeatProductOrderResult[];
}

interface SeatProductOrderResult {
  productName: string;
  quantity: number;
  status: number;
  paymentPrice: number;
  listProductOrderOption: SeatOrderOptionResult[];
}

interface SeatOrderOptionResult {
  productOptionName: string;
}