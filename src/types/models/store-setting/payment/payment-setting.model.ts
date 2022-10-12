export interface PaymentStoreSettingModel {
  isEnablePayment: boolean;
  paymentGateways: number[];
  onePayPayment: OnePayPaymentModel;
  moMoPayment: MoMoPaymentModel;
}

export interface OnePayPaymentModel {
  paymentURL: string;
  merchantId: string;
  accessCode: string;
  secureHash: string;
}

export interface MoMoPaymentModel {
  partnerCode: string;
  accessKey: string;
  secretKey: string;
  publicKey: string;
}