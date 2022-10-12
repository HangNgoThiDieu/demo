import { EditStoreModel } from "types/models/store-setting/edit-store.models";
import { PagedResult } from "types/paged-result";
import { StoreInformationResult } from "types/results/store-setting/store-information.result";
import { StoreNotificationResult } from "types/results/store-setting/store-notification.result";
import Config from "../config";
import api from "../utils/api";

const getStoreInformation = async () => {
  return await api.get<StoreInformationResult>(Config.API_URL.STORE_SETTING);
};

const getStoreLogo = async () => {
  return await api.get<string>(Config.API_URL.GET_STORE_LOGO);
};

const editStore = async (model: EditStoreModel) => {
  return await api.put<boolean>(Config.API_URL.EDIT_STORE, model);
};

const getNotificationList = async (page: number, pageSize: number) => {
  return await api.post<PagedResult<StoreNotificationResult>>(
    Config.API_URL.GET_NOTIFICATION_LIST,
    { page, pageSize }
  );
};

const getLanguageStore = async () => {
  return await api.get<number>(Config.API_URL.GET_LANGUAGE);
};

export const storeSettingService = {
  getStoreInformation,
  getStoreLogo,
  editStore,
  getNotificationList,
  getLanguageStore
};
