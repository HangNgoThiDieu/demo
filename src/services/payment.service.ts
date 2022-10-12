import Config from "config";
import { PaymentCashierModel } from "types/models/payment/payment-cashier.model";
import { PaymentByOnePayModel } from "types/models/payment/payment-onepay.model";
import { PaymentDetailResult } from "types/results/payment/payment-detail.result";
import api from "utils/api";

const paymentCashier = async (model: PaymentCashierModel) => {
  return await api.post<void>(Config.API_URL.PAYMENT_CASHIER, model);
};

const getPaymentDetail = async (transactionId: number) => {
  return await api.get<PaymentDetailResult>(Config.API_URL.GET_PAYMENT_DETAIL(transactionId), {});
}

const getPaymentGateways = async (companyId: number) => {
  return await api.get<number[]>(Config.API_URL.GET_PAYMENT_GATEWAYS(companyId), {});
}

const paymentMoMo = async (companyId: number, transactionId: number) => {
  return await api.get<string>(Config.API_URL.PAYMENT_MOMO(companyId,transactionId), {});
}

const paymentByOnePay = async (model: PaymentByOnePayModel) => {
  return await api.post<string>(Config.API_URL.PAYMENT_BY_ONEPAY, model);
}

const onePayResult = async (companyId: number, transactionId: number, query: string) => {
  return await api.get<number>(Config.API_URL.ONE_PAY_RETURN(companyId, transactionId, query), {});
}

export const paymentService = {
  paymentCashier,
  getPaymentDetail,
  getPaymentGateways,
  paymentMoMo,
  paymentByOnePay,
  onePayResult
};
