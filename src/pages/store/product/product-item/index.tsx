import React from "react";
import { ProductResult } from "types/results/product/product.result";
import styles from "../index.module.scss";
import Config from "config";
import NoImage from "assets/images/no-image.png";
import ICON_TRASH from "assets/images/icon_delete.svg";
import { LOCALE, OPTION_CURRENCY } from "utils";
import ImgOptimizeByWebp from "components/commons/img-webp";

export default ({
  item,
  index,
  unitPrice,
  t,
  history,
  setProductId,
  setIsDeleteModal,
  setProductName,
}: {
  item: ProductResult;
  index: number;
  unitPrice: string | undefined;
  t: any;
  history: any;
  setProductId: React.Dispatch<React.SetStateAction<number>>;
  setIsDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setProductName: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div key={index}>
      <li key={index} className={styles.product_item_box} onClick={() => history.push(`/product/${item.id}`)}>
        <div
          className={styles.left_product}
        >
          <div>
            <ImgOptimizeByWebp
              className={styles.image_product}
              src={`${!item?.imageLink
                ? NoImage
                : Config.API_URL.GET_IMAGE + item.imageLink
                }`}
              fallback={NoImage}
              type="image/webp"
              alt="product-image"
            />
          </div>
          <div className={styles.info_product}>
            <div>
              <p className="text_16 break_word">{item?.productName}</p>
                <pre>
                <p className="sub_text break_word">{item?.description}</p>
                </pre>
            </div>
            <div className={styles.flex_row_info}>
              {item.isDiscounted ? (
                <>
                  <p className={`${styles.item_price} mr_4`}>
                    {item?.paymentPrice.toLocaleString(LOCALE, OPTION_CURRENCY)}
                    {t("unitPrice", { unitPrice: unitPrice })}
                    <span className={styles.product_vat}>
                      {t("product.tax")}
                    </span>
                  </p>
                  {item.paymentPrice && item.price > item.paymentPrice ? (
                    <div className={styles.original_price}>
                      {item?.price.toLocaleString(LOCALE, OPTION_CURRENCY)}
                      {t("unitPrice", { unitPrice: unitPrice })}
                      <span className={styles.product_original_vat}>
                        {t("tax")}
                      </span>
                      <div className={styles.line_through}></div>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className={styles.item_price}>
                  {item?.price.toLocaleString(LOCALE, OPTION_CURRENCY)}
                  {t("unitPrice", { unitPrice: unitPrice })}
                  <span className={styles.product_vat}>{t("product.tax")}</span>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className={styles.right_product}>
          <button
            className={`${styles.button_trash} btn_sub`}
            onClick={(e) => [
              e.stopPropagation(),
              setProductId(item.id),
              setIsDeleteModal(true),
              setProductName(item.productName),
            ]}
          >
            <img src={ICON_TRASH} alt="icon_trash" />
          </button>
        </div>
      </li>
    </div>
  );
};
