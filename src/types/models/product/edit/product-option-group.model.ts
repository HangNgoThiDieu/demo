import { OPTION_TYPE } from "utils/constants";
import { ProductOptionModel } from "./product-option.model";

export class ProductOptionGroupModel {
    id?: number = undefined as never;
    name: string = '';
    isRequired: boolean = true;
    optionType: number = OPTION_TYPE.PickOne;
    listProductOption: ProductOptionModel[] = [{id: undefined as never, name: '', optionAmount: undefined as never}];
};