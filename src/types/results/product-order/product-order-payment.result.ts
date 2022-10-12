import { ProductOrderOptionPaymentResult } from "../product-order-option/product-order-option-payment.result";

export interface ProductOrderPaymentResult {
    productName: string;
    quantity: number;
    couponCurrency: number;
    couponDiscount: number;
    listProductOption: ProductOrderOptionPaymentResult[];
}