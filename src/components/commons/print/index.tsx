import React from "react";
import { CartResult } from "types/results/orders/cart.result";
import { IssuanceTransactionResult } from "types/results/transaction/issuance-transaction.result";
import OrderPrint from "./order";
import QRCodePrint from "./qr-code";

interface PrintProps {
  isPayment?: boolean;
  isQRCodeImage?: boolean;
  transaction?: IssuanceTransactionResult;
  order?: CartResult;
}

const Print: React.FC<PrintProps> = (props: PrintProps) => {

  return (
    <>
      <div>
        {props.isPayment && <OrderPrint order={props.order}></OrderPrint>}
        {props.isQRCodeImage && <QRCodePrint transaction={props.transaction}></QRCodePrint>}
      </div>
    </>
  );
};
  
  export default Print;