export interface TransactionInfoResult {
  transactionId: number;
  tableName: string;
  transactionStartDate: Date;
  transactionEndDate: Date;
  totalPayment: number;
  transactionStatus: number;
}