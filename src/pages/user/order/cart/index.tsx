import HeaderContent from "components/commons/header-content";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";
import IconMinus from "assets/images/icon_minus.svg";
import IconPlus from "assets/images/icon_plus_white.svg";
import { useEffect, useMemo, useRef, useState } from "react";
import { CartResult } from "types/results/orders/cart.result";
import { orderService } from "services/order.service";
import { toast } from "react-toastify";
import { toBrowserTime } from "utils/datetime";
import Config from "config";
import ConfirmModal from "components/modals/confirm";
import { useHistory, useParams } from "react-router";
import ConfirmOrderModal from "components/modals/confirm-order";
import {
  CURRENCY_UNITS,
  LOCALE,
  OPTION_CURRENCY,
  ORDER_STATUS,
  TRANSACTION_INFO,
} from "utils/constants";
import IconCartLight from "assets/images/icon_cart_light.svg";
import NotifyModal from "components/modals/notify";
import NoImage from "assets/images/no-image.png";
import { useUserContext } from "layouts/user";
import { tokenHelper } from "utils/store-token";
import ImgOptimizeByWebp from "components/commons/img-webp";
import { useLoadingContext } from "context/loading";
import { TransactionInfo } from "types/models/trans-info.model";

interface ParamsOfCart {
  orderId: number;
}
const Cart = (props: any) => {
  const info = tokenHelper.getPropertyFromStorage(TRANSACTION_INFO);

  const { t } = useTranslation();
  const history = useHistory();
  const { showLoading, hideLoading } = useLoadingContext();
  const params = useParams();
  const { orderId } = params as ParamsOfCart;
  const [cart, setCart] = useState<CartResult>({} as CartResult);
  const [isResetModal, setIsResetModal] = useState(false);
  const [isRemoveModal, setIsRemoveModal] = useState(false);
  const [removeProductOrderId, setRemoveProductOrderId] = useState<number>(-1);
  const [openModal, setOpenModal] = useState(false);
  const [heightBtn, setHeightBtn] = useState(0);
  const elementRef = useRef(null as any);
  const [openNotify, setOpenNotify] = useState(false);
  const [isReally, setIsReally] = useState(true);
  const { isOrderHistory } = useUserContext();
  const [isShowMessage, setIsShowMessage] = useState<boolean>(false);
  const [unitPrice, setUnitPrice] = useState<string>();

  const getCart = async () => {
    try {
      const result = await orderService.userGetCart(orderId);

      result.productOrderItems = result.productOrderItems.map((item) => {
        item.productPrice = item.productPrice * item.productQuantity;

        return item;
      });
      setCart(result);
      hideLoading();
    } catch (err) {
      hideLoading();
      toast.error(t("validation.errorMessage"));
    }
  };

  const handleResetCart = (orderId: number, transactionId: number) => {
    orderService
      .userResetCart(orderId, transactionId)
      .then((result) => {
        setIsResetModal(false);
        setOpenNotify(true);
        getCart();
      })
      .catch((error) => {
        toast.error(t("validation.errorMessage"));
      });
  };

  const handleChangeAmount = async (
    orderId: number,
    productOrderId: number,
    quantity: number,
    isMinus: boolean,
    productId: number = 0
  ) => {
    try {
      if (isReally) {
        setIsReally(false);
        if (isMinus && quantity - 1 < 1) {
          setRemoveProductOrderId(productOrderId);
          setIsRemoveModal(true);
          setIsReally(true);
          return;
        } else {
          if (isMinus) {
            quantity -= 1;
          } else {
            await orderService
              .checkMultipleSelectionUser(productId, 0)
              .then((result) => {
                if (result) {
                  setIsShowMessage(true);
                  return;
                } else {
                  quantity += 1;
                }
              });
          }
          await orderService.userChangeAmountProductOrder(
            orderId,
            productOrderId,
            quantity
          );
          getCart();
          setIsReally(true);
        }
      }
    } catch (err) {
      setIsReally(true);
    }
  };

  const removeProductOrder = (
    orderId: number,
    productOrderId: number,
    quantity: number = 0
  ) => {
    orderService
      .userChangeAmountProductOrder(orderId, productOrderId, quantity)
      .then((result) => {
        setIsRemoveModal(false);
        getCart();
      })
      .catch((error) => {
        setIsRemoveModal(false);
        toast.error(t("validation.errorMessage"));
      });
  };

  const handleConfirm = () => {
    try {
      let isNotify = true;
      orderService
        .userChangeStatusOrder(
          cart.orderId,
          ORDER_STATUS.UnFinished,
          isNotify,
          info.com
        )
        .then(() => {
          history.push(
            `/user/trans?transId=${cart.transactionId}&comId=${info.com}`
          );
          // update storage
          const transInfo = {
            com: info.com,
            trans: cart.transactionId,
          } as TransactionInfo;

          tokenHelper.setPropertyToStorage(
            TRANSACTION_INFO,
            JSON.stringify(transInfo)
          );
        });
    } catch (e) {
      toast.error(t("validation.errorMessage"));
    }
  };

  const closeConfirm = () => {
    setOpenModal(false);
  };

  const getHeight = () => {
    if (elementRef && elementRef.current && elementRef.current.clientHeight) {
      setHeightBtn(elementRef?.current?.clientHeight + 1);
    }
  };

  useEffect(() => {
    const getCurrencyUnit = () => {
      const unit = tokenHelper.getPropertyFromStorage(CURRENCY_UNITS);
      setUnitPrice(unit);
    };

    getCurrencyUnit();
    getHeight();
  }, []);

  useEffect(() => {
    showLoading();
    isOrderHistory(true);
    getCart();
  }, [orderId]);

  return (
    <>
      <div className={styles.content}>
        <HeaderContent
          title={t("order.cart.title")}
          titleStyle={styles.title_style}
          isBtnLeft={true}
          onBtnLeft={() => history.goBack()}
        />
        <div className={styles.infor_table_name}>
          <span className="title_modal break_word">{cart?.tableName}</span>
        </div>
        <div className={styles.infor_transaction}>
          <div>
            <div className={styles.infor_child}>
              <span className="text_small">
                {t("order.cart.label.transactionId")}：{t("transactionName")}
                {cart?.transactionId}
              </span>
              <span className="text_small">
                {t("order.cart.label.transactionStartTime")}：
                {toBrowserTime(
                  cart?.transactionStartDate,
                  t("datetimeFormatStringHM")
                )}
              </span>
            </div>
          </div>
          <div className={styles.button_item}>
            <button
              className={`${styles.reset_cart} btn_text_sub`}
              onClick={() =>
                cart.productOrderItems?.length > 0 ? setIsResetModal(true) : {}
              }
            >
              {t("order.cart.button.resetAll")}
            </button>
          </div>
        </div>
        <div className={styles.list_product}>
          {cart.productOrderItems?.length > 0 ? (
            cart.productOrderItems &&
            cart.productOrderItems.map((item, index) => {
              return (
                <div key={index} className={styles.product_select}>
                  <div className={styles.info_product}>
                    <div className={styles.group_image}>
                      <ImgOptimizeByWebp
                        className={styles.image_product}
                        src={`${
                          !item.productImage
                            ? NoImage
                            : Config.API_URL.GET_IMAGE + item.productImage
                        }`}
                        fallback={NoImage}
                        type="image/webp"
                        alt="product-image"
                      />
                    </div>
                    <div className={styles.infor_product}>
                      {/* seat part will be add on other phase */}
                      <p>{cart?.isEnableSeat ?
                       (item.seatName && item.seatName?.trim() !="" ? item.seatName :  t("order.cart.seatUndefined")) : ''}</p>
                      {/* end comment */}
                      <p className="title_modal break_word">
                        {item.productName}
                      </p>
                      <p className="sub_text break_word">
                        {item.productDescription}
                      </p>
                    </div>
                  </div>
                  <div className={styles.under_product}>
                    <div className={styles.price_row}>
                      <span className={styles.product_price}>
                        {item.productPaymentPrice?.toLocaleString(
                          LOCALE,
                          OPTION_CURRENCY
                        )}
                        {t("unitPrice", { unitPrice: unitPrice })}
                        <span className={styles.product_vat}>{t("tax")}</span>
                      </span>
                      {item.productPaymentPrice &&
                      item.productPrice > item.productPaymentPrice ? (
                        <div className={styles.original_price}>
                          {item.productPrice?.toLocaleString(
                            LOCALE,
                            OPTION_CURRENCY
                          )}
                          {t("unitPrice", { unitPrice: unitPrice })}
                          <span className={styles.product_original_vat}>
                            {t("tax")}
                          </span>
                          <div className="line_through_price"></div>
                        </div>
                      ) : null}
                    </div>
                    <div className={styles.quantity}>
                      <div
                        className={`${styles.minus} minus`}
                        onClick={() =>
                          handleChangeAmount(
                            cart.orderId,
                            item.productOrderId,
                            item.productQuantity,
                            true
                          )
                        }
                      >
                        <img src={IconMinus} alt="" />
                      </div>
                      <div className={styles.product_number}>
                        <span className="text_number">
                          {item.productQuantity}
                        </span>
                      </div>
                      <div
                        className={`${styles.plus} plus`}
                        onClick={() =>
                          handleChangeAmount(
                            cart.orderId,
                            item.productOrderId,
                            item.productQuantity,
                            false,
                            item.productId
                          )
                        }
                      >
                        <img src={IconPlus} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // <NoData />
            <div className={styles.cart_empty}>
              <p className={`mb_12 ${styles.text_empty}`}>
                {t("order.cart.cartEmpty")}
              </p>
              <img src={IconCartLight} alt="" />
            </div>
          )}
        </div>
        <div style={{ height: heightBtn }}></div>
        <div
          className={`${styles.form_group} ${styles.form_button}`}
          ref={elementRef}
        >
          <div className={styles.total_price}>
            <span className="text_price">
              {t("total")}：
              {cart.totalOrderPrice?.toLocaleString(LOCALE, OPTION_CURRENCY)}
              {t("unitPrice", { unitPrice: unitPrice })}
            </span>
            <span className={styles.product_vat_none}>{t("tax")}</span>
          </div>
          <div className={styles.group_button}>
            <button
              className={`btn_white mr_4`}
              onClick={() =>
                history.push(
                  `/user/transaction/${cart.transactionId}/order/select-product/`,
                  { prevPage: history.location.pathname }
                )
              }
            >
              {t("order.cart.button.productList")}
            </button>
            <button
              className={`btn_main ml_4`}
              onClick={() => setOpenModal(true)}
              disabled={!cart || cart.productOrderItems?.length < 1}
            >
              {t("order.cart.button.confirmOrder")}
            </button>
          </div>
        </div>
      </div>

      {isResetModal && (
        <ConfirmModal
          id={orderId}
          open={isResetModal}
          title={t("order.cart.modal.titleReset")}
          subTitle={t("order.cart.modal.subTitleReset")}
          textButton={t("order.cart.modal.button.reset")}
          textCancel={t("cancel")}
          handleEvent={() => handleResetCart(orderId, cart.transactionId)}
          handleCloseModal={() => setIsResetModal(false)}
        />
      )}

      {isRemoveModal && (
        <ConfirmModal
          id={removeProductOrderId}
          open={isRemoveModal}
          title={t("order.cart.modal.titleRemove")}
          subTitle={t("order.cart.modal.subTitleRemove")}
          textButton={t("order.cart.modal.button.remove")}
          textCancel={t("cancel")}
          handleEvent={() =>
            removeProductOrder(orderId, removeProductOrderId, 0)
          }
          handleCloseModal={() => setIsRemoveModal(false)}
        />
      )}

      {openModal && (
        <ConfirmOrderModal
          open={openModal}
          title={t("order.confirmOrder.title")}
          subTitle={t("order.confirmOrder.subTitle")}
          textButton={t("confirm")}
          textCancel={t("cancel")}
          confirmOrder={cart}
          handleEvent={handleConfirm}
          handleCloseModal={closeConfirm}
        ></ConfirmOrderModal>
      )}

      {openNotify && (
        <NotifyModal
          open={openNotify}
          title={t("order.cart.notify.resetCartTitle")}
          message={t("order.cart.notify.resetCartMessage")}
          textButton={t("close")}
          handleCloseModal={() => setOpenNotify(false)}
        ></NotifyModal>
      )}

      {isShowMessage && (
        <NotifyModal
          open={isShowMessage}
          message={t("order.product.detail.modal.message")}
          textButton={t("close")}
          handleCloseModal={() => setIsShowMessage(false)}
        ></NotifyModal>
      )}
    </>
  );
};

export default Cart;
