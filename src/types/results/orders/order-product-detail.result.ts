interface productOptionGroup {
    id: number;
    name: string;
    optionType: number;
    isRequired: boolean;
    listProductOption: productOption[];
}

interface productOption {
    id: number;
    name: string;
    optionAmount: number;
}

export interface OrderProductDetailResult {
    productId: number;
    productName: string;
    productImage: string;
    productDescription: string;
    productOriginalPrice: number;
    productPaymentPrice: number;
    productQuantity: number;
    productSubImages : string[];
    listProductOptionGroup: productOptionGroup[];
}
