import Config from "config";
import { CategoryModel } from "types/models/category/category.model";
import { CategoryResult } from "types/results/master-data/category.result";
import api from "utils/api";

const getListCategory = async (orderNew: boolean = false) => {
    return await api.get<CategoryResult[]>(Config.API_URL.LIST_CATEGORY, {orderNew});
}

const addCategory = async (model: CategoryModel ) => {
	return await api.post<boolean>(Config.API_URL.ADD_CATEGORY, model);
}
export const masterDataService = {
    getListCategory,
    addCategory
}