export interface ProductDemotResult {
    id: number;
    categoryId: number;
    productName: string;
    price: number;
    paymentPrice: number;
    imageLink: string;
    description: string;
    isDiscounted: boolean;
}