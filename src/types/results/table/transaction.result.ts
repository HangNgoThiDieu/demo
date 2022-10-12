import { TransactionStatus } from "utils/enums";

export interface TransactionResult {
    id: number;
    transactionStatus: TransactionStatus;
    realeaseDate: Date;
    timeIn: Date;
    timeOut: Date;
}