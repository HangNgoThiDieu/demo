interface ProductOrder {
    productName: string;
    quantity: number;
    listProductOrderOption: ProductOrderOption[];
    seatName: string;
}

interface Order {
    id: number;
    total: string;
    status: number;
    listProductOrder: ProductOrder[]
}


export interface TransactionDetailResult {
    id: number;
    transactionStartDate: Date;
    transactionEndDate: Date;
    status: number;
    tableName: string;
    listOrder: Order[];
    total: number;
    product: string;
    productName: string;
    quantity: number;
    tableOrderId: number;
}

interface ProductOrderOption {
    productOptionName: string;
}