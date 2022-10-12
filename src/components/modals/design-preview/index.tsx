import { useTranslation } from "react-i18next";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import Carousel from "react-bootstrap/Carousel";
import { useAuth } from "context/auth";
import menu from "assets/images/menu.svg";
import "./custom-carousel.scss";
import ImgProduct1 from "assets/images/img_product_1.svg";
import ImgProduct2 from "assets/images/img_product_2.svg";
import Image from "components/commons/image";
import IconCart from "assets/images/icon_cart.svg";
import country from "assets/images/icon_japanese.svg";
import IconDown from "assets/images/icon_down.svg";
import IconRight from "assets/images/icon_right.svg";
import { useForm } from "react-hook-form";
import Config from "config";
import { ImageType } from "react-images-uploading";
import styles from "./index.module.scss";
import ImgOptimizeByWebp from "components/commons/img-webp";
import NoImage from "assets/images/no-image.png";

interface DesignPreviewProps {
  open: boolean;
  title?: string;
  textButton: string;
  textCancel: string;
  handleEventDesign: (data: any) => void;
  handleCloseModal: (e?: any) => void;
  mainColor: string;
  subColor: string;
  accentColor: string;
  textColor: string;
  logoOld?: string;
  logoNew?: ImageType[];
  unitPrice?: string;
}

