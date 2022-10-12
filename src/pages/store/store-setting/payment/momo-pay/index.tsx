import { MoMoPaymentModel } from "types/models/store-setting/payment/payment-setting.model";
import { PAYMENT_GATEWAY } from "utils";
import styles from "../index.module.scss";

export default ({
  register,
  paymentGatewayKeys,
  t,
  moMoPayment,
  errors,
  formatInput,
}: {
  register: any;
  paymentGatewayKeys: number[];
  t: any;
  moMoPayment: MoMoPaymentModel;
  errors: any;
  formatInput: (event: any) => any;
}) => {
  return (
    <div>
      <div className="form-group">
        <label>Partner Code<span className="required_text">(*)</span></label>
        <input
          {...register("moMoPayment.partnerCode", {
            required: {
              value: paymentGatewayKeys.some((k) => k == PAYMENT_GATEWAY.MoMo),
              message: t("validation.required", {
                field: "Partner Code",
              }),
            },
            maxLength: {
              value: 16,
              message: t("validation.maxLength", {
                max: 16,
                field: "Partner Code",
              }),
            },
          })}
          className={styles.input_text}
          placeholder="Partner Code"
          defaultValue={moMoPayment?.partnerCode}
          onBlur={formatInput}
        />
        {errors.moMoPayment?.partnerCode &&
          ["required", "maxLength"].includes(
            errors.moMoPayment?.partnerCode.type
          ) && (
            <span className="validation_message">
              {errors.moMoPayment?.partnerCode.message}
            </span>
          )}
      </div>
      <div className="form-group mt_4">
        <label>Access Key<span className="required_text">(*)</span></label>
        <input
          {...register("moMoPayment.accessKey", {
            required: {
              value: paymentGatewayKeys.some((k) => k == PAYMENT_GATEWAY.MoMo),
              message: t("validation.required", {
                field: "Access Key",
              }),
            },
            maxLength: {
              value: 16,
              message: t("validation.maxLength", {
                max: 16,
                field: "Access Key",
              }),
            },
          })}
          className={styles.input_text}
          placeholder="Access Key"
          defaultValue={moMoPayment?.accessKey}
          onBlur={formatInput}
        />
        {errors.moMoPayment?.accessKey &&
          ["required", "maxLength"].includes(
            errors.moMoPayment?.accessKey.type
          ) && (
            <span className="validation_message">
              {errors.moMoPayment?.accessKey.message}
            </span>
          )}
      </div>
      <div className="form-group mt_4">
        <label>Secret Key<span className="required_text">(*)</span></label>
        <input
          {...register("moMoPayment.secretKey", {
            required: {
              value: paymentGatewayKeys.some((k) => k == PAYMENT_GATEWAY.MoMo),
              message: t("validation.required", {
                field: "Secret Key",
              }),
            },
            maxLength: {
              value: 32,
              message: t("validation.maxLength", {
                max: 32,
                field: "Secret Key",
              }),
            },
          })}
          className={styles.input_text}
          placeholder="Secret Key"
          defaultValue={moMoPayment?.secretKey}
          onBlur={formatInput}
        />
        {errors.moMoPayment?.secretKey &&
          ["required", "maxLength"].includes(
            errors.moMoPayment?.secretKey.type
          ) && (
            <span className="validation_message">
              {errors.moMoPayment?.secretKey.message}
            </span>
          )}
      </div>
      <div className="form-group mt_4">
        <label>Public Key</label>
        <input
          {...register("moMoPayment.publicKey", {
            maxLength: {
              value: 1000,
              message: t("validation.maxLength", {
                max: 1000,
                field: "Public Key",
              }),
            },
          })}
          className={styles.input_text}
          placeholder="Public Key"
          defaultValue={moMoPayment?.publicKey}
          onBlur={formatInput}
        />
        {errors.moMoPayment?.publicKey && (
          <span className="validation_message">
            {errors.moMoPayment?.publicKey?.message}
          </span>
        )}
      </div>
    </div>
  );
};
