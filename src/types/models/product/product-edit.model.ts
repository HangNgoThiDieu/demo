import { ImageType } from "react-images-uploading";
import { ProductOptionGroupModel } from "./edit/product-option-group.model";

export interface ProductEditModel {
	id: number;
	categoryId:number;
	categoryName: string;
	productName:string;
	isNotMultipleSelection: boolean;
	isSoldOut:boolean;
	isMenuPublic: boolean;
	isDiscounted:boolean;
	price:number;
	discount?:number;
	discountPercent?: number;
  discountCurrency?: number;
	couponType?:number;
	mainImage?: ImageType[];
	subImage?: ImageType[];
	mainImageOld?: string;
	subImageOld?: string[];
	mainFile?: File[];
	subFiles?: File[];
	imageDeleteList?: string[];
	description?: string;
	listProductOptionGroup: ProductOptionGroupModel[];
}