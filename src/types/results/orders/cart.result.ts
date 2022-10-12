import { ProductOrderItemResult } from "./product-order-item.result";

export interface CartResult {
    orderId: number;
    tableName: string;
    transactionId: number;
    transactionStartDate: Date;
    totalOrderPrice: number;
    statusOfOrder: number;
    productOrderItems: ProductOrderItemResult[];
    isEnableSeat: boolean
}