import { CategoryResult } from "../master-data/category.result";

export interface ProductSelectResult {
  tableName: string;
  transactionId: string;
  timeIn: Date;
  categoryList: CategoryResult[];
  categorySelect: string;
  categryNumber: boolean;
  productList: ProductSelectItemResult[];
  countProductOrder: number;
  totalMoneyCart: number;
}

export interface ProductSelectItemResult {
  id: number;
  name: string;
  description: string;
  price: number;
  paymentPrice: number;
  image: string;
  isSoldOut: boolean;
  categoryId: number;
  isDiscount: boolean;
}
