import { SeatItemModel } from "types/models/table-setting/seat-item.model";

export interface TableSettingResult {
    id: number;
    name: string;
    listSeat: SeatItemModel[];
}