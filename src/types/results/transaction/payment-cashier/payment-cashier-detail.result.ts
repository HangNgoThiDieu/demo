import { OrderPaymentResult } from "types/results/orders/order-payment.result";

export interface PaymentCashierDetailResult {
    tableName: string;
    transactionId: number;
    transactionStartDate: Date;
    transactionEndDate: Date;
    subTotal: number;
    listOrder: OrderPaymentResult[];
    total: number;
}