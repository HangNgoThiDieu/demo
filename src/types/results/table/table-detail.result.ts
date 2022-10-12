import { TransactionResult } from "./transaction.result";

export interface TableDetailResult{
    id: number;
    name: string;
    transactions: TransactionResult[];
}