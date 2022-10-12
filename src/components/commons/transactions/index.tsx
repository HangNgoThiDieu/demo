import { FC } from "react";
import styles from "./index.module.scss";
import iconBack from "assets/images/icon_back.svg";
import { TransactionResult } from "types/results/table/transaction.result";
import TransactionItem from "./transaction-item";

interface TransactionListProps {
  transactions?: TransactionResult[];
  unitPrice?: string;
}

const TransactionList: FC<TransactionListProps> = (
  props: TransactionListProps
) => {
  return (
    <>
      {props.transactions?.map((item, i) => {
        return <TransactionItem key={i} transaction={item} unitPrice={props.unitPrice} />;
      })}
    </>
  );
};

export default TransactionList;
