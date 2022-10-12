import Config from "config";
import { SettingSeatModel } from "types/models/setting/setting-seat.model";
import { DesignStoreSettingModel } from "types/models/store-setting/design/design-setting.model";
import { PaymentStoreSettingModel } from "types/models/store-setting/payment/payment-setting.model";
import { SettingSeatResult } from "types/results/setting/setting-seat.result";
import { DesignStoreSettingResult } from "types/results/store-setting/design/design-settting.result";
import { PaymentStoreSettingResult } from "types/results/store-setting/payment/payment-settting.result";
import api from "utils/api";

const getDesignStoreSetting = async () => {
    return await api.get<DesignStoreSettingResult>(Config.API_URL.GET_DESIGN);
}

const setDesign = async (model: DesignStoreSettingModel) => {
    return await api.putForm<boolean>(Config.API_URL.SET_DESIGN, model);
}

const getSeat = async () => {
    return await api.get<SettingSeatResult>(Config.API_URL.GET_SEAT);
}

const setSeat = async (model: SettingSeatModel) => {
    return await api.put<SettingSeatModel>(Config.API_URL.SET_SEAT, model);
}

const getPaymentStoreSetting = async () => {
    return await api.get<PaymentStoreSettingResult>(Config.API_URL.GET_PAYMENT);
}

const setPayment = async (model: PaymentStoreSettingModel) => {
    return await api.put<PaymentStoreSettingModel>(Config.API_URL.SET_PAYMENT, model);
}

export const settingService = {
    getDesignStoreSetting,
    setDesign,
    getSeat,
    setSeat,
    getPaymentStoreSetting,
    setPayment
}