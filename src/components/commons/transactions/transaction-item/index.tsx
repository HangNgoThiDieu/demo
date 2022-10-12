import { FC, useState } from "react";
import styles from "./index.module.scss";
import iconClock from "assets/images/icon_clock.svg";
import { TransactionResult } from "types/results/table/transaction.result";
import { useTranslation } from "react-i18next";
import { toBrowserTime } from "utils/datetime";
import { useHistory } from "react-router-dom";
import PaymentCashierModal from "components/modals/payment";
import { PaymentCashierDetailResult } from "types/results/transaction/payment-cashier/payment-cashier-detail.result";
import { transactionService } from "services/transaction.service";
import { PaymentCashierModel } from "types/models/payment/payment-cashier.model";
import { paymentService } from "services/payment.service";
import NotifyModal from "components/modals/notify";
import {
  PaymentMethod,
  TransactionStatus,
  TransactionStatusString,
} from "utils/enums";
import { TOP, TRANSACTION_DETAIL } from "utils/constants";
import AllCancelConfirmModal from "components/modals/confirm-custom";
import { useLoadingContext } from "context/loading";

interface TransactionItemProps {
  transaction: TransactionResult;
  unitPrice?: string;
}

const TransactionItem: FC<TransactionItemProps> = (
  props: TransactionItemProps
) => {
  const { t } = useTranslation();
  const history = useHistory();
  let date = new Date();
  const [openPayment, setOpenPayment] = useState(false);
  const [paymentCashierDetail, setPaymentCashierDetail] =
    useState<PaymentCashierDetailResult>();
  const [openNotify, setOpenNotify] = useState(false);
  const [messageNotify, setMessageNotify] = useState<string>("");
  const [openNotifyPayment, setOpenNotifyPayment] = useState(false);
  const [messageNotifyPayment, setMessageNotifyPayment] = useState("");
  const [confirmEnd, setConfirmEnd] = useState(false);
  const {showLoading, hideLoading} = useLoadingContext();

  const handelAddOrder = (e: any) => {
    e.stopPropagation();
    history.push(`/transaction/${props.transaction.id}/order/select-product`);
  };

  const isInvalidPayment = async () => {
    try {
      const isInvalidPayment = await transactionService.isInValidPayment(
        props.transaction.id
      );
      return isInvalidPayment;
    } catch (err) {}
  };

  const isHasOrderCart = async () => {
    try {
      const isHasOrderCart = await transactionService.isHasOrderCart(
        props.transaction.id
      );
      return isHasOrderCart;
    } catch (err) {}
  };

  const isHasAllCancelled = async () => {
    try {
      const isHasAllCancelled = await transactionService.IsHasAllCancelled(
        props.transaction.id
      );
      return isHasAllCancelled;
    } catch (err) {}
  };

  const getPaymentCashier = async (transactionId: number) => {
    try {
      showLoading();
      const result = await transactionService.getPaymentCashierDetail(
        transactionId
      );
      setPaymentCashierDetail(result);
      hideLoading();
    } catch (error) {
      hideLoading();
    }
  };

  const handlePayment = async (e: any) => {
    e.stopPropagation();
    if (await isHasOrderCart()) {
      setMessageNotifyPayment(
        t("transaction.cashierPayment.confirmNotPayemntWhenCart")
      );
      setOpenNotifyPayment(true);
    } else {
      if (await isInvalidPayment()) {
        setMessageNotifyPayment(
          t("transaction.cashierPayment.confirmNotPayemnt")
        );
        setOpenNotifyPayment(true);
      } else if (await isHasAllCancelled()) {
        setConfirmEnd(true);

        return;
      } else {
        getPaymentCashier(props.transaction.id);
        setOpenPayment(true);
      }
    }
  };

  const handleEventPayment = (e: any) => {
    e.stopPropagation();
    setConfirmEnd(false);
    try {
      showLoading();
      const payment = {
        transactionId: props.transaction.id,
        paymentAmount: paymentCashierDetail?.total,
        paymentMethod: PaymentMethod.Cash,
        totalOrder: paymentCashierDetail?.subTotal,
      } as PaymentCashierModel;
      paymentService.paymentCashier(payment).then(() => {
        hideLoading();
        setMessageNotify(
          t("transaction.cashierPayment.contentNotify", {
            name: paymentCashierDetail?.tableName,
          })
        );
        setOpenNotify(true);
      });
    } catch (error) {
      hideLoading();
    }
  };

  const closeModalNotify = (e: any) => {
    e.stopPropagation();
    history.push(`${TOP}`);
  };

  let labelButton =
    props.transaction.transactionStatus === TransactionStatus.BeforeOrdering
      ? TransactionStatusString.BeforeOrdering
      : props.transaction.transactionStatus === TransactionStatus.Seated
      ? TransactionStatusString.Seated
      : TransactionStatusString.CompletedPayment;
  return (
    <div className={styles.table_detail_item}>
      <div
        onClick={() => {
          history.push(`${TRANSACTION_DETAIL}${props.transaction?.id}`);
        }}
      >
        <div className={styles.table_detail_title}>
          <p className={`text_title`}>
            {t("transactionName")}
            {props.transaction.id}
          </p>
          <div>
            <button
              className={
                props.transaction.transactionStatus ===
                TransactionStatus.BeforeOrdering
                  ? `btn_custom_sub`
                  : props.transaction.transactionStatus ===
                    TransactionStatus.Seated
                  ? `btn_custom_main`
                  : `btn_custom_white`
              }
            >
              {t(labelButton)}
            </button>
          </div>
        </div>
        <div className={styles.div_time}>
          {props.transaction.transactionStatus !=
            TransactionStatus.BeforeOrdering && (
            <div>
              {props.transaction.timeIn && (
                <div className={styles.group_time}>
                  <img src={iconClock} alt="iconClock" />
                  <label className={`${styles.label_time} text_small`}>
                    {t("table.timeIn") +
                      " : " +
                      toBrowserTime(
                        props.transaction.timeIn,
                        t("datetimeFormatStringHM")
                      )}
                  </label>
                </div>
              )}
              {props.transaction.timeOut && (
                <div className={styles.group_time}>
                  <img src={iconClock} alt="iconClock" />
                  <label className={`${styles.label_time} text_small`}>
                    {t("table.timeOut") +
                      " : " +
                      toBrowserTime(
                        props.transaction.timeOut,
                        t("datetimeFormatStringHM")
                      )}
                  </label>
                </div>
              )}
            </div>
          )}
          {props.transaction.transactionStatus ===
            TransactionStatus.BeforeOrdering && (
            <div>
              {props.transaction.realeaseDate && (
                <div className={styles.group_time}>
                  <img src={iconClock} alt="iconClock" />
                  <label className={`${styles.label_time} text_small`}>
                    {t("table.realeaseDate") +
                      " : " +
                      toBrowserTime(
                        props.transaction.realeaseDate,
                        t("datetimeFormatStringHM")
                      )}
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {props.transaction.transactionStatus !==
        TransactionStatus.CompletedPayment && (
        <div className={styles.group_button}>
          <button
            className={`btn_white mr_4 ${
              props.transaction.transactionStatus ===
                TransactionStatus.BeforeOrdering && styles.btn_add
            }`}
            onClick={(e) => handelAddOrder(e)}
          >
            {t("table.addOrder")}
          </button>
          {props.transaction.transactionStatus === TransactionStatus.Seated && (
            <button
              onClick={(e) => handlePayment(e)}
              className={`btn_main ml_4`}
            >
              {t("table.payment")}
            </button>
          )}
        </div>
      )}
      {openPayment && (
        <PaymentCashierModal
          open={openPayment}
          paymentCashier={paymentCashierDetail}
          title={t("transaction.cashierPayment.title")}
          textButton={t("transaction.cashierPayment.paymentCompleted")}
          handleEvent={(e) => handleEventPayment(e)}
          handleClose={() => setOpenPayment(false)}
          unitPrice={props.unitPrice}
        ></PaymentCashierModal>
      )}
      {openNotify && (
        <NotifyModal
          open={openNotify}
          title={t("transaction.cashierPayment.titlePaymentCompleted")}
          message={messageNotify}
          textButton={t("close")}
          handleCloseModal={(e) => closeModalNotify(e)}
        ></NotifyModal>
      )}
      {openNotifyPayment && (
        <NotifyModal
          open={openNotifyPayment}
          title={""}
          message={messageNotifyPayment}
          textButton={t("close")}
          handleCloseModal={() => setOpenNotifyPayment(false)}
        ></NotifyModal>
      )}

      {confirmEnd && (
        <AllCancelConfirmModal
          open={confirmEnd}
          title={t("transaction.cashierPayment.confirmEnd.title")}
          subTitle={t("transaction.cashierPayment.confirmEnd.textConfirm")}
          textButton={t("ok")}
          textCancel={t("cancel")}
          handleEvent={(e) => handleEventPayment(e)}
          handleCloseModal={() => setConfirmEnd(false)}
        />
      )}
    </div>
  );
};

export default TransactionItem;
