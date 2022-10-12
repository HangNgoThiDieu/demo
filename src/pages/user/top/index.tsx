import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";
import IconRight from "assets/images/icon_right.svg";
import { useHistory, useLocation } from "react-router-dom";
import { transactionService } from "services/transaction.service";
import { TransactionInfoResult } from "types/results/transaction/transaction-info.result";
import { Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { toBrowserTime } from "utils/datetime";
import { notificationService } from "services/notification.service";
import { NotificationUserResult } from "types/results/notification/user/notification-user.result";
import NoData from "components/commons/no-data";
import TransactionInfo from "components/modals/transaction-info";
import { useUserContext } from "layouts/user";
import { tokenHelper } from "utils/store-token";
import { CURRENCY_UNITS, TRANSACTION_INFO } from "utils";
import { useLoadingContext } from "context/loading";

const TOP = () => {
  const info = tokenHelper.getPropertyFromStorage(TRANSACTION_INFO);

  const { t } = useTranslation();
  const [transInfo, setTransInfo] = useState<TransactionInfoResult>({} as TransactionInfoResult);
  const [showMessage, setShowMessage] = useState(false);
  const [messageError, setMessageError] = useState<string>();
  const history = useHistory();
  const [isExpired, setIsExpired] = useState(false);
  const [notifications, setNotifications] = useState<NotificationUserResult[]>(
    []
  );
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { isOrderHistory } = useUserContext();
  const [unitPrice, setUnitPrice] = useState<string>();
  const { showLoading, hideLoading } = useLoadingContext();

  useEffect(() => {
    showLoading();
    isOrderHistory(false);
    const getTransactionInfo = async () => {
      try {
        const rs = await transactionService.getTransactionInfo(
          info.trans,
          info.com
        );
        setTransInfo(rs);
        if (rs.transactionEndDate) {
          setIsExpired(true);
          setIsOpenModal(true);
          setShowMessage(true);
          setMessageError(
            t("user.top.transaction.errors.expriedTransaction")
          );
        }
        hideLoading();
      } catch (err: any) {
        hideLoading();
        toast.error(t("user.top.transaction.errors.errorMessage"));
      }
    };

    const getNotificationsUserOnTop = async () => {
      try {
        const notifications =
          await notificationService.getNotificationsUserOnTop(info.com);
        setNotifications(notifications);
      } catch (err) { }
    };

    const getCurrencyUnit = () => {
      const unit = tokenHelper.getPropertyFromStorage(CURRENCY_UNITS);
      setUnitPrice(unit);
    }

    getCurrencyUnit();
    getTransactionInfo();
    getNotificationsUserOnTop();
  }, [info.trans]);

  return (
    <div className={styles.top_user}>
      <div className={styles.background}>
        <div className={styles.table_infor}>
          {showMessage && (
            <Alert
              variant="danger"
              onClose={() => setShowMessage(false)}
              dismissible
            >
              <p>{messageError}</p>
            </Alert>
          )}
          <p className="title_modal">{transInfo?.tableName}</p>
          <p className="text_small">
            {transInfo?.transactionId &&
              t("user.top.transaction.transactionId") +
              ": " +
              t("transactionName") +
              transInfo?.transactionId}
          </p>
          <p className="text_small">
            {transInfo?.transactionStartDate &&
              t("user.top.transaction.startDate") +
              ": " +
              toBrowserTime(
                transInfo?.transactionStartDate,
                t("datetimeFormatStringHM")
              )}
          </p>
          <p className="text_small">
            {transInfo?.transactionEndDate &&
              t("user.top.transaction.endDate") +
              ": " +
              toBrowserTime(
                transInfo?.transactionEndDate,
                t("datetimeFormatStringHM")
              )}
          </p>
        </div>
        <div className={styles.notifications}>
          {notifications &&
            notifications.length > 0 ?
            (notifications.map((item, index) => {
              return (
                <div key={index}>
                  <div className={styles.element_notification}
                    onClick={() => history.push(`/user/notification/${item.notificationId}`)}>
                    <span
                      className={`${item.label.length > 10
                          ? styles.text_notification_child
                          : ""
                        } accent_text`}
                    >
                      【{item.label}
                    </span><span className="accent_text">】</span>
                    <span className={styles.right_noti}>
                      <span className={styles.text_notification_child}>
                        {item.title}
                      </span>
                      <img className="img-fluid ml_12" src={IconRight} alt="" />
                    </span>
                  </div>
                  <div className={styles.line}></div>
                </div>
              );
            }))
            : (
              <></>
            )
          }
        </div>
        <div className={`${styles.group_buttons} mt_36`}>
          <button
            disabled={isExpired}
            className={`btn_sub mb_16 ${styles.btn_top}`}
            onClick={() => !isExpired && history.push("/user/order-history")}
          >
            {t("user.top.button.orderHistory")}
          </button>
          <button
            disabled={isExpired}
            className={`btn_sub mb_16 ${styles.btn_top}`}
            onClick={() => !isExpired && history.push("/user/payment")}
          >
            {t("user.top.button.payment")}
          </button>
        </div>
        <div className={styles.form_button}>
          <button className={`btn_main ${styles.btn_top}`} disabled={isExpired}
            onClick={() => !isExpired && history.push(`/user/transaction/${info.trans.toString()}/order/select-product`)}>
            {t("user.top.button.order")}
          </button>
        </div>

        {isExpired && <TransactionInfo
          open={isOpenModal}
          title={t("user.top.modal.title")}
          handleClose={() => setIsOpenModal(false)}
          data={transInfo}
          unitPrice={unitPrice}
        />}
      </div>
    </div>
  );
};

export default TOP;
