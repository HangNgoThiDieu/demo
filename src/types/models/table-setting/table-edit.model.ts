import { SeatItemModel } from "./seat-item.model";

export interface TableEditModel {
    id: number;
    name: string;
    listSeat: SeatItemModel[];
}