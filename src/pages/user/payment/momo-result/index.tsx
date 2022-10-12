import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Icon_Success from "assets/images/img_success.png";
import Icon_Failed from "assets/images/icon_failed.svg";
import moment from "moment";
import { MOMO_ERROR } from "utils/constants";
const MoMoResult = (props: any) => {
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  let query = useQuery();
  let transactionId: number = Number(query.get("transId")!);
  let companyId: number = Number(query.get("comId")!);
  let amount: number = Number(query.get("amount")!);

  const { t } = useTranslation();
  const [issSucceeded, setIsSucceeded] = useState<boolean>(
    query.get("message") === "Successful." ? true : false
  );
  const [resultCode, setResultCode] = useState<string | null>(
    query.get("resultCode")
  );
  const [urlTop, setUrlTop] = useState<string>(
    `/user/trans?transId=${transactionId}&comId=${companyId}`
  );

  useEffect(() => {
    if (resultCode === MOMO_ERROR.CancelPayment) {
      window.location.href = "/user/payment";
    }
  }, []);
  const [date, setDate] = useState<Date>(new Date());
  return (
    <>
      {resultCode != MOMO_ERROR.CancelPayment && (
        <div className={styles.wrapper}>
          <div className={styles.infor}>
            {issSucceeded ? (
              <div>
                <p className={`${styles.text_title} title_modal`}>
                  {t("user.payment.momo.titleSuccess")}
                </p>
                <p>
                  {t("user.payment.momo.thanks")}
                  <br></br>
                  {t("user.payment.momo.succeeded")}
                </p>
                <p className={`${styles.text_infor}`}>
                  {t("user.payment.momo.totalAmount")}
                  {amount.toLocaleString()} VND {t("tax")}
                </p>
                <div className={styles.line}></div>
                <p className={`${styles.text_infor}`}>
                  {t("user.payment.momo.paymentDate")}
                  {moment(new Date()).format(t("datetimeFormatStringHM"))}
                </p>
                <div className={styles.line}></div>
                <p className={`${styles.text_infor}`}>
                  {t("user.payment.momo.paymentMethod")}
                </p>
              </div>
            ) : (
              <div className="mb_36">
                <img src={Icon_Failed} alt="fail" />
                <p className={`${styles.text_title} title_modal`}>
                  {t("user.payment.momo.titleFailed")}
                </p>
                <p>
                  {t("user.payment.momo.failed")}
                  <br></br>
                  {t("user.payment.momo.paymentAgain")}
                </p>
              </div>
            )}
            <button
              className={`btn_main ${styles.btn_return}`}
              onClick={() => (window.location.href = urlTop)}
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default MoMoResult;
