export interface ProductOrderForCart {
    orderId?: number;
    transactionId: number;
    productId: number;
    quantity: number;
    price: number;
    paymentPrice: number;
    listProductOrderOptionId: number[];
    listProductOption: ProductOptionGroupCheck[];
    seatId?: number;
}

export interface ProductOptionGroupCheck {
    isChecked?: boolean;
}

export interface ProductOptionGroup {
    id: number;
    groupId: number;
    optionAmount: number;
}

