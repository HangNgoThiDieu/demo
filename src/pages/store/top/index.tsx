import GroupsButtonBottom from "components/commons/group-button-bottom";
import HeaderContent from "components/commons/header-content";
import NoData from "components/commons/no-data";
import NotificationDetailModal from "components/modals/detail-notification";
import { useAuth } from "context/auth";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { notificationService } from "services/notification.service";
import { NotificationListResult } from "types/results/notification/notification-list.result";
import { NotificationDetailItem } from "types/results/notification/notification.result";
import { toBrowserTime } from "utils/datetime";
import { Role } from "utils/enums";
import styles from "./index.module.scss";

const Top = () => {
  const history = useHistory();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [listNotification, setListNotification] = useState<
    NotificationListResult[]
  >([]);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [notificationDetailItem, setNotificationDetailItem] = 
  useState<NotificationDetailItem>({} as NotificationDetailItem);
  const [heightBtn, setHeightBtn] = useState(0);
  const elementRef = useRef(null as any);

  const getListNotification = async () => {
    try {
      const result = await notificationService.getNotificationList();
      setListNotification(result);
    } catch (error) {
      toast.error(t("validation.errorMessage"));
    }
  };

  const handleOpenShowDetail = (notificationId: number) => {
    const item = listNotification.filter(x => x.notificationId == notificationId)[0];
    setNotificationDetailItem(item);
    setIsShowDetail(true);
  }

  const handleCloseDetailModal = () => {
    setNotificationDetailItem({ startDate: undefined, title: "", content: ""});
    setIsShowDetail(false);
  }

  useEffect(() => {
    const getHeight = () => {
      if (elementRef && elementRef.current && elementRef.current.clientHeight) {
        setHeightBtn(elementRef?.current?.clientHeight + 1);
      }
    };

    getHeight();
  }, []);

  useEffect(() => {
    getListNotification();
  }, []);

  return (
    <>
      <div className="container">
        <HeaderContent title={t("top.header")} titleStyle={styles.title_style}/>
        <div
          className={`${styles.notifications} ${
            listNotification && listNotification.length > 0 ? "pl_12" : ""
          }`}
        >
          <ul
            className="pl_0_rem mb_0"
          >
            {listNotification && listNotification.length > 0 ? (
              listNotification?.map((item, index) => (
                <li key={index} onClick={() => handleOpenShowDetail(item.notificationId)} className={styles.notification_item}>
                  <p className={styles.title}>{moment(item.startDate).format(t("dateFormatStringSlash"))}{"\u00a0\u00a0\u00a0"}
                  {item.title}
                  </p>
                </li>
              ))
            ) : (
              <li className={`${styles.notification_item}`}>
                <p>{t('top.noNotification')}</p>
              </li>
            )}
          </ul>
        </div>
        <div className={styles.group_buttons}>
          {user?.role == Role.StoreManager && (
            <div className={styles.group_buttons}>
              <button
                onClick={() => history.push("/account")}
                className={`btn_sub mb_16 ${styles.button_top}`}
              >
                {t("accountManagement")}
              </button>
              <button
                onClick={() => history.push("/revenue-analysis")}
                className={`btn_sub mb_16 ${styles.button_top}`}
              >
                {t("analysisManagement")}
              </button>
            </div>
          )}
          <button
            onClick={() => history.push("/products")}
            className={`btn_sub mb_16 ${styles.button_top}`}
          >
            {t("productManagement")}
          </button>
        </div>
      </div>
      <div style={{ height: heightBtn }}></div>
      <GroupsButtonBottom
        elementRef={elementRef}
        textButtonLeft={t("top.buttonLeft")}
        textButtonRight={t("top.buttonRight")}
        handleButtonLeft={() => history.push("/order")}
        handleButtonRight={() => history.push("/table")}
      />
      <NotificationDetailModal
        open={isShowDetail}
        title={notificationDetailItem.title}
        date={toBrowserTime(notificationDetailItem.startDate, t("dateFormatStringSlash"))}
        content={notificationDetailItem.content}
        handleCloseModal={() => handleCloseDetailModal()}
        textButton={t("close")}
       />
    </>
  );
};

export default Top;
