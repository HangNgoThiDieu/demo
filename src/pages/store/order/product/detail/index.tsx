import HeaderContent from "components/commons/header-content";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import { orderService } from "services/order.service";
import { OrderProductDetailResult } from "types/results/orders/order-product-detail.result";
import styles from "./index.module.scss";
import IconMinus from "assets/images/icon_minus.svg";
import IconPlus from "assets/images/icon_plus_white.svg";
import Config from "config";
import { useForm } from "react-hook-form";
import {
  ProductOptionGroup,
  ProductOrderForCart,
} from "types/models/order/product-order-for-cart.model";
import { toast } from "react-toastify";
import NoImage from "assets/images/no-image.png";
import { CURRENCY_UNITS, LOCALE, OPTION_CURRENCY } from "utils/constants";
import { OptionType } from "utils/enums";
import { SeatItemResult } from "types/results/orders/seat-items.result";
import SeatListModal from "components/modals/seat-list";
import { settingService } from "services/setting.service";
import { useLocation } from "react-router-dom";
import ConfirmModal from "components/modals/confirm";
import NotifyModal from "components/modals/notify";
import { tokenHelper } from "utils/store-token";
import ImgOptimizeByWebp from "components/commons/img-webp";
import { useLoadingContext } from "context/loading";

interface OrderProductDetailParams {
  productId: number;
}

