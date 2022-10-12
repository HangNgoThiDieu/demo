import HeaderContent from "components/commons/header-content";
import NoData from "components/commons/no-data";
import CashPaymentModal from "components/modals/cash-payment-confirm";
import NotifyModal from "components/modals/notify";
import { useLoadingContext } from "context/loading";
import { useUserContext } from "layouts/user";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { paymentService } from "services/payment.service";
import { PaymentByOnePayModel } from "types/models/payment/payment-onepay.model";
import { PaymentDetailResult } from "types/results/payment/payment-detail.result";
import {
  CURRENCY_UNITS,
  LANGUAGE_USER,
  LOCALE,
  OPTION_CURRENCY,
  PAYMENT_GATEWAY,
  PAYMENT_GATEWAY_LIST,
  TRANSACTION_INFO,
} from "utils";
import { toBrowserTime } from "utils/datetime";
import { tokenHelper } from "utils/store-token";
import styles from "./index.module.scss";

interface DataForCashModal {
  tableName: string;
  transactionId: number;
  timeIn: string;
  timeOut: string;
  quantity: number;
  totalPrice: number;
}

const Payment = (props: any) => {
  const info = tokenHelper.getPropertyFromStorage(TRANSACTION_INFO);
  
  const { t } = useTranslation();
  const history = useHistory();
  const [heightBtn, setHeightBtn] = useState(0);
  const elementRef = useRef(null as any);
  const [paymentDetail, setPaymentDetail] = useState<PaymentDetailResult>(
    {} as PaymentDetailResult
  );
  const { isOrderHistory } = useUserContext();
  const paymentMethodsDefault: number[] = [PAYMENT_GATEWAY.Cash];
  const [paymentMethods, setPaymentMethods] = useState<number[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<number>();
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [isCash, setIsCash] = useState(false);
  const [dataForCashModal, setDataForCashModal] = useState<DataForCashModal>();
  const inputRef = useRef(null as any);
  const [unitPrice, setUnitPrice] = useState<string>();
  const { showLoading, hideLoading } = useLoadingContext();
  const [openNotify, setOpenNotify] = useState(false);
  const [errorMessageMoMo, setErrorMessageMoMo] = useState("");
  const listUnitPriceVND = ["vnd", "vnđ"];
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    clearErrors
  } = useForm();

  const onSubmit = () => {
    switch (paymentMethod) {
      case PAYMENT_GATEWAY.Cash:
        const data = {
          tableName: paymentDetail.tableName,
          transactionId: paymentDetail.transactionId,
          timeIn: toBrowserTime(paymentDetail.transactionStartDate, t("datetimeFormatStringHM")),
          timeOut: moment(new Date()).format(t("datetimeFormatStringHM")),
          quantity: paymentDetail.totalProductOrder,
          totalPrice: paymentDetail.total,
        } as DataForCashModal;

        setDataForCashModal(data);
        setIsCash(true);
        break;
      case PAYMENT_GATEWAY.OnePay:
        paymentByOnepay();
        break;
      case PAYMENT_GATEWAY.MoMo:
        PaymentMoMo();
        break;
      default:
        toast.error(t("validation.errorMessage"));
        break;
    }
  };

  const PaymentMoMo = async () => {
    try {
      if (!(unitPrice && listUnitPriceVND.includes(unitPrice.toLocaleLowerCase()))){
        setErrorMessageMoMo("user.paymentDetail.errors.moMoNotSupportPayment");
        setOpenNotify(true);
        return;
      }
      if (paymentDetail.total < 1000){
        setErrorMessageMoMo("user.paymentDetail.errors.minimumAmount");
        setOpenNotify(true);
        return;
      }
      const payUrl = await paymentService.paymentMoMo(info.com, info.trans);
      window.location.replace(payUrl);
    } catch (error) {
      toast.error(t("validation.errorMessage"));
    }
  };

  const paymentByOnepay = async () => {
    try {
      const lang = tokenHelper.getLanguageFromStorage(LANGUAGE_USER);
      const paymentByOnePayModel = {
        transactionId: paymentDetail.transactionId,
        currencyUnit: "VND",
        language: lang ? (lang == "vi" ? "vn" : (lang)) : "en"
      } as PaymentByOnePayModel;

      const payUrl = await paymentService.paymentByOnePay(paymentByOnePayModel);
      window.location.replace(payUrl);
    }
    catch (error) {}
  }

  const handleChoosePaymentMethod = (value: number) => {
    setPaymentMethod(value);
    clearErrors("paymentMethod");
  }

  const checkFocusWhenHasErr = () => {
    if (!isValid) {
      inputRef.current.scrollIntoView({ behavior: "smooth" });
    }
    
    return;
  }

  useEffect(() => {
    showLoading();
    isOrderHistory(true);
    const getPaymentDetail = async () => {
      try {
        const result = await paymentService.getPaymentDetail(info.trans);
        setPaymentDetail(result);
        setIsDisable(result.listSeatOrder && result.listSeatOrder.length < 1);
        hideLoading();
      } catch (err) {
        hideLoading();
        toast.error(t("user.paymentDetail.errors.paymentDetailFailure"));
      }
    };

    const getPaymentMethods = async () => {
      try {
        const rs = await paymentService.getPaymentGateways(info.com);
        setPaymentMethods(rs);
      } catch (err) {
        toast.error(t("user.paymentDetail.errors.paymentMethodsFailure"));
      }
    };

    const getCurrencyUnit = () => {
      const unit = tokenHelper.getPropertyFromStorage(CURRENCY_UNITS);
      setUnitPrice(unit);
    }

    getCurrencyUnit();
    getPaymentDetail();
    getPaymentMethods();
  }, []);

  useEffect(() => {
    const getHeight = () => {
      if (elementRef && elementRef.current && elementRef.current.clientHeight) {
        setHeightBtn(elementRef?.current?.clientHeight + 30);
      }
    };

    getHeight();
  }, []);

  return (
    <div className={styles.content}>
      <HeaderContent
        title={t("user.paymentDetail.title")}
        isBtnLeft={true}
        onBtnLeft={() => history.goBack()}
      ></HeaderContent>
      <div className={styles.main_transaction}>
        <p className="title_modal">{paymentDetail.tableName}</p>
        <p className="text_small">
          {t("user.paymentDetail.transactionId")}：{t("transactionName")}
          {paymentDetail.transactionId}
        </p>
        <p className="text_small">
          {t("user.paymentDetail.timeIn")}：
          {toBrowserTime(
            paymentDetail.transactionStartDate,
            t("datetimeFormatStringHM")
          )}
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.seat_order_list}>
          {paymentDetail.listSeatOrder &&
          paymentDetail.listSeatOrder.length > 0 ? (
            paymentDetail.listSeatOrder.map((seatOrder, index) => {
              return (
                <div className={styles.seat_order_item} key={seatOrder.seatId}>
                  <div className={styles.seat_name}>
                    <p className="text_title">
                      {paymentDetail.isEnableSeat ? (seatOrder.seatId !== 0
                        ? seatOrder.seatName
                        : t("user.paymentDetail.seatUndefined")):''}
                    </p>
                  </div>
                  {seatOrder.listSeatProductOrder &&
                    seatOrder.listSeatProductOrder.length > 0 &&
                    seatOrder.listSeatProductOrder.map(
                      (productOrder, index) => {
                        return (
                          <div
                            className={styles.product_item}
                            key={productOrder.productOrderId}
                          >
                            <div className={styles.product_item_content}>
                              <div
                                className={`${styles.item_left} 
                                      ${
                                        productOrder.listProductOrderOption
                                          .length < 1
                                          ? styles.align_center
                                          : ""
                                      }`}
                              >
                                <span>
                                  <p className="text_16 break_word">
                                    {productOrder.productName} x{" "}
                                    {productOrder.quantity}
                                  </p>
                                  {productOrder.listProductOrderOption.length >
                                    0 && (
                                    <p>
                                      {t(
                                        "user.paymentDetail.seatOrder.options"
                                      )}
                                    </p>
                                  )}
                                  <ul>
                                    {productOrder.listProductOrderOption &&
                                      productOrder.listProductOrderOption
                                        .length > 0 &&
                                      productOrder.listProductOrderOption.map(
                                        (option, index) => {
                                          return (
                                            <li
                                              key={option.productOrderOptionId}
                                            >
                                              <p>{option.productOptionName}</p>
                                            </li>
                                          );
                                        }
                                      )}
                                  </ul>
                                </span>
                              </div>
                              <div className={styles.item_right}>
                                <span className={`${styles.price} text_price`}>
                                  {productOrder.paymentPrice?.toLocaleString(
                                    LOCALE,
                                    OPTION_CURRENCY
                                  )}
                                  {t("unitPrice", {unitPrice: unitPrice})}{" "}
                                </span>
                                <span className="text_small">{t("tax")}</span>
                              </div>
                            </div>
                            <div className={styles.separate}></div>
                          </div>
                        );
                      }
                    )}
                  <div className={styles.total}>
                    <span>{t("user.paymentDetail.seatOrder.total")} :</span>
                    &nbsp;&nbsp;
                    <span className="text_price">
                      {seatOrder.totalPrice?.toLocaleString(
                        LOCALE,
                        OPTION_CURRENCY
                      )}
                      {t("unitPrice", {unitPrice: unitPrice})}
                      <span className="text_small">{t("tax")}</span>
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="mt_24">
              <NoData />
            </div>
          )}
          {paymentDetail.listSeatOrder &&
            paymentDetail.listSeatOrder.length > 0 && (
              <div className={styles.payment_methods}>
                <div className={styles.title_payment_methods}>
                  <p className="text_title">
                    {t("user.paymentDetail.paymentMethods.title")}
                  </p>
                </div>
                <div className={styles.payment}>
                  <p>{t("user.paymentDetail.paymentMethods.subTitle")}</p>
                  <p className={`${styles.required} sub_text`}>
                    {t("user.paymentDetail.paymentMethods.required")}
                  </p>
                  <div className={`${styles.payment_list} mb_8`}>
                    {/* payment method default */}
                    {paymentMethodsDefault.map((paymentMethod, index) => {
                      return (
                        <div key={paymentMethod}>
                          <label className="mt_16">
                            <input
                              {...register("paymentMethod", {
                                required: {
                                  value: true,
                                  message: t("validation.required", {
                                    field: t("user.paymentDetail.paymentMethods.title"),
                                  }),
                                },
                              })}
                              name="paymentMethod"
                              type="radio"
                              value={paymentMethod}
                              onChange={() => handleChoosePaymentMethod(paymentMethod)}
                            />
                            <span className={styles.text_radio}>
                              {t(
                                `${PAYMENT_GATEWAY_LIST.filter(
                                  (x) => x.key == paymentMethod
                                ).map((m) => m.value)}`
                              )}
                            </span>
                          </label>
                        </div>
                      );
                    })}
                    {/* payment methods additional */}
                    {paymentDetail.isEnablePayment &&
                      paymentMethods &&
                      paymentMethods.length > 0 &&
                      paymentMethods.map((item, index) => {
                        return (
                          <div key={item}>
                            <label className="mt_16">
                              <input
                                {...register("paymentMethod", {
                                  required: {
                                    value: true,
                                    message: t("validation.required", {
                                      field: t("user.paymentDetail.paymentMethods.title"),
                                    }),
                                  },
                                })}
                                name="paymentMethod"
                                type="radio"
                                value={item}
                                onChange={() => handleChoosePaymentMethod(item)}
                              />
                              <span className={styles.text_radio}>
                                {t(
                                  `${PAYMENT_GATEWAY_LIST.filter(
                                    (x) => x.key == item
                                  ).map((m) => m.value)}`
                                )}
                              </span>
                            </label>
                          </div>
                        );
                      })}
                      <div ref={inputRef} />
                  </div>
                  {errors.paymentMethod &&
                    ["required"].includes(
                      errors.paymentMethod.type
                    ) && (
                      <span className="validation_message">
                        {errors.paymentMethod.message}
                      </span>
                    )}
                </div>
              </div>
            )}
          <div style={{ height: heightBtn }} className={styles.last_div}></div>
          <div className={styles.payment_total} ref={elementRef}>
            <span className={`${styles.quantity} text_price`}>
              {t("user.paymentDetail.paymentTotal.quantity")}:{" "}
              {paymentDetail.totalProductOrder}
            </span>
            <span className={`${styles.total_price_transaction} text_price`}>
              {t("user.paymentDetail.paymentTotal.total")}：
              {paymentDetail.total?.toLocaleString(LOCALE, OPTION_CURRENCY)}
              {t("unitPrice", {unitPrice: unitPrice})}
              <span className="text_small"> {t("tax")}</span>
            </span>
            <div className={styles.btn_payment}>
              <button type="submit" className={`btn_main`} 
                disabled={isDisable || Array.isArray(errors) || Object.values(errors).toString() != ""} 
                onClick={() => checkFocusWhenHasErr()}>
                {t("user.paymentDetail.btnPayment")}
              </button>
            </div>
          </div>
        </div>
      </form>
      {dataForCashModal && <CashPaymentModal
        title={t("user.paymentDetail.modal.title")}
        message={t("user.paymentDetail.modal.subTitle")}
        moreMessage={t("user.paymentDetail.modal.moreSubTitle")}
        open={isCash}
        textButton={t("close")}
        data={dataForCashModal}
        handleCloseModal={() => setIsCash(false)}
        unitPrice={unitPrice}
      />
      }
       <NotifyModal
        open={openNotify}
        message={t(errorMessageMoMo)}
        textButton={t("close")}
        handleCloseModal={() => setOpenNotify(false)}
      ></NotifyModal>
    </div>
  );
};

export default Payment;
