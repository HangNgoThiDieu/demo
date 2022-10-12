import Label from "components/commons/label";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { storeSettingService } from "services/store.service";
import { StoreInformationResult } from "types/results/store-setting/store-information.result";
import styles from "./index.module.scss";
import HeaderContentRight from "components/commons/header-content-right";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import NotificationModal from "components/modals/notification";
import { NotificationEditModel } from "types/models/notification/notification-edit.model";
import { notificationService } from "services/notification.service";
import { NotificationDetailResult } from "types/results/notification/notification-detail.result";
import NotifyModal from "components/modals/notify";
import { NotificationAddModel } from "types/models/notification/notification-add.model";
import StoreModal from "components/modals/edit-store";
import { EditStoreModel } from "types/models/store-setting/edit-store.models";
import { CURRENCY_UNITS, LANGUAGE, LANGUAGE_LIST, TRANSLATE_LIST, WORK_STATUS } from "utils";
import { StoreNotificationResult } from "types/results/store-setting/store-notification.result";
import NoData from "components/commons/no-data";
import iconEdit from "assets/images/icon_edit.svg";
import InfiniteScroll from "react-infinite-scroll-component";
import { tokenHelper } from "utils/store-token";
import i18n from "config/i18n";
import moment from "moment";
import { useLoadingContext } from "context/loading";

const PAGE_SIZE = 10;

