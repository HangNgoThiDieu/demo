import Config from "config";
import { CompanyInfoResult } from "types/results/transaction/company-info.result";
import { IssuanceTransactionResult } from "types/results/transaction/issuance-transaction.result";
import { OrderHistoryResult } from "types/results/transaction/order-history.result";
import { PaymentCashierDetailResult } from "types/results/transaction/payment-cashier/payment-cashier-detail.result";
import { TransactionDetailResult } from "types/results/transaction/transaction-detail.result";
import { TransactionInfoResult } from "types/results/transaction/transaction-info.result";
import api from "utils/api";

const getTransactionDetail = async (transactionId: number) => {
  return await api.get<TransactionDetailResult>(
    Config.API_URL.TRANSACTION_DETAIL(transactionId),
    {}
  );
};

const issuanceTransaction = async (tableId: number) => {
  return await api.get<IssuanceTransactionResult>(
    Config.API_URL.ISSUANCE_TRANSACTION(tableId),
    {}
  );
};

const getPaymentCashierDetail = async (transactionId: number) => {
  return await api.get<PaymentCashierDetailResult>(
    Config.API_URL.PAYMENT_CASHIER_DETAIL(transactionId),
    {}
  );
};

const isInValidPayment = async (transactionId: number) => {
  return await api.get<boolean>(Config.API_URL.IS_INVALID_PAYMENT, {transactionId: transactionId})
}

const getTransactionInfo = async (transactionId: number, companyId: number) => {
  return await api.get<TransactionInfoResult>(Config.API_URL.GET_TRANSACTION_INFO, {transactionId: transactionId, companyId: companyId});
}

const isHasOrderCart = async (transactionId: number) => {
  return await api.get<boolean>(Config.API_URL.IS_HAS_ORDER_CART, {transactionId: transactionId})
}

const IsHasAllCancelled = async (transactionId: number) => {
  return await api.get<boolean>(Config.API_URL.IS_HAS_ALL_CANCELLED, {transactionId: transactionId})
}

const getCompanyInfoByTransaction = async (transactionId: number, companyId: number) => {
  return await api.get<CompanyInfoResult>(Config.API_URL.GET_COMANY_INFO_BY_TRANSACTION, {transactionId: transactionId, companyId: companyId})
}

const getOrderHistory = async (transactionId: number) => {
  return await api.get<OrderHistoryResult>(
    Config.API_URL.GET_ORDER_HISTORY(transactionId),
    {}
  );
};
export const transactionService = {
  getTransactionDetail,
  issuanceTransaction,
  getPaymentCashierDetail,
  isInValidPayment,
  getTransactionInfo,
  isHasOrderCart,
  getCompanyInfoByTransaction,
  getOrderHistory,
  IsHasAllCancelled
};
