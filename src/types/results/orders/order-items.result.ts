export interface OrderItemResult {
    orderId: number;
    tableName: string;
    orderDate: Date;
    orderStatus: number,
    productOrderList: ProductOrderItem[];
}

interface ProductOrderItem {
    productOrderId: number;
    productName: string;
    quantity: number;
    categoryName: string;
    productOrderOptions: ProductOrderOptions[];
}

interface ProductOrderOptions {
    productOptionId: number;
    productOptionName: string;
    productOptionAmount: number;
}