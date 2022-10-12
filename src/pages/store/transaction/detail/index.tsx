import HeaderContentRight from "components/commons/header-content-right";
import PaymentCashierModal from "components/modals/payment";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { paymentService } from "services/payment.service";
import { transactionService } from "services/transaction.service";
import { PaymentCashierModel } from "types/models/payment/payment-cashier.model";
import { PaymentCashierDetailResult } from "types/results/transaction/payment-cashier/payment-cashier-detail.result";
import { TransactionDetailResult } from "types/results/transaction/transaction-detail.result";
import styles from "./index.module.scss";
import NotifyModal from "components/modals/notify";
import { useHistory } from "react-router-dom";
import { CURRENCY_UNITS, LOCALE, OPTION_CURRENCY, ORDER_STATUS, TOP } from "utils/constants";
import Print from "components/commons/print";
import { IssuanceTransactionResult } from "types/results/transaction/issuance-transaction.result";
import { useReactToPrint } from "react-to-print";
import QRCodeModal from "components/modals/qr-code";
import { toast } from "react-toastify";
import { toBrowserTime } from "utils/datetime";
import { PaymentMethod, TransactionStatus } from "utils/enums";
import { settingService } from "services/setting.service";
import { tokenHelper } from "utils/store-token";
import AllCancelConfirmModal from "components/modals/confirm";
import { useLoadingContext } from "context/loading";

interface TransactionDetailParams {
  transactionId: number;
}

