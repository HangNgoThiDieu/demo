import { ProductOptionResult } from "./product-option.result";

export interface ProductOptionGroupResult {
    id: number;
    name: string;
    optionType: number;
    isRequired: boolean;
    listProductOption: ProductOptionResult[];
}