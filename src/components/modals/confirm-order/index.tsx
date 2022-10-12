import { useTranslation } from "react-i18next";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import styles from "./index.module.scss";
import NoData from "components/commons/no-data";
import { CartResult } from "types/results/orders/cart.result";

interface ConfirmProps {
  open: boolean;
  title?: string;
  subTitle?: string;
  textButton: string;
  textCancel: string;
  confirmOrder?: CartResult;
  handleEvent: () => void;
  handleCloseModal: () => void;
}

const ConfirmOrderModal: React.FC<ConfirmProps> = (props: ConfirmProps) => {
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
        <div className="text-center">
          <p className="title_modal">{props.title}</p>
          <p>{props.subTitle}</p>
        </div>
        <div className="mt_16">
          <p className="text_title break_word">{props.confirmOrder?.tableName}</p>
          <p className={styles.text}>
            {t("order.confirmOrder.transactionId")}：T
            {props.confirmOrder?.transactionId}
          </p>
        </div>
        <div className="mt_16">
          {props.confirmOrder &&
          props.confirmOrder.productOrderItems?.length > 0 ? (
            props.confirmOrder.productOrderItems.map((item, index) => (
              <div key={index} className={styles.order_item}>
                <p className="text_title">{item.seatName}</p>
                <p className="text_16 break_word">
                  {item.productName} x {item.productQuantity}
                </p>
                {item.listProductOption && item.listProductOption.length > 0 ? (
                  <p>{t("order.confirmOrder.option")}</p>
                ) : null}
                <ul className={`${styles.list_option} mb_0`}>
                  {item.listProductOption && item.listProductOption.length > 0
                    ? item.listProductOption.map((option, indexOption) => (
                      <li key={indexOption}>
                        <p>{option.name}</p>
                      </li>
                      ))
                    : null}
                </ul>
              </div>
            ))
          ) : (
            <NoData />
          )}
        </div>
        <div className="mt_21">
          <button className="btn_main" onClick={props.handleEvent}>
            {props.textButton}
          </button>
          <div className="mt_16">
            <button className="btn_white" onClick={props.handleCloseModal}>
              {props.textCancel}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ConfirmOrderModal;
