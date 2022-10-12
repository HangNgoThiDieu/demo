import HeaderContent from "components/commons/header-content";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import styles from "./index.module.scss";
import iconDelete from "assets/images/icon_delete.svg";
import iconEdit from "assets/images/icon_edit.svg";
import { notificationService } from "services/notification.service";
import { NotificationUserResult } from "types/results/notification/user/notification-user.result";
import { toast } from "react-toastify";
import NoData from "components/commons/no-data";
import InfiniteScroll from "react-infinite-scroll-component";
import ConfirmModal from "components/modals/confirm";
import NotifyModal from "components/modals/notify";
import { useLoadingContext } from "context/loading";
const PAGE_SIZE = 10;

const NotificationsUserList = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [heightBtn, setHeightBtn] = useState(0);
  const elementRef = useRef(null as any);
  const [notifications, setNotifications] = useState<NotificationUserResult[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [openNotify, setOpenNotify] = useState(false);
  const [notificationId, setNotificationId] = useState<number>(-1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showLoading, hideLoading } = useLoadingContext();

  const getNotificationsUserList = async () => {
    try {
      const result = await notificationService.getNotificationsUserList(1, PAGE_SIZE);
      setNotifications(result.items);
      setHasMoreItems(result.hasMoreRecords);
      setPage(2);
      hideLoading();
    } catch (error) {
      hideLoading();
      toast.error(t("notificationUser.errors.errorMessage"));
    }
  };

  const handleLoadMore = async () => {
    try {
      if (isLoadingMore || !hasMoreItems) return;

      setIsLoadingMore(true);
      const result = await notificationService.getNotificationsUserList(page,PAGE_SIZE);
      const items = result.items;
      setNotifications((notifications) => [...notifications, ...items]);
      setIsLoadingMore(false);
      setHasMoreItems(result.hasMoreRecords);
      setPage((page) => page + 1);
    } catch (error) {
      setIsLoadingMore(false);
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      if (!isSubmitted) {
        setIsSubmitted(true);
        await notificationService.deleteNotificationUser(notificationId);
        setIsSubmitted(false);
        setIsDeleteModal(false);
        setOpenNotify(true);
        getNotificationsUserList();
      }
    } catch (error) {
      setIsDeleteModal(false);
      setIsSubmitted(false);
      toast.error(t("notificationUser.delete.deleteFailure"));
    }
  };

  useEffect(() => {
    const getHeight = () => {
      if (elementRef && elementRef.current && elementRef.current.clientHeight) {
        setHeightBtn(elementRef?.current?.clientHeight + 1);
      }
    };

    getHeight();
  }, []);

  useEffect(() => {
    showLoading();
    getNotificationsUserList();
  }, []);

  return (
    <div className={styles.notifications}>
      <HeaderContent
        title={t("notificationUser.title")}
        isBtnLeft={true}
        onBtnLeft={() => history.goBack()}
      />
      <div className="mt_12">
        <div className={styles.item_list}>
          {notifications && notifications.length > 0 ? (
            <InfiniteScroll
              dataLength={notifications.length}
              next={() => handleLoadMore()}
              hasMore={true}
              loader={<></>}
            >
              {notifications.map((item, index) => (
                <div className={styles.notification_item} key={index}>
                  <div className={styles.left_item} 
                    onClick={() => history.push(`/notification/edit/${item.notificationId}`)}>
                    <p className="text_16">{item.title}</p>
                    <p className="mt_4">{item.label}</p>
                  </div>
                  <div className={styles.right_item}>
                    <div
                      className={`${styles.div_icon_delete} image_delete mb_8`}
                      onClick={() => [
                        setNotificationId(item.notificationId),
                        setIsDeleteModal(true),
                      ]}
                    >
                      <img src={iconDelete} alt="iconDelete"></img>
                    </div>
                    <div className="item_edit"
                      onClick={() => history.push(`/notification/edit/${item.notificationId}`)}>
                      <img src={iconEdit} alt="iconEdit"></img>
                    </div>
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          ) : (
            <NoData />
          )}
        </div>
        <div style={{ height: heightBtn }}></div>
        <div className={`${styles.form_button}`} ref={elementRef}>
          <button
            className="btn_main"
            onClick={() => history.push("/notification/add")}
          >
            {t("notificationUser.btnAdd")}
          </button>
        </div>

        <ConfirmModal
          id={notificationId}
          open={isDeleteModal}
          title={t("notificationUser.delete.title")}
          subTitle={t("notificationUser.delete.confirmText")}
          textButton={t("notificationUser.delete.btnDelete")}
          textCancel={t("cancel")}
          handleEvent={() => handleDelete(notificationId)}
          handleCloseModal={() => setIsDeleteModal(false)}
        />
        <NotifyModal
          open={openNotify}
          message={t("notificationUser.delete.successMessage")}
          title={""}
          textButton={t("close")}
          handleCloseModal={() => setOpenNotify(false)}
        ></NotifyModal>
      </div>
    </div>
  );
};

export default NotificationsUserList;
