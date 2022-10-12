import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";
import IconCart from "assets/images/icon_cart.svg";
import "react-toastify/dist/ReactToastify.css";
import NoData from "components/commons/no-data";
import { productService } from "services/product.service";
import { useHistory, useParams } from "react-router";
import { ProductSelectResult } from "types/results/product/product-select.result";
import ProductOrder from "components/commons/product-order";
import { toBrowserTime } from "utils/datetime";
import "rmc-tabs/assets/index.css";
import { CategoryResult } from "types/results/master-data/category.result";
import HeaderContent from "components/commons/header-content";
import { CURRENCY_UNITS, LOCALE, OPTION_CURRENCY } from "utils";
import { useLocation } from "react-router-dom";
import ConfirmModal from "components/modals/confirm";
import { orderService } from "services/order.service";
import { toast } from "react-toastify";
import { tokenHelper } from "utils/store-token";
import { useLoadingContext } from "context/loading";

interface SelectProductParams {
  transactionId: number;
}

const SelectProduct = (props: any) => {
  const params = useParams();
  const { transactionId } = params as SelectProductParams;
  const { t } = useTranslation();
  const previousPage = props.location.state?.prevPage;

  const orderId = props.location.state?.orderId | 0;
  const history = useHistory();
  const { showLoading, hideLoading } = useLoadingContext();

  const productOrderDetailRourePart = "/order/product-order/";
  const cartRoutePart = "/cart/";
  const [productSelect, setProductSelect] = useState<ProductSelectResult>();
  const [listCategory, setListCategory] = useState<CategoryResult[]>([]);
  const [categoryActive, setCategpryActive] = useState<number>(0);
  const elementRef = useRef(null as any);
  const [heightBtn, setHeightBtn] = useState(0);
  const [allowed, setAllowed] = useState(false);
  const [nextPageState, setNextPageState] = useState("");
  const [isShowConfirmLeave, setIsShowConfirmLeave] = useState(false);
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

  const getProductSelect = () => {
    productService
      .getProductSelect(transactionId, orderId)
      .then((result) => {
        setProductSelect(result);
        setListCategory(result.categoryList);
        hideLoading();
      })
      .catch((err) => {
        hideLoading();
      });
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
    }

    getCurrencyUnit();
    getHeight();
  }, []);

  useEffect(() => {
    showLoading();
    getProductSelect();
  }, []);

  useEffect(() => {
    if (orderId && orderId > 0) {
      if (previousPage !== nextPageState && nextPageState !== "") {
        history.push("/transaction/" + transactionId);
      }

      if (isAllowed) {
        return history.push(
          `${
            nextPageState &&
            !nextPageState.includes(productOrderDetailRourePart)
              ? nextPageState
              : "/transaction/" + transactionId
          }`
        );
      }

      const unlisten = history.block((location, action) => {
        let nextPage = location.pathname;
        let currentPage = currentLocation.pathname;
        let prevPage = previousPage;

        if ((nextPage === prevPage &&
            nextPage !== currentPage &&
            nextPage.includes(productOrderDetailRourePart) && 
            !window.location.pathname.includes(productOrderDetailRourePart))
          || (nextPage.includes(productOrderDetailRourePart) && nextPage !== prevPage) 
          || nextPage.includes(cartRoutePart)
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
      <div className={`${styles.order_list}`}>
        <HeaderContent title={t("order.selectProduct.title")}></HeaderContent>
        <div className={styles.table_infor}>
          <p className={`title_modal break_word`}>{productSelect?.tableName}</p>
          <p className={`text_small`}>
            {`${t("order.selectProduct.titleTransactionId")} : `}
            {t("transactionName")}
            {productSelect?.transactionId}
          </p>
          <p className={`text_small`}>
            {t("order.selectProduct.timeIn")}
            {` : `}
            {toBrowserTime(productSelect?.timeIn, t("datetimeFormatStringHM"))}
          </p>
        </div>
        <div className={styles.group_category}>
          {listCategory.map((item, index) => {
            return (
              <div
                key={index}
                className={`${styles.item_category}  ${
                  categoryActive == item.id ? `border_category_active` : null
                }`}
                onClick={() => setCategpryActive(item.id)}
              >
                <p
                  className={`${styles.text_category}  ${
                    categoryActive == item.id ? `text_category_active` : null
                  }`}
                >
                  {item.id === 0 ? t("all") : item.name}
                </p>
              </div>
            );
          })}
        </div>
        <div className={styles.background}>
          <div className={styles.count_product}>
            <p>
              {t("order.selectProduct.meal")} ：
              {
                productSelect?.productList.filter(
                  (p) => categoryActive === 0 || p.categoryId === categoryActive
                ).length
              }
            </p>
          </div>
          <div>
            {productSelect?.productList &&
            (categoryActive === 0 ||
              productSelect?.productList.filter(
                (p) => p.categoryId === categoryActive
              ).length > 0) ? (
              productSelect?.productList
                .filter(
                  (p) => categoryActive === 0 || p.categoryId === categoryActive
                )
                .map((item, index) => {
                  return (
                    <ProductOrder
                      key={index}
                      product={item}
                      transactionId={transactionId}
                      orderId={orderId}
                      url={'order/product-order/'}
                      unitPrice={unitPrice}
                    />
                  );
                })
            ) : (
              <div className={styles.background_nodata}>
                <NoData />
              </div>
            )}
          </div>
        </div>
        <div style={{ height: heightBtn }}></div>
        <div className={styles.group_bottom} ref={elementRef}>
          <div
            className={styles.group_cart}
            onClick={() =>
              orderId
                ? history.push(`/cart/${orderId}`, {
                    prevPage: history.location.pathname,
                    transactionId: transactionId
                  })
                : {}
            }
          >
            <img src={IconCart} className={styles.icon_cart} alt="" />
            <div className={`background_main ${styles.count_cart}`}>
              <p className={styles.text_count_card}>
                {productSelect?.countProductOrder}
              </p>
            </div>
          </div>
          <div className={styles.border_right}></div>
          <div className={styles.price}>
            <p className={styles.text_price}>
              {productSelect?.totalMoneyCart.toLocaleString(
                LOCALE,
                OPTION_CURRENCY
              )}
              {t("unitPrice", {unitPrice: unitPrice})}
              <span className={styles.text_tax}>{t("tax")}</span>
            </p>
          </div>
          <button
            disabled={orderId ? false : true}
            className={`btn_main ml_4 ${styles.btn_card}`}
            onClick={() =>
              orderId
                ? history.push(`/cart/${orderId}`, {
                    prevPage: history.location.pathname,
                    transactionId: transactionId
                  })
                : {}
            }
          >
            {t("order.selectProduct.checkCart")}
          </button>
        </div>
        <ConfirmModal
          open={isShowConfirmLeave}
          title={t("order.cart.modal.titleLeave")}
          subTitle={t("order.cart.modal.subTitleLeave")}
          textButton={t("ok")}
          textCancel={t("cancel")}
          handleEvent={() => handleGetOut()}
          handleCloseModal={() => setIsShowConfirmLeave(false)}
        ></ConfirmModal>
      </div>
    </>
  );
};

export default SelectProduct;
