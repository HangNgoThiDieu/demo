import { FC, useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useTranslation } from "react-i18next";
import { IssuanceTransactionResult } from "types/results/transaction/issuance-transaction.result";
import Config from "config";
import QRCode from "qrcode.react";
import styles from "./index.module.scss";
import { useAuth } from "context/auth";

interface AccountProps {
  open: boolean;
  transaction?: IssuanceTransactionResult;
  handleCloseModal: () => void;
}

const QRCodeModal: FC<AccountProps> = (props: AccountProps) => {
  const { user } = useAuth();

  const { t } = useTranslation();
  const urlQRCOde = (props.transaction?.transactionId 
                    && user?.companyId) 
                      ? `${Config.WEB_DOMAIN}/user/trans?transId=${props.transaction?.transactionId?.toString()}&comId=${user?.companyId}`
                      : '';
  const styleImageQR = {
    border: "1px solid #57524C",
  };
  return (
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
      <text className={styles.title}>{t("modalQrCode.title")}</text>
      <p className={`mt_8 ${styles.table_name}`}>
        {t("modalQrCode.tableName")} : {props.transaction?.tableName}
      </p>
      <p>
        {t("modalQrCode.transactionId")} : T{props.transaction?.transactionId}
      </p>
      <div className={styles.content_modal}>
        <QRCode
          id="qrcode"
          value={urlQRCOde}
          size={240}
          level={"H"}
          includeMargin={true}
          style={styleImageQR}
        />
      </div>
      <div className={styles.button_group}>
        <div className={styles.mt_16}>
          <button
            className={`btn_white`}
            onClick={() => props.handleCloseModal()}
          >
            {t("close")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default QRCodeModal;
