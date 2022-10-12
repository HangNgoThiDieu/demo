import { useTranslation } from "react-i18next";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { LOCALE, OPTION_CURRENCY } from "utils";
import styles from "./index.module.scss";

interface CashPaymentProps {
  open: boolean;
  title?: string;
  message: string;
  moreMessage?: string;
  textButton: string;
  data: any;
  handleCloseModal: (e?: any) => void;
  unitPrice?: string;
}

const CashPaymentModal: React.FC<CashPaymentProps> = (
  props: CashPaymentProps
) => {
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
        <div className="text-center">
          {props.title && <label className="title_modal">{props.title}</label>}
          <p>{props.message}</p>
          {props.moreMessage && <p>{props.moreMessage}</p>}
        </div>
        <div className={styles.content}>
          <p>
            {t("user.paymentDetail.modal.tableName")}: {props.data.tableName}
          </p>
          <p>
            {t("user.paymentDetail.modal.transactionID")}
            {" : "}
            {t("transactionName")}
            {props.data.transactionId}
          </p>
          <p>
            {t("user.paymentDetail.modal.timeIn")}
            {" : "}
            {props.data.timeIn}
          </p>
          <p>
            {t("user.paymentDetail.modal.timeOut")}
            {" : "}
            {props.data.timeOut}
          </p>
          <p>
            {t("user.paymentDetail.modal.quantityProduct")}
            {" : "}
            {props.data.quantity}
            {props.data.quantity > 1
              ? t("user.paymentDetail.modal.products")
              : t("user.paymentDetail.modal.product")}
          </p>
          <div className={styles.total}>
            <p className="text_title">
              {t("user.paymentDetail.modal.totalPrice")}
              {" : "}
              {props.data.totalPrice?.toLocaleString(LOCALE, OPTION_CURRENCY)}
              {t("unitPrice", {unitPrice: props.unitPrice})}
              <span>{t("tax")}</span>
            </p>
          </div>
        </div>
        <div className={styles.button_group}>
          <div className="mt_16">
            <button className="btn_white" onClick={props.handleCloseModal}>
              {props.textButton}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default CashPaymentModal;
