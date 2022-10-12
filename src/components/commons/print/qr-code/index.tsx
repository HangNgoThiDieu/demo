import { useTranslation } from "react-i18next";
import { IssuanceTransactionResult } from "types/results/transaction/issuance-transaction.result";
import QRCode from "qrcode.react";
import Config from "config";
import { useAuth } from "context/auth";

interface QRCodeProps {
  transaction?: IssuanceTransactionResult;
}

const QRCodePrint: React.FC<QRCodeProps> = (props: QRCodeProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const urlQRCOde = `${Config.WEB_DOMAIN}/user/trans?transId=${props.transaction?.transactionId?.toString()}&comId=${user?.companyId}`

  return (
    <>
      <div className="m_30">
        <p>
          {t("modalQrCode.tableName")} : {props.transaction?.tableName}
        </p>
        <p>
          {t("modalQrCode.transactionId")} : T{props.transaction?.transactionId}
        </p>
        <QRCode
          id="qrcode"
          value={urlQRCOde}
          size={150}
          level={"H"}
          includeMargin={true}
        />
      </div>
    </>
  );
};

export default QRCodePrint;
