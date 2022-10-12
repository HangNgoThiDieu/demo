import Config from "config";
import { ProductAddModel } from "types/models/product/product-add.model";
import { ProductEditModel } from "types/models/product/product-edit.model";
import { ProductDetailResult } from "types/results/product/product-detail.result";
import { ProductInfoResult } from "types/results/product/product-info.result";
import { ProductRankResult } from "types/results/product/product-rank.result";
import { ProductSalesResult } from "types/results/product/product-sales.result";
import { ProductSelectResult } from "types/results/product/product-select.result";
import { ProductResult } from "types/results/product/product.result";
import api from "utils/api";

const getListProduct = async () => {
    return await api.post<ProductResult[]>(Config.API_URL.LIST_PRODUCT, {});
}

const getProductDetail = async (productId: number) => {
    return await api.get<ProductDetailResult>(Config.API_URL.DETAIL_PRODUCT(productId), {});
}

const getProductSelect = async (transactionId: number, orderId: number) => {
    return await api.get<ProductSelectResult>(Config.API_URL.SELECT_PRODUCT(transactionId, orderId), {});
}

const editProduct = async (model: ProductEditModel) => {
    return await api.putForm<boolean>(Config.API_URL.EDIT_PRODUCT, model);
}

const addProduct = async (model: ProductAddModel) => {
    return await api.postFormCustom<boolean>(Config.API_URL.ADD_PRODUCT, model);
}

const deleteProduct = async (productId: number) => {
    return await api.delete(Config.API_URL.DELETE_PRODUCT(productId));
}

const getProductRevenueInfo = async (productId: number) => {
    return await api.get<ProductInfoResult>(Config.API_URL.GET_PRODUCT_REVENUE_INFO(productId), {});
}

const getProductRevenueRanking = async (productId: number) => {
    return await api.get<ProductRankResult>(Config.API_URL.GET_PRODUCT_REVENUE_RANKING(productId), {});
}

const getProductRevenueSales = async (productId: number) => {
    return await api.get<ProductSalesResult>(Config.API_URL.GET_PRODUCT_REVENUE_SALES(productId), {});
}

const isExistedProductName = async (productId: number, productName: string) => {
    return await api.get<boolean>(Config.API_URL.CHECK_EXISTED_PRODUCT_NAME, {productId: productId, productName: productName});
}

const getProductSelectForUser = async (transactionId: number, orderId: number, companyId: number) => {
    return await api.get<ProductSelectResult>(Config.API_URL.USER_SELECT_PRODUCT(transactionId, orderId, companyId), {});
}

export const productService = {
    getProductDetail,
    getListProduct,
    getProductSelect,
    editProduct,
    addProduct,
    deleteProduct,
    getProductRevenueInfo,
    getProductRevenueRanking,
    getProductRevenueSales,
    isExistedProductName,
    getProductSelectForUser
}