const TransactionDetail = () => {
  const params = useParams();
  const { transactionId } = params as TransactionDetailParams;
  const { t } = useTranslation();
  const { showLoading, hideLoading } = useLoadingContext();

  const [btnLeft] = React.useState(true);
  const [btnRight] = React.useState(true);
  const [openPayment, setOpenPayment] = useState(false);
  const [paymentCashierDetail, setPaymentCashierDetail] =
    useState<PaymentCashierDetailResult>();
  const [openNotify, setOpenNotify] = useState(false);
  const [messageNotify, setMessageNotify] = useState<string>("");
  const history = useHistory();
  const componentRef = useRef(null);
  const [detailTransaction, setDetailTransaction] =
    useState<TransactionDetailResult>();
  const [transactionQR, setTransactionQR] =
    useState<IssuanceTransactionResult>();
  const [openModal, setOpenModal] = useState(false);
  const [openNotifyPayment, setOpenNotifyPayment] = useState(false);
  const [isEnableSeat, setIsEnableSeat] = useState<boolean>(false);
  const [messageNotifyPayment, setMessageNotifyPayment] = useState("");
  const [unitPrice, setUnitPrice] = useState<string>();
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [tableName, setTableName] = useState("");

  const openCodeQR = () => {
    if (transactionQR) {
      setOpenModal(true);
      handlePrint();
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getDetailTransaction = async (transactionId: number) => {
    try {
      const result = await transactionService.getTransactionDetail(
        transactionId
      );
      setDetailTransaction(result);

      const transaction = {
        tableName: result?.tableName,
        transactionId: result?.id,
      } as IssuanceTransactionResult;
      setTransactionQR(transaction);
      setTableName(transaction.tableName);
      hideLoading();
    } catch (error) {
      hideLoading();
      toast.error(t("validation.errorMessage"));
    }
  };

  const isHasAllCancelled = async () => {
    try {
      const isHasAllCancelled = await transactionService.IsHasAllCancelled(
        transactionId
      );
      return isHasAllCancelled;
    } catch (err) {}
  };

  const getPaymentCashier = async (transactionId: number) => {
    try {
      const result = await transactionService.getPaymentCashierDetail(
        transactionId
      );
      setPaymentCashierDetail(result);
    } catch (error) {
      toast.error(t("validation.errorMessage"));
    }
  };

  const onOpenPayment = async () => {
    try {
      const isCheck = isInvalidPayment();

      if (!isCheck) {
        getPaymentCashier(transactionId);
        setOpenPayment(true);
      } else {
        if (await isHasAllCancelled()) {
          setConfirmEnd(true);
          return;
        }

        if (
          detailTransaction?.listOrder.some(
            (x) => x.status == ORDER_STATUS.Cart
          )
        ) {
          setMessageNotifyPayment(
            t("transaction.cashierPayment.confirmNotPayemntWhenCart")
          );
        } else {
          setMessageNotifyPayment(
            t("transaction.cashierPayment.confirmNotPayemnt")
          );
        }
        setOpenNotifyPayment(true);
      }
    } catch (error) {}
  };

  const handleEventPayment = () => {
    setConfirmEnd(false);
    const payment = {
      transactionId: transactionId,
      paymentAmount: paymentCashierDetail?.total,
      paymentMethod: PaymentMethod.Cash,
      totalOrder: paymentCashierDetail?.subTotal,
    } as PaymentCashierModel;
    paymentService
      .paymentCashier(payment)
      .then(() => {
        setMessageNotify(
          t("transaction.cashierPayment.contentNotify", {
            name: tableName,
          })
        );
        setOpenNotify(true);
      })
      .catch((error) => {
        toast.error(t("validation.errorMessage"));
      });
  };

  const closeModalNotify = () => {
    history.push(`${TOP}`);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const isInvalidPayment = () => {
    if (
      detailTransaction?.status === TransactionStatus.CompletedPayment ||
      detailTransaction?.listOrder.some(
        (x) =>
          x.status == ORDER_STATUS.Cart || x.status == ORDER_STATUS.UnFinished
      ) ||
      detailTransaction?.listOrder.filter(
        (x) => x.status == ORDER_STATUS.Cancelled
      ).length === detailTransaction?.listOrder.length
    ) {
      return true;
    } else {
      return false;
    }
  };

  const isDisablePayment = () => {
    if (
      detailTransaction?.status === TransactionStatus.CompletedPayment ||
      detailTransaction?.listOrder.length === 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  const getSeat = () => {
    settingService
      .getSeat()
      .then((result) => {
        setIsEnableSeat(result.isEnableSeat);
      })
      .catch((e) => {
        hideLoading();
        toast.error(t("validation.errorMessage"));
      });
  };

  useEffect(() => {
    const getCurrencyUnit = () => {
      const unit = tokenHelper.getPropertyFromStorage(CURRENCY_UNITS);
      setUnitPrice(unit);
    }

    getCurrencyUnit();
  }, [])
  
  useEffect(() => {
    showLoading();
    getSeat();
    getDetailTransaction(transactionId);
  }, [transactionId]);

  return (
    <>
      <div className={styles.content}>
        <HeaderContentRight
          title={t("transaction.detail.title")}
          isBtnLeft={btnLeft}
          onBtnLeft={() =>
            detailTransaction?.tableOrderId
              ? history.push(`/table/${detailTransaction?.tableOrderId}`)
              : {}
          }
          isBtnRight={btnRight}
          onBtnRight={openCodeQR}
          titleBtnRight={t("transaction.detail.titleRight")}
        ></HeaderContentRight>
        <div className={styles.main_transaction}>
          <p className="title_modal break_word">
            {detailTransaction?.tableName}
          </p>
          <p className="text_small">
            {t("transaction.detail.transactionId")}：{t("transactionName")}
            {detailTransaction?.id}
          </p>
          <p className="text_small">
            {t("transaction.detail.timeIn")}：
            {toBrowserTime(
              detailTransaction?.transactionStartDate,
              t("datetimeFormatStringHM")
            )}
          </p>
          {detailTransaction?.transactionEndDate && (
            <p className="text_small">
              {t("transaction.detail.timeOut")}：
              {toBrowserTime(
                detailTransaction?.transactionEndDate,
                t("datetimeFormatStringHM")
              )}
            </p>
          )}
        </div>
        <div className={styles.list_transaction}>
          <p className="text_title">{t("transaction.detail.orderList")}</p>
        </div>
        <div className={styles.table_order}>
          <div className={styles.order_list}>
            {detailTransaction &&
              detailTransaction?.listOrder.length > 0 &&
              detailTransaction?.listOrder.map((item, index) => (
              <div
                className={styles.order_item}
                key={index}
                onClick={() =>
                  item.status === ORDER_STATUS.Cart
                    ? history.push(`/cart/${item.id}`)
                    : {}
                }
              >
                <span className="text_16">
                  {t("transaction.detail.orderId")}：{item.id}
                </span>{" "}
                {item.status !== ORDER_STATUS.Cart ? (
                  <span className={styles.item_right}>
                    {item.status === ORDER_STATUS.Finished
                      ? `${t("transaction.detail.complete")}`
                      : item.status === ORDER_STATUS.UnFinished
                      ? `${t("transaction.detail.inComplete")}`
                      : item.status === ORDER_STATUS.Cancelled
                      ? `${t("transaction.detail.cancel")}`
                      : ""}
                  </span>
                ) : (
                  <></>
                )}
                <br />
                <div className={`${styles.list_product_order} mt_8`}>
                  <span className={styles.left_order}>
                    {item?.listProductOrder &&
                      item?.listProductOrder.map((listProduct, index) => (
                        <div key={index} className={styles.item_left} >
                          {isEnableSeat && (
                            <span className="text_16">
                              {listProduct.seatName}
                            </span>
                          )}
                          <p className="break_word">
                            {listProduct.productName} x {listProduct.quantity}
                          </p>
                          {listProduct.listProductOrderOption &&
                          listProduct.listProductOrderOption.length > 0 ? (
                            <>
                              <p>{t("transaction.detail.optionTitle")}</p>
                              <ul>
                                {" "}
                                {listProduct.listProductOrderOption.map(
                                  (option, index) => (
                                    <li key={index}>
                                      <p>{option.productOptionName}</p>
                                    </li>
                                  )
                                )}
                              </ul>
                            </>
                          ) : null}
                        </div>
                      ))}
                  </span>
                  <div className={styles.right_order}>
                    {Number(item.total).toLocaleString(LOCALE, OPTION_CURRENCY)}
                    {t("unitPrice", {unitPrice: unitPrice})}
                    <span className={styles.tax_price}>
                      {t("transaction.detail.tax")}
                    </span>
                  </div>
                </div>
                </div>
              ))}
          </div>
          <div className={styles.btn_add_order}>
            {detailTransaction?.status !==
              TransactionStatus.CompletedPayment && (
              <button
                className="btn_sub"
                onClick={() =>
                  transactionId !== undefined
                    ? history.push(
                        `/transaction/${transactionId}/order/select-product/`,
                        { prevPage: history.location.pathname }
                      )
                    : {}
                }
              >
                {t("transaction.detail.buttonAddOrder")}
              </button>
            )}
          </div>
        </div>
        <div className={`${styles.btn_accounting}`}>
          <div className={styles.title_total}>
            <span className="text_price">
              {t("transaction.detail.total")}：
              {detailTransaction?.total.toLocaleString(LOCALE, OPTION_CURRENCY)}
              {t("unitPrice", {unitPrice: unitPrice})}
            </span>
            <span className="text_small">{t("transaction.detail.tax")}</span>
          </div>
          <button
            disabled={isDisablePayment()}
            className={"btn_main"}
            onClick={onOpenPayment}
          >
            {t("transaction.detail.buttonAccounting")}
          </button>
        </div>
        {openPayment && <PaymentCashierModal
          open={openPayment}
          paymentCashier={paymentCashierDetail}
          title={t("transaction.cashierPayment.title")}
          textButton={t("transaction.cashierPayment.paymentCompleted")}
          handleEvent={handleEventPayment}
          handleClose={() => setOpenPayment(false)}
          unitPrice={unitPrice}
        ></PaymentCashierModal>}
        {openNotify && <NotifyModal
          open={openNotify}
          title={t("transaction.cashierPayment.titlePaymentCompleted")}
          message={messageNotify}
          textButton={t("close")}
          handleCloseModal={closeModalNotify}
        ></NotifyModal>}
        {openNotifyPayment && <NotifyModal
          open={openNotifyPayment}
          title={""}
          message={messageNotifyPayment}
          textButton={t("close")}
          handleCloseModal={() => setOpenNotifyPayment(false)}
        ></NotifyModal>}
        {openModal && <QRCodeModal
          open={openModal}
          transaction={transactionQR}
          handleCloseModal={() => handleCloseModal()}
        />}
        {transactionQR && 
          <div className="display_none">
            <div ref={componentRef}>
              <Print isQRCodeImage={true} transaction={transactionQR}></Print>
            </div>
          </div>
        }
        {confirmEnd && (
          <AllCancelConfirmModal
            open={confirmEnd}
            title={t("transaction.cashierPayment.confirmEnd.title")}
            subTitle={t("transaction.cashierPayment.confirmEnd.textConfirm")}
            textButton={t("ok")}
            textCancel={t("cancel")}
            handleEvent={handleEventPayment}
            handleCloseModal={() => setConfirmEnd(false)}
          />
        )}
      </div>
    </>
  );
};
export default TransactionDetail;
