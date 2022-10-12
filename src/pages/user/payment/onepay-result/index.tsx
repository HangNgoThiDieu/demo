import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { paymentService } from "services/payment.service";
import { LANGUAGE_USER, ONE_PAY_RESPONSE_CODE } from "utils";
import { OnePayResponseCode } from "utils/enums";
import styles from "./index.module.scss";
import Icon_Failed from "assets/images/icon_failed.svg";
import Icon_Done from "assets/images/icon_done.svg";
import { PaymentByOnePayModel } from "types/models/payment/payment-onepay.model";
import { tokenHelper } from "utils/store-token";

const OnePayResult = () => {
  const { t } = useTranslation();

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  const paramString = window.location.search;
  const transactionId: number = Number(query.get("transId")!);
  const companyId: number = Number(query.get("comId")!);
  const amount: number = Number(query.get("vpc_Amount"));
  const txnResponseCode = query.get("vpc_TxnResponseCode");

  const [responseStatus, setResponseStatus] = useState<number>(-1);

  const onepayResult = async () => {
    try {
      const result = await paymentService.onePayResult(
        companyId,
        transactionId,
        paramString
      );
      setResponseStatus(result);
    } catch (err: any) {
      if (err.errorCode == OnePayResponseCode.InvalidSignature) {
        setResponseStatus(ONE_PAY_RESPONSE_CODE.InvalidSignature);
      } else {
        setResponseStatus(ONE_PAY_RESPONSE_CODE.Failed);
      }
    }
  };

  const paymentByOnepay = async () => {
    try {
      const lang = tokenHelper.getLanguageFromStorage(LANGUAGE_USER);
      const paymentByOnePayModel = {
        transactionId: transactionId,
        currencyUnit: "VND",
        language: lang ? (lang == "vi" ? "vn" : lang) : "en",
      } as PaymentByOnePayModel;

      const payUrl = await paymentService.paymentByOnePay(paymentByOnePayModel);
      window.location.replace(payUrl);
    } catch (error) {}
  };

  useEffect(() => {
    if (txnResponseCode?.trim() == "99") {
      window.location.href = `/user/trans?transId=${transactionId}&comId=${companyId}`;
      return;
    }
    onepayResult();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.infor}>
        {responseStatus == ONE_PAY_RESPONSE_CODE.Success && (
          <>
            <div className="mb_20">
              <img src={Icon_Done} />
              <p className={`${styles.text_title} title_modal`}>
                {t("user.payment.onePay.titleSuccess")}
              </p>
              <p>
                {t("user.payment.onePay.thanks")}
                <br></br>
                {t("user.payment.onePay.succeeded")}
              </p>
              <p className={`${styles.text_infor}`}>
                {t("user.payment.onePay.totalAmount")}
                {(amount / 100).toLocaleString()} VND {t("tax")}
              </p>
              <div className={styles.line}></div>
              <p className={`${styles.text_infor}`}>
                {t("user.payment.onePay.paymentDate")}
                {moment(new Date()).format(t("datetimeFormatStringHM"))}
              </p>
              <div className={styles.line}></div>
              <p className={`${styles.text_infor}`}>
                {t("user.payment.onePay.paymentMethod")}
              </p>
            </div>
            <button
              className={`btn_main ${styles.btn_return}`}
              onClick={() =>
                (window.location.href = `/user/trans?transId=${transactionId}&comId=${companyId}`)
              }
            >
              {t("close")}
            </button>
          </>
        )}

        {responseStatus !== ONE_PAY_RESPONSE_CODE.Success &&
          responseStatus !== -1 &&
          txnResponseCode !== "99" && (
            <>
              <div className="mb_36">
                <img src={Icon_Failed} />
                <p className={`${styles.text_title} title_modal`}>
                  {t("user.payment.onePay.titleFailed")}
                </p>
                <p>
                  {t("user.payment.onePay.failed")}
                  <br></br>
                  {t("user.payment.onePay.paymentAgain")}
                </p>
              </div>
              <button
                className={`btn_main ${styles.btn_return}`}
                onClick={() => paymentByOnepay()}
              >
                {t("user.payment.onePay.tryAgain")}
              </button>
            </>
          )}
      </div>
    </div>
  );
};

export default OnePayResult;
