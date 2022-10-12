import { FC } from "react";
import styles from "./index.module.scss";
import "react-responsive-modal/styles.css";
import { useTranslation } from "react-i18next";
import Config from "config";
import Image from "components/commons/image";
import { ProductSelectItemResult } from "types/results/product/product-select.result";
import { useHistory } from "react-router";
import NoImage from "assets/images/no-image.png";
import { LOCALE, OPTION_CURRENCY } from "utils";
import ImgOptimizeByWebp from "../img-webp";
interface ProductOrderProps {
  url: string;
  product: ProductSelectItemResult;
  transactionId: number;
  orderId?: number;
  companyId?: number;
  unitPrice?: string;
}

const ProductOrder: FC<ProductOrderProps> = (props: ProductOrderProps) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <div
      className={styles.product_select}
      onClick={() =>
        !props.product.isSoldOut &&
        history.push(`/${props.url}${props.product.id}`, {
          orderId: props.orderId,
          transactionId: props.transactionId,
          prevPage: history.location.pathname,
          companyId: props.companyId,
        })
      }
    >
      <div className={styles.group_image}>
        <ImgOptimizeByWebp 
          className={`${styles.image_product} ${
            props.product.isSoldOut && styles.opacity
          }`}
          src={`${
            !props.product?.image
              ? NoImage
              : Config.API_URL.GET_IMAGE + props.product.image
          }`}
          fallback={NoImage}
          type="image/webp"
          alt="product-to-order"
        />
        {props.product.isSoldOut && (
          <div className={`background_main ${styles.sold_out}`}>
            <p className={styles.text_sold_out}>
              {t("order.selectProduct.soldOut")}
            </p>
          </div>
        )}
      </div>

      <div
        className={`${styles.infor_product} ${
          props.product.isSoldOut && styles.opacity
        }`}
      >
        <div>
          <p className={`text_bold break_word`}>{props.product.name}</p>
          <pre>
          <p className={`break_word ${styles.text_description}`}>
            {props.product.description}
          </p>
          </pre>
        </div>
        <div className={styles.flex_row_info}>
          <p
            className={
              props.product.isSoldOut ? `text_price_sold_out` : `price`
            }
          >
            {props.product.paymentPrice.toLocaleString(LOCALE, OPTION_CURRENCY)}
            {t("unitPrice", {unitPrice: props.unitPrice})}
            <span
              className={
                props.product.isSoldOut ? `price_tax_sold_out` : `price_tax`
              }
            >
              {t("tax")}
            </span>
          </p>
          {props.product.isDiscount && (
            <div className="cost_group">
              <p className="cost ml_4">
                {props.product.price.toLocaleString(LOCALE, OPTION_CURRENCY)}
                {t("unitPrice", {unitPrice: props.unitPrice})}
                <span className="cost_tax_gray">{t("tax")}</span>
              </p>
              <div className="cost_line"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductOrder;
