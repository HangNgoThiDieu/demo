import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-responsive-modal";
import { TransactionInfoResult } from "types/results/transaction/transaction-info.result";
import {
  LOCALE,
  OPTION_CURRENCY,
  TRANSACTION_STATUS,
} from "utils";
import { toBrowserTime } from "utils/datetime";
import styles from "./index.module.scss";

interface TransactionInfoProps {
  open: boolean;
  title: string;
  handleClose: () => void;
  data: TransactionInfoResult;
  unitPrice?: string;
}

const TransactionInfo: React.FC<TransactionInfoProps> = (
  props: TransactionInfoProps
) => {
  const { t } = useTranslation();

  return (
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
      <div className="">
        <div className="text-center">
          <label className="title_modal">{props.title}</label>
        </div>
        <div className={styles.info}>
          <p className="text_16">
            <span className="text_16">{t("user.top.modal.tableName")}: </span>
            {props.data.tableName}
          </p>
          <p className="text_16">
            <span className="text_16">
              {t("user.top.modal.transactionID")}:{" "}
            </span>
            {t("transactionName")}
            {props.data.transactionId}
          </p>
          <p className="text_16">
            <span className="text_16">{t("user.top.modal.startDate")}: </span>
            {toBrowserTime(
              props.data.transactionStartDate,
              t("datetimeFormatStringHM")
            )}
          </p>
          <p className="text_16">
            <span className="text_16">{t("user.top.modal.endDate")}: </span>
            {toBrowserTime(
              props.data.transactionEndDate,
              t("datetimeFormatStringHM")
            )}
          </p>
          <p className="text_16">
            <span className="text_16">
              {t("user.top.modal.totalPayment")}:{" "}
            </span>
            {props.data.totalPayment?.toLocaleString(LOCALE, OPTION_CURRENCY)}
            {t("unitPrice", {unitPrice: props.unitPrice})}
            <span>{t("tax")}</span>
          </p>
        </div>
        <div className={styles.button_group}>
          <p className="text_title">
            <span className="text_title">{t("user.top.modal.status")}: </span>
            {props.data.transactionStatus == TRANSACTION_STATUS.Completed &&
              t("user.top.modal.complete")}
          </p>
          <div className="mt_20">
            <button className={`btn_white`} onClick={() => props.handleClose()}>
              {t("close")}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionInfo;
