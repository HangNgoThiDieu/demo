import ButtonSeat from "components/commons/button-seat";
import HeaderContent from "components/commons/header-content";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";
import time from "assets/images/icon_time.svg";
import { orderService } from "services/order.service";
import { OrderItemResult } from "types/results/orders/order-items.result";
import { toBrowserTime } from "utils/datetime";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import ConfirmModal from "components/modals/confirm";
import { toast } from "react-toastify";
import { CURRENCY_UNITS, LOCALE, OPTION_CURRENCY, ORDER_STATUS } from "utils/constants";
import NoData from "components/commons/no-data";
import InfiniteScroll from "react-infinite-scroll-component";
import NotifyModal from "components/modals/notify";
import { tokenHelper } from "utils/store-token";
import { useLoadingContext } from "context/loading";

const PAGE_SIZE = 10;

const OrderList = () => {
  const { t } = useTranslation();
  const { accessToken } = tokenHelper.getTokenFromStorage();
  const { showLoading, hideLoading } = useLoadingContext();

  const [connection, setConnection] = useState<HubConnection>();
  const [isActive, setIsActive] = useState<number>(ORDER_STATUS.UnFinished);
  const [orderList, setOrderList] = useState<OrderItemResult[]>([]);
  const [orderStatus, setOrderStatus] = useState(ORDER_STATUS.UnFinished);
  const audioRef = useRef<any>(null);
  const [isShowCancelled, setIsShowCancelled] = useState(false);
  const [isShowFinished, setIsShowFinished] = useState(false);
  const [orderId, setOrderId] = useState<number>(0);
  const sound = require("assets/audio/sound-notify.mp3");
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [openNotifyFinished, setOpenNotifyFinished] = useState(false);
  const [openNotifyCancelled, setOpenNotifyCancelled] = useState(false);
  const [unitPrice, setUnitPrice] = useState<string>();

  const [page, setPage] = useState(1);

  const fetchOrders = () => {
    orderService
      .getOrderList(orderStatus, 1, PAGE_SIZE)
      .then((result) => {
        const items = result.items;
        setOrderList(items);
        setHasMoreItems(result.hasMoreRecords);
        setPage(2);
        hideLoading();
      })
      .catch((error) => {
        hideLoading();
      });
  };

  const handleFilter = (value: number) => {
    if (value !== orderStatus) {
      setIsActive(value);
      setOrderStatus(value);
      setPage(1);
    }
  };

  const handleLoadMore = () => {
    if (
      isLoadingMore ||
      !hasMoreItems ||
      orderStatus === ORDER_STATUS.UnFinished
    )
      return;

    setIsLoadingMore(true);
    orderService
      .getOrderList(orderStatus, page, PAGE_SIZE)
      .then((res) => {
        const items = res.items;
        setOrderList((orderList) => [...orderList, ...items]);
        setIsLoadingMore(false);
        setHasMoreItems(res.hasMoreRecords);
        setPage((page) => page + 1);
      })
      .catch((err) => {
        setIsLoadingMore(false);
      });
  };

  const changeStatusOrder = (orderID: number, orderStatus: number) => {
    orderService
      .changeStatusOrder(orderID, orderStatus)
      .then((result) => {
        fetchOrders();

        if (orderStatus === ORDER_STATUS.Cancelled) {
          setIsShowCancelled(false);
          setOpenNotifyCancelled(true);
        } else {
          setIsShowFinished(false);
          setOpenNotifyFinished(true);
        }
      })
      .catch((err) => toast.error(t("validation.errorMessage")));
  };

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${process.env.REACT_APP_API_URL}order/notifications`, { accessTokenFactory: () =>  accessToken})
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then((result) => {
          connection.on("Order", (message) => {
            fetchOrders();
            audioRef?.current?.play();
          });
        })
        .catch((e) => {});
    }
  }, [connection]);

  useEffect(() => {
    const getCurrencyUnit = () => {
      const unit = tokenHelper.getPropertyFromStorage(CURRENCY_UNITS);
      setUnitPrice(unit);
    }

    getCurrencyUnit();
  }, [])

  useEffect(() => {
    showLoading();
    fetchOrders();
  }, [orderStatus]);

  return (
    <>
      <div className={`${styles.order_list}`}>
        <HeaderContent
          title={t("order.list.title")}
          titleStyle={styles.title_style}
        />
        <div className={styles.tab}>
          <div className={styles.tab_status}>
            <div className={`${styles.tab_item}`}>
              <a className={styles.menu} role="button">
                <span
                  onClick={() => {
                    handleFilter(ORDER_STATUS.All);
                  }}
                  className={`${
                    isActive == ORDER_STATUS.All ? "active" : styles.span_status
                  }`}
                >
                  {t("order.list.tabStatus.all")}
                </span>
              </a>
            </div>
            <div className={`${styles.tab_item}`}>
              <a className={styles.menu} role="button">
                <span
                  onClick={() => {
                    handleFilter(ORDER_STATUS.Cancelled);
                  }}
                  className={`${
                    isActive == ORDER_STATUS.Cancelled
                      ? "active"
                      : styles.span_status
                  }`}
                >
                  {t("order.list.tabStatus.cancel")}
                </span>
              </a>
            </div>
            <div className={`${styles.tab_item}`}>
              <a className={styles.menu} role="button">
                <span
                  onClick={() => {
                    handleFilter(ORDER_STATUS.Finished);
                  }}
                  className={`${
                    isActive == ORDER_STATUS.Finished
                      ? "active"
                      : styles.span_status
                  }`}
                >
                  {t("order.list.tabStatus.finished")}
                </span>
              </a>
            </div>
            <div className={`${styles.tab_item}`}>
              <a className={styles.menu} role="button">
                <span
                  onClick={() => {
                    handleFilter(ORDER_STATUS.UnFinished);
                  }}
                  className={`${
                    isActive == ORDER_STATUS.UnFinished
                      ? "active"
                      : styles.span_status
                  }`}
                >
                  {t("order.list.tabStatus.unfinished")}
                </span>
              </a>
            </div>
          </div>
          <div className={styles.tab_line}>
            <div
              className={`${
                isActive == ORDER_STATUS.All ? "menu-line " : styles.span_line
              }`}
            ></div>
            <div
              className={`${
                isActive == ORDER_STATUS.Cancelled
                  ? "menu-line "
                  : styles.span_line
              }`}
            ></div>
            <div
              className={`${
                isActive == ORDER_STATUS.Finished
                  ? "menu-line "
                  : styles.span_line
              }`}
            ></div>
            <div
              className={`${
                isActive == ORDER_STATUS.UnFinished
                  ? "menu-line "
                  : styles.span_line
              }`}
            ></div>
          </div>
        </div>
        <div className={styles.contentWrapper}>
          {orderList.length > 0 ? (
            <InfiniteScroll
              dataLength={orderList.length}
              next={() => handleLoadMore()}
              hasMore={true}
              loader={<></>}
            >
              {orderList.map((item, index) => {
                return (
                  <div key={index} className={styles.item}>
                    <label className={`title-name ${styles.table_name}`}>
                      {item.tableName}
                    </label>
                    <div className={styles.sub_title}>
                      <img src={time} className={styles.icon_time} />
                      <span className={`text-sub ${styles.order_date}`}>
                        {" "}
                        {t("order.list.orderTime")}：
                        {toBrowserTime(
                          item.orderDate,
                          t("datetimeFormatStringHM")
                        )}
                      </span>
                    </div>
                    {item.productOrderList.length > 0 &&
                      item.productOrderList.map((each, i) => {
                        return (
                          <div key={i} className={styles.product_order_list}>
                            <div
                              className={`text-description ${styles.product_order}`}
                            >
                              {each.productName} x {each.quantity}
                            </div>
                            {each.productOrderOptions.length > 0 &&
                              each.productOrderOptions.map((option, o) => {
                                return (
                                  <div
                                    key={o}
                                    className={`text-description ${styles.product_order}`}
                                  >
                                    {option.productOptionName}
                                  </div>
                                );
                              })}
                            <div
                              className={`text-description ${styles.product_order}`}
                            >
                              {each.categoryName}
                            </div>
                          </div>
                        );
                      })}

                    {item.orderStatus === ORDER_STATUS.UnFinished && (
                      <ButtonSeat
                        textLeft={t("order.list.button.cancelled")}
                        textRight={t("order.list.button.finished")}
                        classNameLeft={`btn_white`}
                        classNameRight={`btn_main`}
                        onRightPress={() => [
                          setIsShowFinished(true),
                          setOrderId(item.orderId),
                        ]}
                        onLeftPress={() => [
                          setIsShowCancelled(true),
                          setOrderId(item.orderId),
                        ]}
                      />
                    )}
                  </div>
                );
              })}
            </InfiniteScroll>
          ) : (
            <NoData />
          )}
        </div>
        <audio src={sound.default} ref={audioRef}></audio>
      </div>
      {isShowFinished && <ConfirmModal
        id={orderId}
        open={isShowFinished}
        title={t("order.list.confirmFinished.title")}
        subTitle={t("order.list.confirmFinished.subTitle")}
        textButton={t("order.list.confirmFinished.textButton")}
        textCancel={t("cancel")}
        handleEvent={() => changeStatusOrder(orderId, ORDER_STATUS.Finished)}
        handleCloseModal={() => setIsShowFinished(false)}
      />}
      {openNotifyFinished && <NotifyModal
        open={openNotifyFinished}
        title={t("order.list.confirmFinished.title")}
        message={t("order.list.finishedMessage")}
        textButton={t("close")}
        handleCloseModal={() => setOpenNotifyFinished(false)}
      ></NotifyModal>}

      {isShowCancelled && <ConfirmModal
        id={orderId}
        open={isShowCancelled}
        title={t("order.list.confirmCancelled.title")}
        subTitle={t("order.list.confirmCancelled.subTitle")}
        textButton={t("order.list.confirmCancelled.textButton")}
        textCancel={t("cancel")}
        handleEvent={() => changeStatusOrder(orderId, ORDER_STATUS.Cancelled)}
        handleCloseModal={() => setIsShowCancelled(false)}
      />}
      {openNotifyCancelled && <NotifyModal
        open={openNotifyCancelled}
        title={t("order.list.confirmCancelled.title")}
        message={t("order.list.cancelledMessage")}
        textButton={t("close")}
        handleCloseModal={() => setOpenNotifyCancelled(false)}
      ></NotifyModal>}
    </>
  );
};

export default OrderList;
