import { useTranslation } from "react-i18next";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import styles from "./index.module.scss";
import { useForm } from "react-hook-form";
import { ProductEditModel } from "types/models/product/product-edit.model";
import { ProductAddModel } from "types/models/product/product-add.model";
import Image from "components/commons/image";
import Config from "config";
import { DISCOUNT_TYPE, LOCALE, OPTION_CURRENCY, OPTION_TYPE } from "utils/constants";
const width = window.innerWidth;

interface ProductProps {
  open: boolean;
  productEdit?: ProductEditModel;
  productAdd?: ProductAddModel;
  isAdd: boolean;
  title: string;
  textButton: string;
  handleEventProduct: (data: any) => void;
  handleCloseModal: () => void;
  unitPrice?: string;
}

const ProductModal: React.FC<ProductProps> = (props: ProductProps) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <>
      <Modal
        open={props.open}
        onClose={props.handleCloseModal}
        center
        showCloseIcon={false}
        classNames={{
          overlay: styles.custom_overlay,
          modal: styles.custom_modal,
        }}
      >
        <div className="text-center">
          <label className="title_modal">{props.title}</label>
        </div>
        <form onSubmit={handleSubmit(props.handleEventProduct)}>
          <div className="mt_22">
            <div className={styles.element}>
              <p className="text_bold">{t("product.category")}</p>
              <p>
                {props.isAdd
                  ? props.productAdd?.categoryName
                  : props.productEdit?.categoryName}
              </p>
            </div>
            <div className={`${styles.line} mt_10 mb_10`}></div>
            <div className={styles.element}>
              <p className="text_bold">{t("product.productName")}</p>
              <p className="break_word">
                {props.isAdd
                  ? props.productAdd?.productName
                  : props.productEdit?.productName}
              </p>
            </div>
            <div className={`${styles.line} mt_10 mb_10`}></div>
            <div className={styles.element}>
              <p className="text_bold">{t("product.description")}</p>
              <pre>
              <p className="break_word">
              {props.isAdd
                    ? props.productAdd?.description
                    : props.productEdit?.description}
              </p>
              </pre>
            </div>
            <div className={`${styles.line} mt_10 mb_10`}></div>
            <p className="text_bold">{t("product.productImage")}</p>
            <div className="main">
              {props.productEdit?.mainImageOld && (
                <Image
                  styleCustom={{ height: width - 56 }}
                  className={styles.image_main_product}
                  src={`${Config.API_URL.GET_IMAGE}${props.productEdit?.mainImageOld}`}
                  alt="productImage"
                />
              )}
              {props.isAdd
                ? props.productAdd?.mainImage &&
                props.productAdd.mainImage.length > 0 &&
                props.productAdd.mainImage.map((image, index) => (
                  <div key={index}>
                    <Image
                      styleCustom={{ height: width - 56 }}
                      className={styles.image_main_product}
                      src={image["data_url"]}
                      alt="productImage"
                    />
                  </div>
                ))
                : props.productEdit?.mainImage &&
                props.productEdit.mainImage.length > 0 &&
                props.productEdit.mainImage.map((image, index) => (
                  <div key={index}>
                    <Image
                      styleCustom={{ height: width - 56 }}
                      className={styles.image_main_product}
                      src={image["data_url"]}
                      alt="productImage"
                    />
                  </div>
                ))}
            </div>
            <div className={styles.image_sub}>
              {props.productEdit?.subImageOld &&
                props.productEdit.subImageOld.map((image, index) => (
                  <div key={index}>
                    <Image
                      className={`${styles.image_product} mt_24`}
                      src={`${Config.API_URL.GET_IMAGE}${image}`}
                      alt="productImage"
                    />
                  </div>
                ))}
              {props.isAdd
                ? props.productAdd?.subImage &&
                props.productAdd.subImage.length > 0 &&
                props.productAdd.subImage.map((image, index) => (
                  <div key={index}>
                    <Image
                      className={`${styles.image_product} pr_10 mt_24`}
                      src={image["data_url"]}
                      alt="productImage"
                    />
                  </div>
                ))
                : props.productEdit?.subImage &&
                props.productEdit.subImage.length > 0 &&
                props.productEdit.subImage.map((image, index) => (
                  <div key={index}>
                    <Image
                      className={`${styles.image_product} mt_24`}
                      src={image["data_url"]}
                      alt="productImage"
                    />
                  </div>
                ))}
            </div>

            <div className={`${styles.element} mt_24`}>
              <p className="text_bold">{t("product.price")}</p>
              <div>
                <p>
                  {props.isAdd
                    ? props.productAdd?.price?.toLocaleString(LOCALE, OPTION_CURRENCY)
                    : props.productEdit?.price?.toLocaleString(LOCALE, OPTION_CURRENCY)}
                  {t("unitPrice", { unitPrice: props.unitPrice })}{t("tax")}
                </p>
              </div>
            </div>
            <div className={`${styles.line} mt_10 mb_10`}></div>
            <div className={styles.element}>
              <p className="text_bold">{t("product.multipleSelect")}</p>
              <p>
                {props.isAdd
                  ? props.productAdd?.isNotMultipleSelection
                    ? `${t("product.notAllowed")}`
                    : `${t("product.allowed")}`
                  : props.productEdit?.isNotMultipleSelection
                    ? `${t("product.notAllowed")}`
                    : `${t("product.allowed")}`}
              </p>
            </div>
            <div className={`${styles.line} mt_10 mb_10`}></div>
            <div className={styles.element}>
              <p className="text_bold">{t("product.soldOut")}</p>
              <p>
                {props.isAdd
                  ? props.productAdd?.isSoldOut
                    ? `${t("product.soldOut")}`
                    : `${t("product.onSale")}`
                  : props.productEdit?.isSoldOut
                    ? `${t("product.soldOut")}`
                    : `${t("product.onSale")}`}
              </p>
            </div>
            <div className={`${styles.line} mt_10 mb_10`}></div>
            <div className={styles.element}>
              <p className="text_bold">{t("product.menuRelease")}</p>
              <p>
                {props.isAdd
                  ? props.productAdd?.isMenuPublic
                    ? `${t("product.release")}`
                    : `${t("product.private")}`
                  : props.productEdit?.isMenuPublic
                    ? `${t("product.release")}`
                    : `${t("product.private")}`}
              </p>
            </div>
            <div className={`${styles.line} mt_10`}></div>
            {props.isAdd ? (
              props.productAdd?.isDiscounted ? (
                <>
                  <div className={`${styles.element} mt_10`}>
                    <p className="text_bold">
                      {t("product.productDiscount")}
                    </p>
                    <p>
                      {props.productAdd?.discountValue?.toLocaleString(LOCALE, OPTION_CURRENCY)}{" "}
                      {props.productAdd?.couponType == DISCOUNT_TYPE.Currency
                        ? t("unitPrice", { unitPrice: props.unitPrice })
                        : "%"}
                    </p>
                  </div>
                  <div className={`${styles.line} mt_10 mb_10`}></div>
                </>
              ) : (
                <div></div>
              )
            ) : props.productEdit?.isDiscounted ? (
              <>
                <div className={`${styles.element} mt_10`}>
                  <p className="text_bold">
                    {t("product.productDiscount")}
                  </p>
                  <p>
                    {props.productEdit?.discount?.toLocaleString(LOCALE, OPTION_CURRENCY)}{" "}
                    {props.productEdit?.couponType == DISCOUNT_TYPE.Currency
                      ? t("unitPrice", { unitPrice: props.unitPrice })
                      : "%"}
                  </p>
                </div>
                <div className={`${styles.line} mt_10 mb_10`}></div>
              </>
            ) : (
              <div></div>
            )}
            {props.isAdd ? (
              <div>
                {props.productAdd?.optionGroupItemList &&
                  props.productAdd?.optionGroupItemList.length > 0 && (
                    <div className="mt_10">
                      <p className="text_bold">{t("product.optionTitle")}</p>
                      {props.productAdd?.optionGroupItemList.map(
                        (group, groupIndex) => (
                          <div key={groupIndex}>
                            <div>
                              <p className="mt_10">{group.optionGroupName}</p>
                              <p className="mt_10">
                                {group.isRequired.toString() === "true"
                                  ? t("product.settingOptional.groups.required")
                                  : t(
                                    "product.settingOptional.groups.optional"
                                  )}
                                /
                                {group.optionType == OPTION_TYPE.PickOne
                                  ? t(
                                    "product.settingOptional.groups.radioType"
                                  )
                                  : t(
                                    "product.settingOptional.groups.checkboxType"
                                  )}
                              </p>
                              {group.optionItemList &&
                                group.optionItemList.length > 0 &&
                                group.optionItemList.map(
                                  (option, optionIndex) => (
                                    <p key={optionIndex} className="mt_10">
                                      {option.optionName} :{" "}
                                      {option.optionAmount > 0 && "+"}{" "}
                                      {option.optionAmount?.toLocaleString(LOCALE, OPTION_CURRENCY)}
                                      {t("unitPrice", { unitPrice: props.unitPrice })}
                                    </p>
                                  )
                                )}
                            </div>
                            <div className={`${styles.line} mt_10 mb_10`}></div>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>
            ) : (
              <div>
                {props.productEdit &&
                  props.productEdit.listProductOptionGroup &&
                  props.productEdit.listProductOptionGroup.length > 0 && (
                    <div className="mt_10">
                      <p className="text_bold">{t("product.optionTitle")}</p>
                      {props.productEdit.listProductOptionGroup.map(
                        (group, groupIndex) => (
                          <div key={groupIndex}>
                            <div>
                              <p className="mt_10">{group.name}</p>
                              <p className="mt_10">
                                {group.isRequired.toString() === "true"
                                  ? t("product.settingOptional.groups.required")
                                  : t(
                                    "product.settingOptional.groups.optional"
                                  )}
                                /
                                {group.optionType == OPTION_TYPE.PickOne
                                  ? t(
                                    "product.settingOptional.groups.radioType"
                                  )
                                  : t(
                                    "product.settingOptional.groups.checkboxType"
                                  )}
                              </p>
                              {group.listProductOption &&
                                group.listProductOption.length > 0 &&
                                group.listProductOption.map(
                                  (option, optionIndex) => (
                                    <p key={optionIndex} className="mt_10">
                                      {option.name} :{" "}
                                      {option.optionAmount > 0 && "+"}{" "}
                                      {option.optionAmount?.toLocaleString(LOCALE, OPTION_CURRENCY)}
                                      {t("unitPrice", { unitPrice: props.unitPrice })}
                                    </p>
                                  )
                                )}
                            </div>
                            <div className={`${styles.line} mt_10 mb_10`}></div>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>
            )}
          </div>
          <div className={`${styles.button_group} mt_16`}>
            <button type="submit" className="btn_main">
              {props.textButton}
            </button>
          </div>
          <div className={`${styles.button_group} mt_16`}>
            <button
              type="button"
              className="btn_white"
              onClick={() => props.handleCloseModal()}
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
export default ProductModal;
