import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { transactionService } from "services/transaction.service";
import styles from "./index.module.scss";
import { useHistory } from "react-router-dom";
import { CURRENCY_UNITS, LOCALE, OPTION_CURRENCY, ORDER_STATUS, TOP, TRANSACTION_INFO } from "utils/constants";
import { toast } from "react-toastify";
import { toBrowserTime } from "utils/datetime";
import { OrderHistoryResult } from "types/results/transaction/order-history.result";
import HeaderContent from "components/commons/header-content";
import { useUserContext } from "layouts/user";
import NoData from "components/commons/no-data";
import { tokenHelper } from "utils/store-token";
import { useLoadingContext } from "context/loading";

const OrderHistory = (props: any) => {
  const info = tokenHelper.getPropertyFromStorage(TRANSACTION_INFO);
  
  const { t } = useTranslation();
  const {isOrderHistory} = useUserContext();
  const { showLoading, hideLoading } = useLoadingContext();

  const [btnLeft] = React.useState(true);
  const history = useHistory();
  const [orderHistory, setOrderHistory] = useState<OrderHistoryResult>();
  const [unitPrice, setUnitPrice] = useState<string>();

  const getOrderHistory = async (transactionId: number) => {
    try {
      const result = await transactionService.getOrderHistory(transactionId);
      setOrderHistory(result);
      hideLoading();
    } catch (error) {
      hideLoading();
      toast.error(t("validation.errorMessage"));
    }
  };

  useEffect(() => {
    const getCurrencyUnit = () => {
      const unit = tokenHelper.getPropertyFromStorage(CURRENCY_UNITS);
      setUnitPrice(unit);
    }

    getCurrencyUnit();
    showLoading();
    isOrderHistory(undefined);
    getOrderHistory(info.trans);
  }, [info.trans]);

  return (
    <>
      <div className={styles.content}>
        <HeaderContent
          title={t("user.orderHistory.title")}
          isBtnLeft={btnLeft}
          onBtnLeft={() => history.goBack()}
        ></HeaderContent>
        <div className={styles.main_transaction}>
          <p className="title_modal">{orderHistory?.tableName}</p>
          <p className="text_small">
            {t("user.orderHistory.transactionId")}：{t("transactionName")}
            {orderHistory?.id}
          </p>
          <p className="text_small">
            {t("user.orderHistory.timeIn")}：
            {toBrowserTime(
              orderHistory?.transactionStartDate,
              t("datetimeFormatStringHM")
            )}
          </p>
          {orderHistory?.transactionEndDate && (
            <p className="text_small">
              {t("user.orderHistory.timeOut")}：
              {toBrowserTime(
                orderHistory?.transactionEndDate,
                t("datetimeFormatStringHM")
              )}
            </p>
          )}
        </div>
        {(orderHistory?.listSeatOrder && orderHistory?.listSeatOrder.length > 0) ? (orderHistory?.listSeatOrder.map((seatOrder, index) => (
          <div className={styles.list_order_history}>
            <div className={styles.seat_name}>
              {
                orderHistory.isEnableSeat &&
                <p className="text_title">{seatOrder.id != 0 ? seatOrder.seatName : t("user.orderHistory.seatUndefined")}</p>
              }
            </div>
            {seatOrder.listSeatProductOrder.map((seatProductOrder, index) => (
              <div className={styles.seat_item}>
                {seatProductOrder.status !== ORDER_STATUS.Cart ? (
                  <div className={styles.status_item}>
                    <div className={styles.item_right}>
                      {seatProductOrder.status === ORDER_STATUS.Finished
                        ? <div className={styles.status_complete}>{t("user.orderHistory.complete")}</div>
                        : seatProductOrder.status === ORDER_STATUS.UnFinished
                        ? <div className={styles.status_in_complete}>{t("user.orderHistory.inComplete")}</div>
                        : seatProductOrder.status === ORDER_STATUS.Cancelled
                        ? <div className={`label_status_cancel`}>{t("user.orderHistory.cancel")}</div>
                        : ""}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                <div className={styles.seat_item_content}>
                  <div key={index} className={styles.item_left}>
                    <span>
                    <p className="break_word">
                      {seatProductOrder.productName} x{" "}
                      {seatProductOrder.quantity}
                    </p>
                    {seatProductOrder.listProductOrderOption &&
                    seatProductOrder.listProductOrderOption.length > 0 ? (
                      <>
                        <p>{t("user.orderHistory.optionTitle")}</p>
                        <ul>
                          {" "}
                          {seatProductOrder.listProductOrderOption &&
                            seatProductOrder.listProductOrderOption.map(
                              (option, index) => (
                                <li key={index}>
                                  <p>{option.productOptionName}</p>
                                </li>
                              )
                            )}
                        </ul>
                      </>
                    ) : null}
                    </span>
                  </div>
                  <div>
                    <span className={styles.right_order}>
                      {Number(seatProductOrder.paymentPrice).toLocaleString(
                        LOCALE,
                        OPTION_CURRENCY
                      )}
                      {t("unitPrice", {unitPrice: unitPrice})}
                      <span className={styles.tax_price}>
                        {t("tax")}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))) : (
        <div className="mt_24"><NoData /></div>)}
      </div>
    </>
  );
};
export default OrderHistory;
