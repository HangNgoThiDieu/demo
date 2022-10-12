import { ProductOptionGroupResult } from "./edit/product-option-group.result";

export interface ProductDetailResult {
    id?: number;
    categoryName: string;
    categoryId: number;
    productName: string;
    productImage: string;
    productSubImages: string[];
    price: number;
    isNotMultipleSelection: boolean;
    isSoldOut: boolean;
    isMenuPublic: boolean;
    isDiscounted: boolean;
    discount: number;
    discountType: number;
    description: string;
    listProductOptionGroup: ProductOptionGroupResult[];
}

