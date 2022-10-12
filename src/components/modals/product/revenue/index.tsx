import { useTranslation } from "react-i18next";
import { Modal } from "react-responsive-modal";
import styles from "./index.module.scss";
import "react-responsive-modal/styles.css";
import { ProductInfoResult } from "types/results/product/product-info.result";
import { ProductRankResult } from "types/results/product/product-rank.result";
import { ProductSalesResult } from "types/results/product/product-sales.result";
import Image from "components/commons/image";
import Config from "config";
import { LOCALE, OPTION_CURRENCY } from "utils";
import ImgOptimizeByWebp from "components/commons/img-webp";
import NoImage from "assets/images/no-image.png";

interface ProductRevenueProps {
  open: boolean;
  title?: string;
  textButton: string;
  productInfo: ProductInfoResult;
  productRanking: ProductRankResult;
  productSales: ProductSalesResult;
  handleCloseModal: (e?: any) => void;
  unitPrice?: string;
}

const ProductRevenueModal: React.FC<ProductRevenueProps> = (
  props: ProductRevenueProps
) => {
  const { t } = useTranslation();

  return (
    <>
      <Modal
        open={props.open}
        onClose={() => {}}
        center
        showCloseIcon={false}
        classNames={{
          overlay: styles.custom_overlay,
          modal: styles.custom_modal,
        }}
      >
        <div className={styles.wrapper_content}>
          <div className="text-center">
            {props.title && (
              <label className="title_modal">{props.title}</label>
            )}
          </div>
          <div className="mt_22">
            <div className={styles.element}>
              <p className="text_bold">{t("product.category")}</p>
              <p>{props.productInfo.categoryName}</p>
            </div>
            <div className={`${styles.line} mt_10 mb_10`}></div>
            <div className={styles.element}>
              <p className="text_bold">{t("product.productName")}</p>
              <p>{props.productInfo.productName}</p>
            </div>
            <div className={`${styles.line} mt_10 mb_10`}></div>
            <div className={styles.element}>
              <p className="text_bold">{t("product.description")}</p>
              <p>{props.productInfo.productDescription}</p>
            </div>
            <div className={`${styles.line} mt_10 mb_10`}></div>
            <p className="text_bold">{t("product.productImage")}</p>
            <div className="main">
              {props.productInfo.productImage && (
                <ImgOptimizeByWebp 
                  className={styles.image_product}
                  src={`${Config.API_URL.GET_IMAGE}${props.productInfo.productImage}`}
                  fallback={NoImage}
                  type="image/webp"
                  alt="product-detail-image"
                />
              )}
            </div>

            <div className={`${styles.element} mt_24`}>
              <p className="text_bold">{t("product.price")}</p>
              <div>
                {props.productInfo.price?.toLocaleString(LOCALE,OPTION_CURRENCY)}
                {t("unitPrice", {unitPrice: props.unitPrice})}
                <span className={styles.price}>{t("product.tax")}</span>
              </div>
            </div>
            <div className={`${styles.line} mt_10 mb_10`}></div>
            <div className={styles.element}>
              <p className="text_bold">{t("product.revenue.rankingMonth")}</p>
              <div>
                <p>{props.productRanking.productSalesRank}</p>
              </div>
            </div>
            <div className={`${styles.line} mt_10 mb_10`}></div>
            <div className={styles.element}>
              <p className="text_bold">
                {t("product.revenue.categoryRankingMonth")}
              </p>
              <div>
                <p>{props.productRanking.productSalesRankByCategory}</p>
              </div>
            </div>
            <div className={`${styles.line} mt_10 mb_10`}></div>
            <div className={styles.element}>
              <p className="text_bold">{t("product.revenue.numberOfOrder")}</p>
              <div>
                <p>
                  {t("product.revenue.thisMonth")} {props.productRanking.timesOfMonth}／
                  {t("product.revenue.thisWeek")} {props.productRanking.timesOfWeek}／
                  {t("product.revenue.thisDay")} {props.productRanking.timesOfToday}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.form_total}>
          <span className="text_title">
            {t("product.revenue.totalSales")} : {props.productSales.totalSales?.toLocaleString(LOCALE,OPTION_CURRENCY)}
            {t("unitPrice", {unitPrice: props.unitPrice})}
          </span>
          <span>{t("tax")}</span>
          <p className="text_title">
            {t("product.revenue.salesContribution")}{" "}
            {props.productSales.salesContribution}%
          </p>
          <div className={styles.button_group}>
            <div className="mt_16">
              <button className="btn_white" onClick={props.handleCloseModal}>
                {props.textButton}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ProductRevenueModal;
