export interface PaymentDetailResult {
  transactionId: number;
  transactionStartDate: Date;
  tableName: string;
  tableOrderId: number;
  total: number;
  listSeatOrder: SeatOrderResult[];
  isEnablePayment: boolean;
  totalProductOrder: number;
  isEnableSeat: boolean;
}

export interface SeatOrderResult {
  seatId: number;
  seatName: string;
  totalPrice: number;
  listSeatProductOrder: SeatProductOrderResult[];
  quantityOfProductOrder: number;
}

export interface SeatProductOrderResult {
  productOrderId: number;
  productName: string;
  quantity: number;
  paymentPrice: number;
  listProductOrderOption: SeatOrderOptionResult[];
}

export interface SeatOrderOptionResult {
  productOrderOptionId: number;
  productOptionName: string;
}