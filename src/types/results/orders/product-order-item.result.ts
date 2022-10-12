import { ProductOrderOptionResult } from "./product-order-option.result";

export interface ProductOrderItemResult {
    productImage: string;
    productName: string;
    productPrice: number;
    productPaymentPrice: number;
    productQuantity: number;
    productCategoryName: string;
    productDescription: string;
    productOrderId: number;
    seatName: string;
    productId: number;
    listProductOption: ProductOrderOptionResult[];
}