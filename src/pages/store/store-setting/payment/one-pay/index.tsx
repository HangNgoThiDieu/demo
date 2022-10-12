import { OnePayPaymentModel } from "types/models/store-setting/payment/payment-setting.model";
import { PAYMENT_GATEWAY } from "utils";
import styles from "../index.module.scss";

export default ({
  register,
  paymentGatewayKeys,
  t,
  onePayPayment,
  errors,
  formatInput,
}: {
  register: any;
  paymentGatewayKeys: number[];
  t: any;
  onePayPayment: OnePayPaymentModel;
  errors: any;
  formatInput: (event: any) => any;
}) => {
  return (
    <div>
      <div className="form-group">
        <label>Payment URL<span className="required_text">(*)</span></label>
        <input
          id="paymentUrl"
          {...register("onePayPayment.paymentURL", {
            required: {
              value: paymentGatewayKeys.some(
                (k) => k == PAYMENT_GATEWAY.OnePay
              ),
              message: t("validation.required", {
                field: "Payment URL",
              }),
            },
            maxLength: {
              value: 200,
              message: t("validation.maxLength", {
                max: 200,
                field: "Payment URL",
              }),
            },
          })}
          type="text"
          className={styles.input_text}
          placeholder="Payment URL"
          defaultValue={onePayPayment?.paymentURL}
          onBlur={formatInput}
        />
        {errors.onePayPayment?.paymentURL &&
          ["required", "maxLength"].includes(
            errors.onePayPayment?.paymentURL.type
          ) && (
            <span className="validation_message">
              {errors.onePayPayment?.paymentURL.message}
            </span>
          )}
      </div>
      <div className="form-group mt_4">
        <label>Merchant ID<span className="required_text">(*)</span></label>
        <input
          id="merchantId"
          {...register("onePayPayment.merchantId", {
            required: {
              value: paymentGatewayKeys.some(
                (k) => k == PAYMENT_GATEWAY.OnePay
              ),
              message: t("validation.required", {
                field: "Merchant ID",
              }),
            },
            maxLength: {
              value: 12,
              message: t("validation.maxLength", {
                max: 12,
                field: "Merchant ID",
              }),
            },
          })}
          type="text"
          className={styles.input_text}
          placeholder="Merchant ID"
          defaultValue={onePayPayment?.merchantId}
          onBlur={formatInput}
        />
        {errors.onePayPayment?.merchantId &&
          ["required", "maxLength"].includes(
            errors.onePayPayment?.merchantId.type
          ) && (
            <span className="validation_message">
              {errors.onePayPayment?.merchantId.message}
            </span>
          )}
      </div>
      <div className="form-group mt_4">
        <label>Access Code<span className="required_text">(*)</span></label>
        <input
          id="accessCode"
          {...register("onePayPayment.accessCode", {
            required: {
              value: paymentGatewayKeys.some(
                (k) => k == PAYMENT_GATEWAY.OnePay
              ),
              message: t("validation.required", {
                field: "Access Code",
              }),
            },
            maxLength: {
              value: 8,
              message: t("validation.maxLength", {
                max: 8,
                field: "Access Code",
              }),
            },
          })}
          type="text"
          className={styles.input_text}
          placeholder="Access Code"
          defaultValue={onePayPayment?.accessCode}
          onBlur={formatInput}
        />
        {errors.onePayPayment?.accessCode &&
          ["required", "maxLength"].includes(
            errors.onePayPayment?.accessCode.type
          ) && (
            <span className="validation_message">
              {errors.onePayPayment?.accessCode.message}
            </span>
          )}
      </div>
      <div className="form-group mt_4">
        <label>Hash Key<span className="required_text">(*)</span></label>
        <input
          {...register("onePayPayment.secureHash", {
            required: {
              value: paymentGatewayKeys.some(
                (k) => k == PAYMENT_GATEWAY.OnePay
              ),
              message: t("validation.required", {
                field: "Hash Key",
              }),
            },
            maxLength: {
              value: 64,
              message: t("validation.maxLength", {
                max: 64,
                field: "Hash Key",
              }),
            },
          })}
          type="text"
          className={styles.input_text}
          placeholder="Hash Key"
          defaultValue={onePayPayment?.secureHash}
          onBlur={formatInput}
        />
        {errors.onePayPayment?.secureHash &&
          ["required", "maxLength"].includes(
            errors.onePayPayment?.secureHash.type
          ) && (
            <span className="validation_message">
              {errors.onePayPayment?.secureHash.message}
            </span>
          )}
      </div>
    </div>
  );
};
