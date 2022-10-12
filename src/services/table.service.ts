import { TableSettingResult } from "types/results/table/table-setting.result";
import { TableDetailResult } from "types/results/table/table-detail.result";
import { FilterListTableModel } from "types/models/filter-list-table.model";
import { ListTableResult } from "types/results/table/list-table.result";
import Config from "../config";
import api from "../utils/api";
import { TableEditModel } from "types/models/table-setting/table-edit.model";
import { FilterTransactionsModel } from "types/models/filter-transactions.model";
import { TableAddModel } from "types/models/table-setting/table-add.model";

const addTable = async (model: TableAddModel ) => {
	return await api.post<void>(Config.API_URL.ADD_TABLE, model);
}

const editTable = async (model: TableEditModel ) => {
	return await api.put<void>(Config.API_URL.EDIT_TABLE, model);
}

const getListTable = async (model: FilterListTableModel) => {
	return await api.post<ListTableResult[]>(Config.API_URL.LIST_TABLE, model);
}

const deleteTable = async (id: number) => {
	return await api.delete(Config.API_URL.DELETE_TABLE(id));
}

const getTableSettingList = async () => {
    return await api.get<TableSettingResult[]>(Config.API_URL.TABLE_SETTING);
}

const getTableDetail = async (tableId: number,model: FilterTransactionsModel) => {
	return await api.get<TableDetailResult>(Config.API_URL.GET_TABLE(tableId), model);
}

export const tableService = {
    addTable,
    editTable,
    getListTable,
    deleteTable,
    getTableSettingList,
    getTableDetail
}