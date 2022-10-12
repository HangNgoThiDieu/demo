import { WorkingTimeStoreModel } from "./working-time-store.models";

export interface EditStoreModel {
    storeName: string;
    address: string;
    phoneNumber: string;
    email: string;
    currencyUnit: string;
    language: number;
}