const StoreSetting = () => {
  const { t } = useTranslation();
  const [storeInfor, setStoreInfor] = useState<StoreInformationResult>({} as StoreInformationResult);
  const history = useHistory();
  const [openNotification, setOpenNotification] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [notificationResult, setNotificationResult] =
    useState<NotificationDetailResult>();
  const [openNotify, setOpenNotify] = useState(false);
  const [messageNotify, setMessageNotify] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [openEditStore, setOpenEditStore] = useState(false);
  const [storeDetail, setStoreDetail] = useState<EditStoreModel>();
  const [language, setLanguage] = useState<number>();
  const [notificationList, setNotificationList] = useState<
    StoreNotificationResult[]
  >([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [heightBtn, setHeightBtn] = useState(0);
  const elementRef = useRef(null as any);
  const [btnClose, setBtnClose] = useState<string>("");
  const { showLoading, hideLoading } = useLoadingContext();

  const openEditStoreModal = () => {
    const storeModel = {
      storeName: storeInfor?.storeName,
      address: storeInfor?.address,
      phoneNumber: storeInfor?.phoneNumber,
      email: storeInfor?.email,
      currencyUnit: storeInfor?.currencyUnit,
      language: storeInfor?.language,
    } as EditStoreModel;
    setStoreDetail(storeModel);
    setOpenEditStore(true);
  };

  const onOpenNotificationEdit = (notificationId: number) => {
    notificationId &&
      notificationService
        .getNotificationDetail(notificationId)
        .then((result) => {
          const startDate = new Date(result.startDate);
          const endDate = new Date(result.endDate);
          const notificationResult = {
            notificationId: result.notificationId,
            title: result.title,
            content: result.content,
            startDate: startDate,
            endDate: endDate,
            status: result.status,
          } as NotificationDetailResult;

          setNotificationResult(notificationResult);
          setOpenNotification(true);
        })
        .catch((e) => {
          toast.error(t("validation.errorMessage"));
        });
  };

  const onOpenNotificationAdd = () => {
    setNotificationResult({} as any);
    setOpenNotification(true);
    setIsAdd(true);
  };

  const onClose = () => {
    setOpenNotification(false);
    setIsAdd(false);
    setIsSubmit(false);
  };

  const handleEventNotification = (data: any) => {

    if (!isSubmit) {
      setIsSubmit(true);

      if (isAdd) {
        const notificationModel = {
          title: data.title,
          content: data.content,
          startDate: moment(data.startDate).format("yyyy/MM/DD"),
          endDate: moment(data.endDate).format("yyyy/MM/DD"),
          status: data.status,
        } as NotificationAddModel;

        notificationService
          .addNotification(notificationModel)
          .then(() => {
            setOpenNotification(false);
            setMessageNotify(t("notification.add.notifySuccess"));
            setOpenNotify(true);
            setIsSubmit(false);
            setIsAdd(false);
            setBtnClose(t("close"));
          })
          .catch((e) => {
            setIsSubmit(false);
            toast.error(t("validation.errorMessage"));
          });
      } else {
        const notificationModel = {
          notificationId: notificationResult?.notificationId,
          title: data.title,
          content: data.content,
          startDate: moment(data.startDate).format("yyyy/MM/DD"),
          endDate: moment(data.endDate).format("yyyy/MM/DD"),
          status: data.status,
        } as NotificationEditModel;

        notificationService
          .editNotification(notificationModel)
          .then(() => {
            setOpenNotification(false);
            setMessageNotify(t("notification.edit.notifySuccess"));
            setOpenNotify(true);
            setIsSubmit(false);
            setIsAdd(false);
            setBtnClose(t("close"));
          })
          .catch((e) => {
            setIsSubmit(false);
            toast.error(t("validation.errorMessage"));
          });
      }
    }
  };

  const closeNotify = () => {
    setOpenNotify(false);
    setOpenNotification(false);
    setOpenEditStore(false);
  };

  const editStore = (data: EditStoreModel) => {
    const storeModel = {
      storeName: data.storeName,
      address: data.address,
      phoneNumber: data.phoneNumber,
      email: data.email,
      currencyUnit: data.currencyUnit,
      language: language,
    } as EditStoreModel;

    storeSettingService
      .editStore(storeModel)
      .then(() => {
        setMessageNotify(t("storeSetting.edit.messageSuccess"));
        setOpenNotify(true);
        setBtnClose(t("close"));
        changeLanguage();
        tokenHelper.setPropertyToStorage(CURRENCY_UNITS,storeModel.currencyUnit);
      })
      .catch((e) => {
        toast.error(t("validation.errorMessage"));
      });
  };

  const handleChangeLanguage = (data: any) => {
    setLanguage(data);
  };

  const closeEditStore = () => {
    setOpenEditStore(false);
  };

  const getNotificationList = () => {
    storeSettingService
      .getNotificationList(1, PAGE_SIZE)
      .then((result) => {
        setNotificationList(result.items);
        setHasMoreItems(result.hasMoreRecords);
        setPage(2);
        hideLoading();
      })
      .catch((error) => {
        hideLoading();
        toast.error(t("validation.errorMessage"));
      });
  };

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMoreItems) return;

    setIsLoadingMore(true);
    storeSettingService
      .getNotificationList(page, PAGE_SIZE)
      .then((res) => {
        const items = res.items;
        setNotificationList((notificationList) => [
          ...notificationList,
          ...items,
        ]);
        setIsLoadingMore(false);
        setHasMoreItems(res.hasMoreRecords);
        setPage((page) => page + 1);
      })
      .catch((err) => {
        setIsLoadingMore(false);
      });
  };

  useEffect(() => {
    showLoading();
    storeSettingService
      .getStoreInformation()
      .then((result) => {
        setStoreInfor(result);
        setLanguage(result.language);
      })
      .catch((error) => {
        hideLoading();
        toast.error(t("validation.errorMessage"));
      });
    getNotificationList();
  }, [openNotify]);

  const getHeight = () => {
    if (elementRef && elementRef.current && elementRef.current.clientHeight) {
      setHeightBtn(elementRef?.current?.clientHeight + 1);
    }
  };

  const changeLanguage = () => {
    tokenHelper.removeLanguage();
    storeSettingService.getLanguageStore().then((result) => {
      const language = TRANSLATE_LIST.filter((x) => x.key == result).map((y) => y.value).shift();
      tokenHelper.setLanguageToStorage(LANGUAGE, language);
      i18n.changeLanguage(tokenHelper.getLanguageFromStorage(LANGUAGE));
    });
  }

  useEffect(() => {
    getHeight();
  }, []);

  return (
    <>
      <div className={styles.store_setting}>
        <HeaderContentRight
          title={t("storeSetting.title")}
          isBtnLeft={true}
          onBtnLeft={() => history.goBack()}
          isBtnRight={true}
          onBtnRight={openEditStoreModal}
          titleBtnRight={t("storeSetting.editStore")}
        ></HeaderContentRight>
        <div>
          <div className={styles.content}>
            <div className={styles.mb_32}>
              <div>
                <Label text={t("storeSetting.storeName")}></Label>
              </div>
              <div className={styles.mt_5}>
                <label>{storeInfor?.storeName}</label>
              </div>
            </div>
            <div className={styles.mb_32}>
              <div>
                <Label text={t("address")}></Label>
              </div>
              <div className={styles.mt_5}>
                <label>{storeInfor?.address}</label>
              </div>
            </div>
            <div className={styles.mb_32}>
              <div>
                <Label text={t("phoneNumber")}></Label>
              </div>
              <div className={styles.mt_5}>
                <label>{storeInfor?.phoneNumber}</label>
              </div>
            </div>
            <div className={styles.mb_32}>
              <div>
                <Label text={t("email")}></Label>
              </div>
              <div className={styles.mt_5}>
                <label>{storeInfor?.email}</label>
              </div>
            </div>
            <div>
              <div>
                <Label text={t("storeSetting.languageAndCurrency")}></Label>
              </div>
              <div className={styles.mt_5}>
                <label>
                  { storeInfor.language !== undefined ?
                    t(
                      LANGUAGE_LIST.filter(
                        (x) => x.key === storeInfor.language
                      ).map((y) => y.value)
                    ) : null
                  }
                  {" "}
                  : {storeInfor?.currencyUnit}
                </label>
              </div>
            </div>
          </div>
          <div className={styles.space}></div>
          <div className={styles.notify}>
            <label className={styles.title}>
              {t("storeSetting.titleNotify")}
            </label>
            <div
              className={`${styles.list_notify} ${
                notificationList &&
                notificationList.length > 0 &&
                styles.scroll_notify
              }`}
            >
              {notificationList.length > 0 ? (
                <InfiniteScroll
                  dataLength={notificationList.length}
                  next={() => handleLoadMore()}
                  hasMore={true}
                  loader={<></>}
                >
                  {notificationList.map((item, index) => {
                    return (
                      <div key={index} className={styles.notify_item}>
                        <label className="pl_8">
                          {item.notificationTitle}{"\u00a0\u00a0\u00a0"}
                          {new Date(item.startDate).getMonth() + 1}/
                          {new Date(item.startDate).getDate()}・
                          {new Date(item.endDate).getMonth() + 1}/
                          {new Date(item.endDate).getDate()}
                        </label>
                        <img
                          className="pr_10"
                          src={iconEdit}
                          alt="iconEdit"
                          onClick={() =>
                            onOpenNotificationEdit(item.notificationId)
                          }
                        ></img>
                      </div>
                    );
                  })}
                </InfiniteScroll>
              ) : (
                <NoData />
              )}
            </div>
          </div>
          <div style={{ height: heightBtn }}></div>
          <div className={styles.form_button} ref={elementRef}>
            <button
              className="btn_main"
              onClick={() => onOpenNotificationAdd()}
            >
              {t("notify.buttonAddNotify")}
            </button>
          </div>
        </div>
        {openNotification && <NotificationModal
          open={openNotification}
          title={
            isAdd
              ? t("notification.add.titleModal")
              : t("notification.edit.titleModal")
          }
          isAdd={isAdd}
          textButton={
            isAdd
              ? t("notification.add.buttonAdd")
              : t("notification.edit.buttonEdit")
          }
          textCancel={t("cancel")}
          notificationResult={notificationResult}
          handleEvent={handleEventNotification}
          handleCloseModal={onClose}
        ></NotificationModal>}
        <NotifyModal
          open={openNotify}
          message={messageNotify}
          textButton={btnClose}
          handleCloseModal={closeNotify}
        ></NotifyModal>
        {openEditStore && <StoreModal
          open={openEditStore}
          storeModel={storeDetail}
          title={t("storeSetting.edit.title")}
          textButton={t("storeSetting.edit.buttonEdit")}
          textCancel={t("cancel")}
          handleEvent={editStore}
          handleCloseModal={closeEditStore}
          handleChangeLanguage={handleChangeLanguage}
        ></StoreModal>}
      </div>
    </>
  );
};

export default StoreSetting;
