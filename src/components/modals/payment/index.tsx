import { useTranslation } from "react-i18next";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import styles from "./index.module.scss";
import iconTime from "assets/images/icon_time.svg";
import { PaymentCashierDetailResult } from "types/results/transaction/payment-cashier/payment-cashier-detail.result";
import { toBrowserTime } from "utils/datetime";
import { LOCALE, OPTION_CURRENCY } from "utils/constants";

interface PaymentProps {
  open: boolean;
  title: string;
  textButton: string;
  paymentCashier?: PaymentCashierDetailResult;
  handleEvent: (e?: any) => void;
  handleClose: () => void;
  unitPrice?: string;
}

const PaymentCashierModal: React.FC<PaymentProps> = (props: PaymentProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Modal
        open={props.open}
        onClose={() => {}}
        center
        showCloseIcon={false}
        classNames={{
          overlay: styles.custom_overlay,
          modal: styles.custom_modal,
        }}
      >
        <div className={styles.payment_cashier}>
          <div className="text-center">
            <label className="title_modal">{props.title}</label>
          </div>
          <div className="mt_24 mb_32">
            <p className="text_title">{props.paymentCashier?.tableName}</p>
            <p>
              {t("transaction.cashierPayment.transactionID")}:{" "}
              {t("transactionName")}
              {props.paymentCashier?.transactionId}
            </p>
            <div>
              <img className="mr_4" src={iconTime} alt="iconTime"></img>
              <span className="text_small">
                {props.paymentCashier?.transactionStartDate &&
                  t("transaction.cashierPayment.timeIn") +
                    " : " +
                    toBrowserTime(
                      props.paymentCashier.transactionStartDate,
                      t("datetimeFormatStringHM")
                    )}
              </span>
            </div>
          </div>
          {props.paymentCashier?.listOrder &&
            props.paymentCashier.listOrder.map((item, index) => (
              <div key={index}>
                {index != 0 && <div className={styles.line_sub}></div>}
                <div className="mt_16">
                  <div className={styles.order}>
                    <span className="text_title">
                      {t("transaction.cashierPayment.orderId")}：{item.id}
                    </span>
                    <div>
                      <span className={styles.total_order}>
                        {item.total.toLocaleString(LOCALE, OPTION_CURRENCY)}
                        {t("unitPrice", {unitPrice: props.unitPrice})}
                      </span>
                      <span className="text_small">
                        （{t("transaction.cashierPayment.taxInclude")}）
                      </span>
                    </div>
                  </div>
                  {item.listProductOrder &&
                    item.listProductOrder.length > 0 &&
                    item.listProductOrder.map((itemProduct, productIndex) => (
                      <span key={productIndex}>
                        <p className={styles.product}>
                          {itemProduct.productName} x {itemProduct.quantity}
                        </p>
                        {itemProduct.listProductOption.length > 0 && (
                          <p>{t("transaction.cashierPayment.option")}</p>
                        )}
                        <ul className={styles.option}>
                          {itemProduct.listProductOption.length > 0 &&
                            itemProduct.listProductOption.map(
                              (itemOption, optionIndex) => (
                                <li key={optionIndex}>
                                  <p>
                                    {itemOption.name}
                                  </p>
                                </li>
                              )
                            )}
                        </ul>
                      </span>
                    ))}
                </div>
              </div>
            ))}
          <div className={`${styles.line} mt_12`}></div>
          <div className="mt_11">
            <span className="mr_8">
              {t("transaction.cashierPayment.subTotal")}
            </span>
            <span className={styles.total}>
              {props.paymentCashier?.subTotal.toLocaleString(LOCALE, OPTION_CURRENCY)}
              {t("unitPrice", {unitPrice: props.unitPrice})}
            </span>
            <span className="text_small">
              （{t("transaction.cashierPayment.taxInclude")}）
            </span>
          </div>
        </div>
        <div className={styles.group_bottom}>
          <span className={styles.total}>
            {t("transaction.cashierPayment.total")}：
            {props.paymentCashier?.total.toLocaleString(LOCALE, OPTION_CURRENCY)}
            {t("unitPrice", {unitPrice: props.unitPrice})}
          </span>
          <span className="text_small">
            （{t("transaction.cashierPayment.taxInclude")}）
          </span>
          <div className="mt_16">
            <button className="btn_main" onClick={props.handleEvent}>
              {props.textButton}
            </button>
            <button className="btn_white mt_16" onClick={props.handleClose}>
              {t("transaction.cashierPayment.buttonCancel")}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default PaymentCashierModal;