const OrderProductDetail = (props: any) => {
  const params = useParams();
  const { productId } = params as OrderProductDetailParams;
  const transactionId = props.location.state?.transactionId;
  const orderId = props.location.state?.orderId;
  const { t } = useTranslation();
  const { showLoading, hideLoading } = useLoadingContext();

  const previousPage = props.location.state?.prevPage;
  const productOrderDetailRourePart = "/order/product-order/";

  const [orderProductDetail, setOrderProductDetail] =
    useState<OrderProductDetailResult>();
  const [productOption, setProductOption] = useState<ProductOptionGroup[]>([]);
  const [total, setTotal] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalOption, setTotalOption] = useState<number>(0);
  const history = useHistory();
  const [heightBtn, setHeightBtn] = useState(0);
  const elementRef = useRef(null as any);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [optionId, setOptionId] = useState<number>(0);
  const [seats, setSeats] = useState<SeatItemResult[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [data, setData] = useState<ProductOrderForCart>(
    {} as ProductOrderForCart
  );
  const [seatId, setSeatId] = useState<number>();
  const [isEnableSeat, setIsEnableSeat] = useState<boolean>(false);
  const [isShowConfirmLeave, setIsShowConfirmLeave] = useState(false);
  const [nextPageState, setNextPageState] = useState("");
  const [allowed, setAllowed] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isShowMessage, setIsShowMessage] = useState<boolean>(false);
  const [unitPrice, setUnitPrice] = useState<string>();

  const isAllowed = useMemo(() => {
    return allowed;
  }, [allowed]);

  const currentLocation = useLocation();

  const handleGetOut = async () => {
    try {
      await orderService.deleteOrder(orderId);
      setIsShowConfirmLeave(false);
      setAllowed(true);
    } catch (err) {
      toast.error(t("validation.errorMessage"));
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitted },
  } = useForm<ProductOrderForCart>();

  useEffect(() => {
    var error = document.getElementById("error_option");
    error != null &&
      error.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center",
      });
  }, [errors.listProductOption]);

  const GetOrderProductDetail = async () => {
    try {
      const result = await orderService.getProductOrderDetail(productId);
      setOrderProductDetail(result);
      setTotalPrice(Number(result.productPaymentPrice));
      hideLoading();
    } catch {
      hideLoading();
    }
  };

  const handleTotalPrice = () => {
    let totalPrice =
      orderProductDetail !== undefined
        ? Number(orderProductDetail.productPaymentPrice || 0) * total +
          totalOption * total
        : 0;

    setTotalPrice(totalPrice);
  };

  const handleQuantity = async (type: number) => {
    if (type === 1) {
      let value = total < 1 ? 0 : total - 1;
      if (value > 0) {
        setTotal(value);
      } else {
        setTotal(1);
      }
    } else {
      await orderService.checkMultipleSelection(productId, 0).then((result) => {
        if (result) {
          setIsShowMessage(true);
          return;
        } else {
          let value = total < 1 ? 0 : total + 1;
          if (value > 0) {
            setTotal(value);
          } else {
            setTotal(1);
          }
        }
      });
    }
  };

  const onSubmit = (data: ProductOrderForCart) => {
    data.orderId = orderId;
    data.transactionId = transactionId;
    data.productId = productId;
    data.quantity = total;
    data.paymentPrice = totalPrice;
    data.price = orderProductDetail?.productOriginalPrice || 0;
    data.listProductOrderOptionId = productOption.map((item) => item.id);

    setData(data);
    if (orderId > 0 || (transactionId > 0 && orderId == 0)) {
      orderService
        .checkMultipleSelection(productId, transactionId)
        .then((result) => {
          if (result) {
            setIsShowMessage(true);
            return;
          } else {
            if (isEnableSeat) {
              setIsOpen(true);
            } else {
              handleAddToCart(data);
            }
          }
        });
    } else {
      if (isEnableSeat) {
        setIsOpen(true);
      } else {
        handleAddToCart(data);
      }
    }
  };

  const handleAddToCart = (data: ProductOrderForCart) => {
    if (!isSubmit) {
      setIsSubmit(true);
      data.seatId = seatId;
      orderService
        .addProductToCart(data)
        .then((res) => {
          setIsSubmit(false);
          if (res) {
            history.push(
              `/transaction/${transactionId}/order/select-product/`,
              {
                orderId: res,
                prevPage: history.location.pathname,
              }
            );
          } else {
            toast.error(t("validation.errorMessage"));
          }
        })
        .catch((err) => {
          setIsSubmit(false);
          toast.error(t("validation.errorMessage"));
        });
    }
  };

  const onOptionChange = (
    e: any,
    optionType: number,
    groupId: number,
    optionId: number,
    optionAmount: number,
    isRequired?: boolean,
    oldOptionId?: number
  ) => {
    let listProductOption = [...productOption];

    switch (optionType) {
      case OptionType.Checkbox:
        if (e.target.checked) {
          //add
          listProductOption?.push({
            id: optionId,
            groupId: groupId,
            optionAmount: optionAmount,
          });
        } else {
          //remove
          const indexCheckbox = listProductOption.findIndex(
            (item) => item.id === optionId
          );
          listProductOption.splice(indexCheckbox, 1);
        }
        break;

      case OptionType.RadioButton:
        //check radio button
        // remove group to re-calculator total amount
        const indexRadio = listProductOption.findIndex(
          (item) => item.groupId === groupId
        );

        if (indexRadio != -1) {
          listProductOption.splice(indexRadio, 1);
        }

        if (!isRequired && isRequired != undefined) {
          if (oldOptionId == optionId && isChecked) {
            setIsChecked(false);
          } else {
            setIsChecked(true);
            setOptionId(optionId);

            // add item was checked
            listProductOption?.push({
              id: optionId,
              groupId: groupId,
              optionAmount: optionAmount,
            });
          }
        }

        // if isRequired then required always checked one item
        if (isRequired) {
          listProductOption?.push({
            id: optionId,
            groupId: groupId,
            optionAmount: optionAmount,
          });
        }
        break;

      default:
        break;
    }

    setProductOption(listProductOption);
    let totalAmount = listProductOption.reduce(
      (a, v) => (a = a + v.optionAmount),
      0
    );

    setTotalOption(totalAmount);
  };

  const getHeight = () => {
    if (elementRef && elementRef.current && elementRef.current.clientHeight) {
      setHeightBtn(elementRef?.current?.clientHeight + 10);
    }
  };

  const getSeat = () => {
    settingService
      .getSeat()
      .then((result) => {
        setIsEnableSeat(result.isEnableSeat);
      })
      .catch((e) => {
        toast.error(t("validation.errorMessage"));
      });
  };

  useEffect(() => {
    const getCurrencyUnit = () => {
      const unit = tokenHelper.getPropertyFromStorage(CURRENCY_UNITS);
      setUnitPrice(unit);
    };

    getCurrencyUnit();
    getHeight();
    getSeat();
  }, []);

  useEffect(() => {
    handleTotalPrice();
  }, [total, totalOption]);

  useEffect(() => {
    showLoading();
    GetOrderProductDetail();
  }, [productId]);

  useEffect(() => {
    const getSeatList = async () => {
      try {
        let items: SeatItemResult[] = [];
        items.push({
          id: undefined as any,
          name: t("order.product.detail.seats.undefined"),
        } as SeatItemResult);

        const rs = await orderService.getSeatList(transactionId);
        const result = [...items, ...rs];
        setSeats(result);
      } catch (err) {}
    };

    getSeatList();
  }, [transactionId]);

  useEffect(() => {
    if (orderId && orderId > 0) {
      if (previousPage !== nextPageState && nextPageState !== "") {
        history.push("/");
      }

      if (isAllowed) {
        return history.push(`${nextPageState}`);
      }

      const unlisten = history.block((location, action) => {
        let nextPage = location.pathname;
        let currentPage = currentLocation.pathname;
        let prevPage = previousPage;

        if (
          (nextPage === prevPage && nextPage !== currentPage) ||
          nextPage.includes(productOrderDetailRourePart)
        ) {
          return;
        } else {
          setNextPageState(nextPage);
          setIsShowConfirmLeave(true);
          setAllowed(false);
          return false;
        }
      });
      return function cleanup() {
        unlisten();
      };
    }
  }, [allowed]);

  return (
    <>
      <div className={styles.container}>
        <HeaderContent
          title={t("order.product.detail.title")}
          isBtnLeft={true}
          onBtnLeft={() => history.goBack()}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.content}>
            <div className={styles.product_content}>
              <ImgOptimizeByWebp
                className={styles.image_product}
                src={`${
                  !orderProductDetail?.productImage
                    ? NoImage
                    : Config.API_URL.GET_IMAGE +
                      orderProductDetail?.productImage
                }`}
                alt="product-image"
                fallback={NoImage}
                type="image/webp"
              />
              <div className={styles.image_sub_list}>
                {orderProductDetail?.productSubImages.map((image, i) => {
                  return (
                    <div className={styles.image_sub} key={i}>
                      <ImgOptimizeByWebp
                        className={styles.image_sub_item}
                        src={`${Config.API_URL.GET_IMAGE}${image}`}
                        fallback={NoImage}
                        type="image/webp"
                        alt="sub-image"
                      />
                    </div>
                  );
                })}
              </div>
              <div className={styles.product_sub}>
                <div className={styles.product_item}>
                  <p className="title_modal break_word">
                    {orderProductDetail?.productName}
                  </p>
                  <div className={styles.product_price}>
                    <div className={styles.payment_price}>
                      {orderProductDetail?.productPaymentPrice.toLocaleString(
                        LOCALE,
                        OPTION_CURRENCY
                      )}
                      {t("unitPrice", { unitPrice: unitPrice })}
                      <span className={styles.product_vat}>
                        {t("order.product.detail.vat")}
                      </span>
                    </div>
                    {orderProductDetail?.productPaymentPrice &&
                    orderProductDetail?.productPaymentPrice <
                      orderProductDetail?.productOriginalPrice ? (
                      <div className={styles.original_price}>
                        {orderProductDetail?.productOriginalPrice.toLocaleString(
                          LOCALE,
                          OPTION_CURRENCY
                        )}
                        {t("unitPrice", { unitPrice: unitPrice })}
                        <span className={styles.product_original_vat}>
                          {t("order.product.detail.vat")}
                        </span>
                        <div className="line_through_price"></div>
                      </div>
                    ) : null}
                  </div>
                </div>
                <pre>
                  <p className="text_small break_word">
                    {orderProductDetail?.productDescription}
                  </p>
                </pre>
              </div>
              {orderProductDetail !== undefined &&
                orderProductDetail.listProductOptionGroup.length > 0 && (
                  <p className={`${styles.product_category} title_modal`}>
                    {t("order.product.detail.optionTitle")}
                  </p>
                )}
            </div>
            <div className={styles.product_optionals}>
              {/* option required */}
              {orderProductDetail !== undefined &&
                orderProductDetail.listProductOptionGroup.length > 0 &&
                orderProductDetail.listProductOptionGroup.map((item, index) => {
                  return (
                    <div key={index}>
                      <div className={styles.product_opt}>
                        <div className={styles.opt_title}>
                          <p className="break_word">{item.name}</p>
                          {item.isRequired ? (
                            item.optionType == OptionType.RadioButton ? (
                              <p className={styles.required_text}>
                                {t(
                                  "order.product.detail.options.requiredOpt.required"
                                )}
                              </p>
                            ) : (
                              <>
                                <p className={styles.required_text}>
                                  {t(
                                    "order.product.detail.options.requiredOpt.required"
                                  )}
                                </p>
                                <p className={styles.sub_text}>
                                  {t(
                                    "order.product.detail.options.requiredOpt.chooseMore"
                                  )}
                                </p>
                              </>
                            )
                          ) : item.optionType == OptionType.Checkbox ? (
                            <p className={styles.sub_text}>
                              {t(
                                "order.product.detail.options.requiredOpt.chooseMore"
                              )}
                            </p>
                          ) : (
                            <p></p>
                          )}
                        </div>
                        <div className={styles.opt_radio}>
                          <div className={`form-group ${styles.option_item}`}>
                            {item.listProductOption &&
                              item.listProductOption.length > 0 &&
                              item.listProductOption.map((ops, opsIndex) => {
                                return (
                                  <div key={opsIndex}>
                                    <label key={opsIndex} className="mb_16">
                                      {item.optionType ==
                                      OptionType.RadioButton ? (
                                        item.isRequired ? (
                                          <input
                                            {...register(
                                              `listProductOption.${index}.isChecked` as const,
                                              {
                                                required: {
                                                  value: item.isRequired
                                                    ? true
                                                    : false,
                                                  message: t(
                                                    "validation.required",
                                                    {
                                                      field: item.name,
                                                    }
                                                  ),
                                                },
                                              }
                                            )}
                                            type="radio"
                                            onClick={(e) =>
                                              onOptionChange(
                                                e,
                                                item.optionType,
                                                item.id,
                                                ops.id,
                                                ops.optionAmount,
                                                item.isRequired,
                                                optionId
                                              )
                                            }
                                          />
                                        ) : (
                                          <input
                                            {...register(
                                              `listProductOption.${index}.isChecked` as const,
                                              {
                                                required: {
                                                  value: item.isRequired
                                                    ? true
                                                    : false,
                                                  message: t(
                                                    "validation.required",
                                                    {
                                                      field: item.name,
                                                    }
                                                  ),
                                                },
                                              }
                                            )}
                                            type="radio"
                                            checked={
                                              isChecked && ops.id == optionId
                                            }
                                            onClick={(e) =>
                                              onOptionChange(
                                                e,
                                                item.optionType,
                                                item.id,
                                                ops.id,
                                                ops.optionAmount,
                                                item.isRequired,
                                                optionId
                                              )
                                            }
                                          />
                                        )
                                      ) : (
                                        <input
                                          {...register(
                                            `listProductOption.${index}.isChecked` as const,
                                            {
                                              required: {
                                                value: item.isRequired
                                                  ? true
                                                  : false,
                                                message: t(
                                                  "validation.required",
                                                  {
                                                    field: item.name,
                                                  }
                                                ),
                                              },
                                            }
                                          )}
                                          type="checkbox"
                                          onClick={(e) =>
                                            onOptionChange(
                                              e,
                                              item.optionType,
                                              item.id,
                                              ops.id,
                                              ops.optionAmount,
                                              false,
                                              optionId
                                            )
                                          }
                                        />
                                      )}
                                      <span
                                        className={`break_word ${styles.text_radio}`}
                                      >
                                        {ops.name} :{" "}
                                        {ops.optionAmount > 0 && "+"}{" "}
                                        {ops.optionAmount.toLocaleString(
                                          LOCALE,
                                          OPTION_CURRENCY
                                        )}
                                        {t("unitPrice", {
                                          unitPrice: unitPrice,
                                        })}
                                      </span>
                                    </label>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                        {errors.listProductOption?.map(
                          (error, i) =>
                            index == i && (
                              <span
                                id="error_option"
                                key={i}
                                className={styles.validation_message}
                              >
                                {error?.isChecked?.message}
                              </span>
                            )
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div
            style={{ height: heightBtn }}
            className={styles.div_insert}
          ></div>
          {/* price */}
          <div
            className={`${styles.form_group} ${styles.form_button}`}
            ref={elementRef}
          >
            <div className={styles.under_menu}>
              <div className={styles.price}>
                <span className="text_price">
                  {totalPrice?.toLocaleString(LOCALE, OPTION_CURRENCY)}
                  {t("unitPrice", { unitPrice: unitPrice })}
                </span>
                <span className={styles.product_vat_none}>
                  {t("order.product.detail.vat")}
                </span>
              </div>
              <div className={styles.quantity}>
                <div
                  className={`${styles.minus} minus`}
                  onClick={() => orderProductDetail && handleQuantity(1)}
                >
                  <img src={IconMinus} alt="" />
                </div>
                <div className={styles.product_number}>
                  <p className="text_number">{total}</p>
                </div>
                <div
                  className={`${styles.plus} plus`}
                  onClick={() => orderProductDetail && handleQuantity(2)}
                >
                  <img src={IconPlus} alt="" />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={
                Array.isArray(errors) || Object.values(errors).toString() != ""
              }
              className="btn_main"
            >
              {t("order.product.detail.button.addCart")}
            </button>
          </div>
        </form>

        {isShowConfirmLeave && (
          <ConfirmModal
            open={isShowConfirmLeave}
            title={t("order.cart.modal.titleLeave")}
            subTitle={t("order.cart.modal.subTitleLeave")}
            textButton={t("ok")}
            textCancel={t("cancel")}
            handleEvent={() => handleGetOut()}
            handleCloseModal={() => setIsShowConfirmLeave(false)}
          ></ConfirmModal>
        )}

        {isOpen && (
          <SeatListModal
            open={isOpen}
            title={t("order.product.detail.seats.title")}
            textButton={t("order.product.detail.seats.confirmSeat")}
            textCancel={t("cancel")}
            seats={seats}
            handleCloseModal={() => setIsOpen(false)}
            setSeatId={setSeatId}
            handleEvent={() => handleAddToCart(data)}
          />
        )}
        {isShowMessage && (
          <NotifyModal
            open={isShowMessage}
            message={t("order.product.detail.modal.message")}
            textButton={t("close")}
            handleCloseModal={() => setIsShowMessage(false)}
          ></NotifyModal>
        )}
      </div>
    </>
  );
};
export default OrderProductDetail;
