import { OPTION_TYPE } from "utils/constants";
import { OptionItemModel } from "./option-item.model";

export class OptionGroupsModel {
    optionGroupName: string = '';
    isRequired: boolean = true;
    optionType: number = OPTION_TYPE.PickOne;
    optionItemList: OptionItemModel[] = [{ optionName: '', optionAmount: undefined as never}];
};