import { style } from "@mui/system";
import { useEffect, useState } from "react";
import { masterDataService } from "services/master-data.service";
import { productService } from "services/product.service";
import { CategoryDemoResult } from "types/results/category/category.result.demo";
import { ProductDemotResult } from "types/results/product/product.result.demo";
import deletePic from "../../../assets/images/icon_delete.svg"
import styles from "./index.module.scss";

const Product = () => {
  const [categoryList, setCategoryList] = useState<CategoryDemoResult[]>([]);
  const [indexActive, setIndexActive] = useState(0);
  const [listProduct, setProductList] = useState<ProductDemotResult[]>([]);

  const getListCategory = async () => {
    const result = await masterDataService.getListCategoryDemo();
    setCategoryList(result);
  };

  const getListProduct = async () => {
    const result = await productService.getListProductDemo();
    setProductList(result);
  };

  useEffect(() => {
    getListCategory();
    getListProduct();
  }, []);

  return (
    <>
      <div className={styles.header}>
        <span className={styles.header_content}>Quản lý sản phẩm</span>
      </div>

      <div className={styles.product_tab}>
        <ul className={styles.category_list}>
          {categoryList.map((item, index) => {
            return index === indexActive ? (
              <li onClick={() => setIndexActive(index)} className={`${styles.category_item} ${styles.active}`}>{item.name}</li>
            ) : (
              <li onClick={() => setIndexActive(index)} className={styles.category_item}>{item.name}</li>
            );
          })}
        </ul>
      </div>

      <div className={styles.product__content}>
        {listProduct.map(item => {
          return (
            <div className={styles.product_item}>
              <div className={styles.product_group}>
                <img className={styles.product_img} src={item.imageLink} alt="" />
                
                <div className="product_name">
                  <div className={styles.product_title}>{item.productName}</div>
                  <div className={styles.product_dec}>{item.description}</div>
                  <div className={styles.product_price}>
                    <p className={styles.product_new}>
                    {item.paymentPrice}
                    </p>
                    <p className={styles.product_vat}>(VAT)</p>
                  </div>
                </div>
              </div>

              <div className={styles.product_price_old}>
                <p className={styles.product_old}>
                {item.price}
                </p>
                <p className={styles.product_vat_old}>(VAT)</p>
              </div>

              <div className={styles.product_delete}>
                <button className={styles.product_delete_icon}>
                  <img src={deletePic} className={styles.product_icon}></img>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  );
};
export default Product;
