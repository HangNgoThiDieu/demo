import { MoMoPaymentModel, OnePayPaymentModel } from "types/models/store-setting/payment/payment-setting.model";

export interface PaymentStoreSettingResult {
  isEnablePayment: boolean,
  paymentGateways: number[],
  onePayPayment: OnePayPaymentModel,
  moMoPayment: MoMoPaymentModel,
}