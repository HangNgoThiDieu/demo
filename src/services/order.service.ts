import { OrderProductDetailResult } from "types/results/orders/order-product-detail.result";
import { OrderItemResult } from "types/results/orders/order-items.result";
import Config from "../config";
import { CartResult } from "../types/results/orders/cart.result";
import api from "../utils/api";
import { ProductOrderForCart } from "types/models/order/product-order-for-cart.model";
import { PagedResult } from "types/paged-result";
import { SeatItemResult } from "types/results/orders/seat-items.result";
import { SettingSeatResult } from "types/results/setting/setting-seat.result";

const getCart = async (orderId: number) => {
	return await api.get<CartResult>(Config.API_URL.GET_CART(orderId), {});
}

const getProductOrderDetail = async (productId: number) => {
    return await api.get<OrderProductDetailResult>(Config.API_URL.ORDER_PRODUCT_DETAIL(productId), {});
}

const getOrderList = async (orderStatus: number, page: number, pageSize: number) => {
    return await api.post<PagedResult<OrderItemResult>>(Config.API_URL.GET_ORDER_LIST, {orderStatus, page, pageSize});
}

const changeStatusOrder = async (orderId: number, orderStatus: number, isNotify: boolean = false) => {
    return await api.post<boolean>(Config.API_URL.CHANGE_STATUS_ORDER, {orderId, orderStatus, isNotify});
}

const resetCart = async (orderId: number, transactionId: number) => {
    return await api.post(Config.API_URL.RESET_CART, {orderId, transactionId});
}

const changeAmountProductOrder = async (orderId: number, productOrderId: number, quantity: number) => {
    return await api.post<boolean>(Config.API_URL.CHANGE_AMOUNT_PRODUCT_ORDER, {orderId, productOrderId, quantity});
}

const addProductToCart = async (model: ProductOrderForCart) => {
    return await api.post<number>(Config.API_URL.ADD_PRODUCT_TO_CART, model);
}

const getSeatList = async (transactionId: number) => {
    return await api.get<SeatItemResult[]>(Config.API_URL.GET_SEAT_LIST(transactionId), {});
}

const deleteOrder = async (orderId: number) => {
    return await api.delete(Config.API_URL.DELETE_ORDER(orderId));
}

const checkMultipleSelection = async (productId: number, transactionId: number) => {
    return await api.get<number>(Config.API_URL.CHECK_MULTIPLE_SELECTION(productId, transactionId));
}
//user
const userGetCart = async (orderId: number) => {
	return await api.get<CartResult>(Config.API_URL.USER_GET_CART(orderId), {});
}

const userChangeStatusOrder = async (orderId: number, orderStatus: number, isNotify: boolean = false, companyId : number) => {
    return await api.post<boolean>(Config.API_URL.USER_CHANGE_STATUS_ORDER(companyId), {orderId, orderStatus, isNotify});
}

const userResetCart = async (orderId: number, transactionId: number) => {
    return await api.post(Config.API_URL.USER_RESET_CART, {orderId, transactionId});
}

const userChangeAmountProductOrder = async (orderId: number, productOrderId: number, quantity: number) => {
    return await api.post<boolean>(Config.API_URL.USER_CHANGE_AMOUNT_PRODUCT_ORDER, {orderId, productOrderId, quantity});
}

const userDeleteOrder = async (orderId: number) => {
    return await api.delete(Config.API_URL.USER_DELETE_ORDER(orderId));
}

const getProductOrderDetailUser = async (productId: number) => {
    return await api.get<OrderProductDetailResult>(Config.API_URL.ORDER_PRODUCT_DETAIL_USER(productId), {});
}

const addProductToCartUser = async (model: ProductOrderForCart, companyId: number) => {
    return await api.post<number>(Config.API_URL.ADD_PRODUCT_TO_CART_USER(companyId), model);
}

const getSeatListUser = async (transactionId: number) => {
    return await api.get<SeatItemResult[]>(Config.API_URL.GET_SEAT_LIST_USER(transactionId), {});
}

const getSeatUser = async (companyId: number) => {
    return await api.get<SettingSeatResult>(Config.API_URL.GET_SEAT_USER(companyId));
}

const checkMultipleSelectionUser = async (productId: number, transactionId: number) => {
    return await api.get<number>(Config.API_URL.CHECK_MULTIPLE_SELECTION_USER(productId, transactionId));
}

export const orderService = {
    getCart,
    getProductOrderDetail,
    getOrderList,
    changeStatusOrder,
    resetCart,
    changeAmountProductOrder,
    addProductToCart,
    getSeatList,
    deleteOrder,
    checkMultipleSelection,
    //user
    userGetCart,
    userChangeStatusOrder,
    userResetCart,
    userChangeAmountProductOrder,
    userDeleteOrder,
    getProductOrderDetailUser,
    getSeatListUser,
    addProductToCartUser,
    getSeatUser,
    checkMultipleSelectionUser
}