const DesignPreviewModal: React.FC<DesignPreviewProps> = (
  props: DesignPreviewProps
) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

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
        <div className={`text-center ${styles.mb_16}`}>
          <label className="title_modal">{props.title}</label>
        </div>
        <form onSubmit={handleSubmit(props.handleEventDesign)}>
          <Carousel interval={null}>
            <Carousel.Item>
              <div className={`${styles.top} ${styles.background}`}>
                <div className={styles.root}>
                  <div className={styles.box_login}>
                    <div className={styles.logo}>
                      {props.logoOld && (
                        <ImgOptimizeByWebp
                          className={`img-fluid w-40 ${styles.logo_img}`}
                          src={`${Config.API_URL.GET_IMAGE}${props.logoOld}`}
                          fallback={NoImage}
                          type="image/webp"
                          alt="logoCompany"
                        />
                      )}
                      {props.logoNew &&
                        props.logoNew.length > 0 &&
                        props.logoNew.map((image, index) => (
                          <div key={index}>
                            <ImgOptimizeByWebp
                              className={`img-fluid w-40 ${styles.logo_img}`}
                              src={image["data_url"]}
                              fallback={NoImage}
                              type="image/webp"
                              alt="logoCompany"
                            />
                          </div>
                        ))}
                    </div>
                    <span
                      style={{ color: props.textColor }}
                      className="text_title"
                    >
                      {user?.fullname ?? ""}
                    </span>
                    <div className={styles.div_menu}>
                      <img className={styles.menu_icon} src={menu} alt="Menu" />
                    </div>
                  </div>
                </div>
                <div className={styles.header_content}>
                  <div className={styles.box_header_content}>
                    <div className={styles.box_title}>
                      <label
                        style={{ color: props.textColor }}
                        className={`text_title ${styles.title}`}
                      >
                        {t("top.header")}
                      </label>
                    </div>
                  </div>
                </div>
                <div className={styles.body_top}>
                  <div className={styles.notifications}>
                    <p style={{ color: props.textColor }}>
                      {t("storeSetting.designPreview.top.notification")}
                    </p>
                    <div className={styles.line}></div>
                    <p style={{ color: props.textColor }}>
                      {t("storeSetting.designPreview.top.notification")}
                    </p>
                    <div className={styles.line}></div>
                    <p style={{ color: props.textColor }}>
                      {t("storeSetting.designPreview.top.notification")}
                    </p>
                    <div className={styles.line}></div>
                    <p style={{ color: props.textColor }}>
                      {t("storeSetting.designPreview.top.notification")}
                    </p>
                    <div className={styles.line}></div>
                    <p style={{ color: props.textColor }}>
                      {t("storeSetting.designPreview.top.notification")}
                    </p>
                  </div>
                  <div className={styles.group_buttons}>
                    <button
                      type="button"
                      style={{
                        backgroundColor: props.subColor,
                        borderColor: props.subColor,
                      }}
                      className="btn_sub mb_16"
                    >
                      {t("accountManagement")}
                    </button>
                    <button
                      type="button"
                      style={{
                        backgroundColor: props.subColor,
                        borderColor: props.subColor,
                      }}
                      className="btn_sub mb_16"
                    >
                      {t("analysisManagement")}
                    </button>
                    <button
                      type="button"
                      style={{
                        backgroundColor: props.subColor,
                        borderColor: props.subColor,
                      }}
                      className="btn_sub mb_16"
                    >
                      {t("productManagement")}
                    </button>
                  </div>
                </div>
                <div className={styles.form_button}>
                  <button className="btn_white mr_4" type="button">
                    {t("top.buttonLeft")}
                  </button>
                  <button
                    type="button"
                    style={{
                      backgroundColor: props.mainColor,
                      borderColor: props.mainColor,
                    }}
                    className={`btn_main ml_4 ${styles.btn_table}`}
                  >
                    {t("top.buttonRight")}
                  </button>
                </div>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className={`${styles.product} ${styles.background}`}>
                <div className={styles.root}>
                  <div className={styles.box_login}>
                    <div className={styles.logo}>
                      {props.logoOld && (
                        <ImgOptimizeByWebp
                          className={`img-fluid w-40 ${styles.logo_img}`}
                          src={`${Config.API_URL.GET_IMAGE}${props.logoOld}`}
                          fallback={NoImage}
                          type="image/webp"
                          alt="logoCompany"
                        />
                      )}
                      {props.logoNew &&
                        props.logoNew.length > 0 &&
                        props.logoNew.map((image, index) => (
                          <div key={index}>
                            <ImgOptimizeByWebp
                              className={`img-fluid w-40 ${styles.logo_img}`}
                              src={image["data_url"]}
                              fallback={NoImage}
                              type="image/webp"
                              alt="logoCompany"
                            />
                          </div>
                        ))}
                    </div>
                    <span
                      style={{ color: props.textColor }}
                      className="text_title"
                    >
                      {user?.fullname ?? ""}
                    </span>
                    <div className={styles.div_menu}>
                      <img className={styles.menu_icon} src={menu} alt="Menu" />
                    </div>
                  </div>
                </div>
                <div className={styles.header_content}>
                  <div className={styles.box_header_content}>
                    <div className={styles.box_title}>
                      <label
                        style={{ color: props.textColor }}
                        className={`text_title ${styles.title}`}
                      >
                        {t("order.selectProduct.title")}
                      </label>
                    </div>
                  </div>
                </div>
                <div className={styles.table_infor}>
                  <p style={{ color: props.textColor }} className="title_modal">
                    {t("storeSetting.designPreview.table")}
                  </p>
                  <p style={{ color: props.textColor }} className="text_small">
                    {t("storeSetting.designPreview.transaction")}
                  </p>
                  <p style={{ color: props.textColor }} className="text_small">
                    {t("storeSetting.designPreview.timeIn")}
                  </p>
                </div>
                <div className={styles.group_category}>
                  <div
                    style={{ borderColor: props.mainColor }}
                    className={styles.item_category}
                  >
                    <p
                      style={{ color: props.mainColor }}
                      className={styles.text_category}
                    >
                      {t("storeSetting.designPreview.product.category1")}
                    </p>
                  </div>
                  <div className={styles.item_category}>
                    <p className={`${styles.text_category}`}>
                      {t("storeSetting.designPreview.product.category2")}
                    </p>
                  </div>
                  <div className={styles.item_category}>
                    <p className={`${styles.text_category}`}>
                      {t("storeSetting.designPreview.product.category3")}
                    </p>
                  </div>
                  <div className={styles.item_category}>
                    <p className={`${styles.text_category}`}>
                      {t("storeSetting.designPreview.product.category4")}
                    </p>
                  </div>
                  <div className={styles.item_category}>
                    <p className={`${styles.text_category}`}>
                      {t("storeSetting.designPreview.product.category5")}
                    </p>
                  </div>
                </div>
                <div className={styles.count_product}>
                  <p style={{ color: props.textColor }}>
                    {t("order.selectProduct.meal")} : 2
                  </p>
                </div>
                <div className={styles.product_select}>
                  <div className={styles.group_image}>
                    <ImgOptimizeByWebp
                      className={`${styles.image_product}`}
                      src={ImgProduct1}
                      fallback={NoImage}
                      type="image/webp"
                      alt="product-image"
                    />
                  </div>
                  <div className={styles.infor_product}>
                    <p style={{ color: props.textColor }} className="text_bold">
                      {t("storeSetting.designPreview.product.productName")}
                    </p>
                    <p
                      style={{ color: props.textColor }}
                      className={styles.text_description}
                    >
                      {t("storeSetting.designPreview.product.description")}
                    </p>
                    <div className={`${styles.price_flex_wrap} group_price`}>
                      <p className={styles.price}>
                        {t("storeSetting.designPreview.product.price")}
                        {t("unitPrice", { unitPrice: props.unitPrice })}
                        <span className="price_tax">{t("tax")}</span>
                      </p>

                      <div className="cost_group">
                        <p className={styles.cost}>
                          {t("storeSetting.designPreview.product.price")}
                          {t("unitPrice", { unitPrice: props.unitPrice })}
                          <span className="cost_tax_gray">{t("tax")}</span>
                        </p>
                        <div className="cost_line"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.product_select}>
                  <div className={styles.group_image}>
                    <ImgOptimizeByWebp
                      className={`${styles.image_product}`}
                      src={ImgProduct2}
                      fallback={NoImage}
                      type="image/webp"
                      alt="product-image"
                    />
                    <div
                      style={{ backgroundColor: props.accentColor }}
                      className={styles.sold_out}
                    >
                      <p className={styles.text_sold_out}>
                        {t("order.selectProduct.soldOut")}
                      </p>
                    </div>
                  </div>
                  <div className={`${styles.infor_product}`}>
                    <p style={{ color: props.textColor }} className="text_bold">
                      {t("storeSetting.designPreview.product.productName")}
                    </p>
                    <p
                      style={{ color: props.textColor }}
                      className={styles.text_description}
                    >
                      {t("storeSetting.designPreview.product.description")}
                    </p>
                    <div className={`${styles.price_flex_wrap} group_price`}>
                      <p className={styles.text_price_sold_out}>
                        {t("storeSetting.designPreview.product.price")}
                        {t("unitPrice", { unitPrice: props.unitPrice })}
                        <span className={styles.price_tax_sold_out}>
                          {t("tax")}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.group_bottom}>
                  <div className={styles.group_cart}>
                    <img src={IconCart} className={styles.icon_cart} alt="" />
                    <div
                      style={{ backgroundColor: props.mainColor }}
                      className={styles.count_cart}
                    >
                      <p className={styles.text_count_card}>1</p>
                    </div>
                  </div>
                  <div className={styles.border_right}></div>
                  <div className={styles.price}>
                    <p
                      style={{ color: props.textColor }}
                      className={styles.text_price}
                    >
                      {t("storeSetting.designPreview.product.price")}
                      {t("unitPrice", { unitPrice: props.unitPrice })}
                      <span
                        style={{ color: props.textColor }}
                        className={styles.text_tax}
                      >
                        {t("tax")}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    style={{
                      backgroundColor: props.mainColor,
                      borderColor: props.mainColor,
                    }}
                    className={`btn_main ml_4 ${styles.btn_card}`}
                  >
                    {t("order.selectProduct.checkCart")}
                  </button>
                </div>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className={`${styles.top_user} ${styles.background}`}>
                <div className={styles.root}>
                  <div className={styles.box_login}>
                    <div className={styles.logo}></div>
                    <span
                      style={{ color: props.textColor }}
                      className="text_title"
                    >
                      {t("storeSetting.designPreview.topUser.header")}
                    </span>
                    <div className={styles.country}>
                      <img className="img-fluid" src={country} alt="" />
                      <img className="img-fluid ml_12" src={IconDown} alt="" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className={styles.table_infor}>
                    <p
                      style={{ color: props.textColor }}
                      className="title_modal"
                    >
                      {t("storeSetting.designPreview.table")}
                    </p>
                    <p
                      style={{ color: props.textColor }}
                      className="text_small"
                    >
                      {t("storeSetting.designPreview.transaction")}
                    </p>
                    <p
                      style={{ color: props.textColor }}
                      className="text_small"
                    >
                      {t("storeSetting.designPreview.timeIn")}
                    </p>
                  </div>
                  <div className={styles.notifications}>
                    <div className={styles.element_notification}>
                      <p style={{ color: props.textColor }}>
                        <span
                          className={styles.text_notification}
                          style={{ color: props.accentColor }}
                        >
                          {t("storeSetting.designPreview.topUser.attention")}
                        </span>
                        {t("storeSetting.designPreview.topUser.notification")}
                      </p>
                      <img className="img-fluid ml_12" src={IconRight} alt="" />
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.element_notification}>
                      <p style={{ color: props.textColor }}>
                        <span
                          className={styles.text_notification}
                          style={{ color: props.accentColor }}
                        >
                          {t("storeSetting.designPreview.topUser.attention")}
                        </span>
                        {t("storeSetting.designPreview.topUser.notification")}
                      </p>
                      <img className="img-fluid ml_12" src={IconRight} alt="" />
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.element_notification}>
                      <p style={{ color: props.textColor }}>
                        <span
                          className={styles.text_notification}
                          style={{ color: props.accentColor }}
                        >
                          {t("storeSetting.designPreview.topUser.attention")}
                        </span>
                        {t("storeSetting.designPreview.topUser.notification")}
                      </p>
                      <img className="img-fluid ml_12" src={IconRight} alt="" />
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.element_notification}>
                      <p style={{ color: props.textColor }}>
                        <span
                          className={styles.text_notification}
                          style={{ color: props.accentColor }}
                        >
                          {t("storeSetting.designPreview.topUser.attention")}
                        </span>
                        {t("storeSetting.designPreview.topUser.notification")}
                      </p>
                      <img className="img-fluid ml_12" src={IconRight} alt="" />
                    </div>
                    <div className={styles.line}></div>
                  </div>
                  <div className={`${styles.group_buttons} mt_36`}>
                    <button
                      type="button"
                      style={{
                        backgroundColor: props.subColor,
                        borderColor: props.subColor,
                      }}
                      className="btn_sub mb_16"
                    >
                      {t(
                        "storeSetting.designPreview.topUser.buttonOrderHistory"
                      )}
                    </button>
                    <button
                      type="button"
                      style={{
                        backgroundColor: props.subColor,
                        borderColor: props.subColor,
                      }}
                      className="btn_sub mb_16"
                    >
                      {t("storeSetting.designPreview.topUser.buttonBill")}
                    </button>
                  </div>
                  <div className={styles.form_button}>
                    <button
                      type="button"
                      style={{
                        backgroundColor: props.mainColor,
                        borderColor: props.mainColor,
                      }}
                      className="btn_main"
                    >
                      {t("storeSetting.designPreview.topUser.buttonOrderItem")}
                    </button>
                  </div>
                </div>
              </div>
            </Carousel.Item>
          </Carousel>
          <div className={`${styles.button_group} mt_16`}>
            <button type="submit" className="btn_main">
              {props.textButton}
            </button>
            <div className="mt_16">
              <button
                type="button"
                className="btn_white"
                onClick={props.handleCloseModal}
              >
                {props.textCancel}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};
export default DesignPreviewModal;
