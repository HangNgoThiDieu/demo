import HeaderContent from "components/commons/header-content";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import { productService } from "services/product.service";
import { ProductDetailResult } from "types/results/product/product-detail.result";
import styles from "./index.module.scss";
import Config from "config";
import GroupsButtonBottom from "components/commons/group-button-bottom";
import {
  CURRENCY_UNITS,
  DISCOUNT_TYPE,
  LOCALE,
  OPTION_CURRENCY,
  OPTION_TYPE,
} from "utils/constants";
import NoImage from "assets/images/no-image.png";
import ProductRevenueModal from "components/modals/product/revenue";
import { toast } from "react-toastify";
import { ProductSalesResult } from "types/results/product/product-sales.result";
import { ProductRankResult } from "types/results/product/product-rank.result";
import { ProductInfoResult } from "types/results/product/product-info.result";
import { tokenHelper } from "utils/store-token";
import ImgOptimizeByWebp from "components/commons/img-webp";
import { useLoadingContext } from "context/loading";

interface ProductDetailParams {
  productId: number;
}

const ProductDetail = () => {
  const history = useHistory();
  const { showLoading, hideLoading } = useLoadingContext();
  const params = useParams();
  const { productId } = params as ProductDetailParams;
  const { t } = useTranslation();
  const [openProductRevenue, setOpenProductRevenue] = useState(false);

  const [productDetail, setProductDetail] = useState<ProductDetailResult>();
  const [productRevenueInfo, setProductRevenueInfo] =
    useState<ProductInfoResult>({} as ProductInfoResult);
  const [productRevenueRanking, setProductRevenueRanking] =
    useState<ProductRankResult>({} as ProductRankResult);
  const [productRevenueSales, setProductRevenueSales] =
    useState<ProductSalesResult>({} as ProductSalesResult);
  const [unitPrice, setUnitPrice] = useState<string>();

  const getProductDetail = async (productId: number) => {
    try {
      const result = await productService.getProductDetail(productId);
      setProductDetail(result);
      hideLoading();
    } catch (error) {
      hideLoading();
    }
  };

  const priceFormat = () => {
    const price = productDetail?.price.toLocaleString(LOCALE, OPTION_CURRENCY);
    return price;
  };

  const getProductRevenueInfo = (productId: number) => {
    productService
      .getProductRevenueInfo(productId)
      .then((result) => {
        result.price.toLocaleString(LOCALE, OPTION_CURRENCY);
        setProductRevenueInfo(result);
      })
      .catch((err) => {
        toast.error(t("validation.errorMessage"));
      });
  };

  const getProductRevenueRanking = (productId: number) => {
    productService
      .getProductRevenueRanking(productId)
      .then((result) => {
        setProductRevenueRanking(result);
      })
      .catch((err) => {
        toast.error(t("validation.errorMessage"));
      });
  };

  const getProductRevenueSales = (productId: number) => {
    productService
      .getProductRevenueSales(productId)
      .then((result) => {
        result.salesContribution.toLocaleString(LOCALE, OPTION_CURRENCY);
        result.totalSales.toLocaleString(LOCALE, OPTION_CURRENCY);
        setProductRevenueSales(result);
      })
      .catch((err) => {
        toast.error(t("validation.errorMessage"));
      });
  };

  const getProductRevenue = (productId: number) => {
    Promise.all([
      getProductRevenueInfo(productId),
      getProductRevenueRanking(productId),
      getProductRevenueSales(productId),
    ])
      .then(() => {
        setOpenProductRevenue(true);
      })
      .catch((err) => {
        toast.error(t("validation.errorMessage"));
      });
  };

  useEffect(() => {
    const getCurrencyUnit = () => {
      const unit = tokenHelper.getPropertyFromStorage(CURRENCY_UNITS);
      setUnitPrice(unit);
    }
    showLoading();
    getCurrencyUnit();
    getProductDetail(productId);
  }, [productId]);

  return (
    <>
      <div className={styles.content}>
        <HeaderContent
          title={t("product.detail.title")}
          isBtnLeft={true}
          onBtnLeft={() => history.push("/products")}
        />
        <div className={styles.list_product}>
          <ul>
            <li>
              <span className={styles.left_product}>
                {t("product.category")}
              </span>
              <span className={`break_word ${styles.right_product}`}>
                {productDetail?.categoryName}
              </span>
            </li>
            <li>
              <span className={styles.left_product}>
                {t("product.productName")}
              </span>
              <span className={`break_word ${styles.right_product}`}>
                {productDetail?.productName}
              </span>
            </li>
            <li>
              <span className={styles.left_product}>
                {t("product.description")}
              </span>
              <pre>
                <p className={`break_word ${styles.right_product}`}>
                  {productDetail?.description}
                </p>
              </pre>
            </li>
            <li className="mt_35">
              <span className={styles.left_product}>
                {t("product.productImage")} <br />
                <ImgOptimizeByWebp
                  className={`${styles.image_product} mt_4`}
                  src={`${!productDetail?.productImage
                      ? NoImage
                      : Config.API_URL.GET_IMAGE + productDetail?.productImage
                    }`}
                  alt="productImage"
                  fallback={NoImage}
                  type="image/webp"
                />
              </span>
              <span className={styles.right_product}></span>
            </li>
            <li>
              <span className={styles.left_product}>{t("product.price")}</span>
              <span className={styles.right_product}>
                {priceFormat()}
                {t("unitPrice", { unitPrice: unitPrice })}
                <span className={styles.price}>{t("product.tax")}</span>
              </span>
            </li>
            <li>
              <span className={styles.left_product}>
                {t("product.detail.multipleSelect")}
              </span>
              <span className={styles.right_product}>
                {productDetail?.isNotMultipleSelection === true
                  ? `${t("product.detail.notAllowed")}`
                  : `${t("product.detail.allowed")}`}
              </span>
            </li>
            <li>
              <span className={styles.left_product}>
                {t("product.detail.soldOut")}
              </span>
              <span className={styles.right_product}>
                {productDetail?.isSoldOut === true
                  ? `${t("product.detail.soldOut")}`
                  : `${t("product.detail.onSale")}`}
              </span>
            </li>
            <li>
              <span className={styles.left_product}>
                {t("product.detail.menuRelease")}
              </span>
              <span className={styles.right_product}>
                {productDetail?.isMenuPublic === true
                  ? `${t("product.detail.release")}`
                  : `${t("product.detail.private")}`}
              </span>
            </li>
            {productDetail?.isDiscounted && (
              <>
                <li>
                  <span className={styles.left_product}>
                    {t("product.productDiscount")}
                  </span>
                  <span className={styles.right_product}>
                    {productDetail?.discountType == DISCOUNT_TYPE.Currency ?
                      productDetail?.discount?.toLocaleString(
                        LOCALE,
                        OPTION_CURRENCY
                      ) : productDetail?.discount}{" "}
                    {productDetail?.discountType == DISCOUNT_TYPE.Currency
                      ? t("unitPrice", { unitPrice: unitPrice })
                      : "%"}
                  </span>
                </li>
              </>
            )}
            <div className="mt_12">
              <span className={styles.left_product}>
                {t("product.optionTitle")}
              </span>
              {productDetail?.listProductOptionGroup &&
                productDetail.listProductOptionGroup.length > 0 ? (
                productDetail.listProductOptionGroup.map((item, index) => (
                  <div key={index}>
                    {index > 0 ? (
                      <div className={`${styles.line} mt_10 mb_10`}></div>
                    ) : null}
                    <div>
                      <p className="mt_10 break_word">{item.name}</p>
                      <p className="mt_10">
                        {item.isRequired.toString() === "true"
                          ? t("product.settingOptional.groups.required")
                          : t("product.settingOptional.groups.optional")}
                        /
                        {item.optionType == OPTION_TYPE.PickOne
                          ? t("product.settingOptional.groups.radioType")
                          : t("product.settingOptional.groups.checkboxType")}
                      </p>
                      {item.listProductOption &&
                        item.listProductOption.length > 0 &&
                        item.listProductOption.map((option, optionIndex) => (
                          <p key={optionIndex} className="mt_10 break_word">
                            {option.name} : {option.optionAmount > 0 && "+"}{" "}
                            {option?.optionAmount?.toLocaleString(
                              LOCALE,
                              OPTION_CURRENCY
                            )}
                            {t("unitPrice", { unitPrice: unitPrice })}
                          </p>
                        ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>{t("product.noOption")}</p>
              )}
              <div className={`${styles.line_option} mt_10 mb_10`}></div>
            </div>
          </ul>
        </div>
        <GroupsButtonBottom
          textButtonLeft={t("product.detail.buttonSaleInfo")}
          textButtonRight={t("product.detail.buttonEditProduct")}
          handleButtonLeft={() => productDetail && getProductRevenue(productId)}
          handleButtonRight={() =>
            productDetail?.id !== undefined &&
            productDetail.id !== null &&
            history.push(`/product/edit/${productDetail?.id}`)
          }
          isDisable={!productDetail}
        />
        {openProductRevenue && <ProductRevenueModal
          open={openProductRevenue}
          title={t("product.revenue.title")}
          textButton={t("cancel")}
          productInfo={productRevenueInfo}
          productRanking={productRevenueRanking}
          productSales={productRevenueSales}
          handleCloseModal={() => setOpenProductRevenue(false)}
          unitPrice={unitPrice}
        ></ProductRevenueModal>}
      </div>
    </>
  );
};
export default ProductDetail;
