import { ProductOrderPaymentResult } from "../product-order/product-order-payment.result";

export interface OrderPaymentResult {
    id: number;
    total: number;
    listProductOrder: ProductOrderPaymentResult[];
}