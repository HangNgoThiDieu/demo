import NoData from "components/commons/no-data";
import { t } from "i18next";
import { CartResult } from "types/results/orders/cart.result";
import styles from "./index.module.scss";

interface OrderProps {
  order?: CartResult;
}

const OrderPrint: React.FC<OrderProps> = (props: OrderProps) => {
  return (
    <>
      <div className="m_30">
        <div className="mt_16">
          <p className="text_title">{props.order?.tableName}</p>
          <p className={styles.text}>
          {t("order.confirmOrder.transactionId")}：{t("transactionName")}{props.order?.transactionId}
          </p>
        </div>
        <div className="mt_16">
          {props.order && props.order.productOrderItems.length > 0 ? (
            props.order.productOrderItems.map((item, index) => (
              <span key={index}>
                <p className={styles.text}>
                  {item.productName} x {item.productQuantity}
                </p>
                {item.listProductOption &&
                item.listProductOption.length > 0 ? (
                  <p>{t("order.confirmOrder.option")}</p>
                ) : null}
                <ul className={`${styles.list_option} mb_0`}>
                  {item.listProductOption &&
                  item.listProductOption.length > 0
                    ? item.listProductOption.map((option, indexOption) => (
                      <li key={indexOption}>
                        <p>{option.name}</p>
                      </li>
                      ))
                    : null}
                </ul>
              </span>
            ))
          ) : (
            <NoData />
          )}
        </div>
      </div>
    </>
  );
};

export default OrderPrint;
