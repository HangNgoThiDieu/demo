import { ImageType } from "react-images-uploading";
import { OptionGroupsModel } from "./add/option-groups.model";

export interface ProductAddModel {
  categoryId: number;
  categoryName: string;
  productName: string;
  isNotMultipleSelection: boolean;
  isSoldOut: boolean;
  isMenuPublic: boolean;
  isDiscounted: boolean;
  price: number;
  discountValue?: number;
  discountPercent?: number;
  discountCurrency?: number;
  couponType?: number;
  mainImage?: ImageType[];
  subImage?: ImageType[];
  mainFile?: File[];
  subFiles?: File[];
  description?: string;
  optionGroupItemList: OptionGroupsModel[];
};
