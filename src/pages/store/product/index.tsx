import { useEffect, useRef, useState } from "react";
import HeaderContent from "components/commons/header-content";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";
import { CategoryResult } from "types/results/category/category.result";
import { masterDataService } from "services/master-data.service";
import { productService } from "services/product.service";
import NoData from "components/commons/no-data";
import { ProductResult } from "types/results/product/product.result";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import ConfirmModal from "components/modals/confirm";
import NotifyModal from "components/modals/notify";
import { ADD_PRODUCT, CURRENCY_UNITS } from "utils/constants";
import { tokenHelper } from "utils/store-token";
import ProductItems from "../product/product-item";
import CategoryItems from "../product/category-item";
import { useLoadingContext } from "context/loading";

const Product = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { showLoading, hideLoading } = useLoadingContext();

  const [category, setCategory] = useState<CategoryResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [listProduct, setListProduct] = useState<ProductResult[]>();
  const [categoryActive, setCategoryActive] = useState<number>(0);
  const [productId, setProductId] = useState<number>(-1);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [productName, setProductName] = useState<string>("");
  const [openNotify, setOpenNotify] = useState(false);
  const [heightBtn, setHeightBtn] = useState(0);
  const elementRef = useRef(null as any);
  const [isSubmited, setIsSubmited] = useState(false);
  const [unitPrice, setUnitPrice] = useState<string>();

  const getListCategory = async () => {
    try {
      const result = await masterDataService.getListCategory();
      const items = result.map((i) => {
        if (i.id == 0) {
          i.name = t("all");
        }
        return i;
      });
      setCategory(items);
    } catch (error) {
      hideLoading();
    }
  };

  const getListProduct = async () => {
    try {
      const result = await productService.getListProduct();
      setListProduct(result);
      hideLoading();
    } catch (error) {
      hideLoading();
    }
  };

  const handleDelete = (productId: number) => {
    if (!isSubmited) {
      setIsSubmited(true);
      productService
        .deleteProduct(productId)
        .then((rs) => {
          setIsSubmited(false);
          setIsDeleteModal(false);
          setOpenNotify(true);
          getListProduct();
        })
        .catch((err) => {
          setIsSubmited(false);
          setIsDeleteModal(false);
          toast.error(t("validation.errorMessage"));
        });
    }
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
    getListCategory();
    getListProduct();
  }, []);

  return (
    <>
      <div className={styles.content}>
        <HeaderContent
          titleStyle={styles.title_style}
          title={t("product.title")}
          isBtnLeft={false}
        />
        <div className={styles.tab_list}>
          <ul>
            {category &&
              category?.map((item, index, e) => (
                <CategoryItems
                  key={item.id}
                  item={item}
                  index={index}
                  activeIndex={activeIndex}
                  setCategoryActive={setCategoryActive}
                  setActiveIndex={setActiveIndex}
                />
              ))}
          </ul>
        </div>
        <div className={styles.list_product}>
          <ul>
            {listProduct &&
              listProduct.length > 0 &&
              (categoryActive === 0 ||
                listProduct.filter((p) => p.categoryId === categoryActive)
                  .length > 0) &&
              listProduct
                .filter(
                  (p) => categoryActive === 0 || p.categoryId === categoryActive
                )
                .map((item, index) => (
                  <ProductItems
                    key={item.id}
                    item={item}
                    index={index}
                    unitPrice={unitPrice}
                    setProductId={setProductId}
                    setIsDeleteModal={setIsDeleteModal}
                    setProductName={setProductName}
                    t={t}
                    history={history}
                  />
                ))}
            {listProduct && listProduct.length < 1 && (
              <li className={styles.no_data}>
                <NoData />
              </li>
            )}
          </ul>
        </div>
        <div style={{ height: heightBtn }}></div>
        <div className={`${styles.form_button}`} ref={elementRef}>
          <button
            className="btn_main"
            onClick={() => history.push(`${ADD_PRODUCT}`)}
          >
            {t("product.buttonAddProduct")}
          </button>
        </div>

        <ConfirmModal
          id={productId}
          open={isDeleteModal}
          title={t("product.delete.title")}
          subTitle={t("product.delete.confirmText", { name: productName })}
          textButton={t("product.delete.modal.btnDelete")}
          textCancel={t("cancel")}
          handleEvent={() => handleDelete(productId)}
          handleCloseModal={() => setIsDeleteModal(false)}
        />
        <NotifyModal
          open={openNotify}
          message={t("product.delete.successMessage", { name: productName })}
          title={""}
          textButton={t("close")}
          handleCloseModal={() => setOpenNotify(false)}
        ></NotifyModal>
      </div>
    </>
  );
};
export default Product;
