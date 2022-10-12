import Config from "../config";
import api from "../utils/api";
import { AccountDetailResult } from "../types/results/account/account-detail.result";
import { AccountEditModel } from "types/models/account/account-edit.model";
import { SearchAccountModel } from "types/models/search-account.model";
import { SearchAccountResult } from "types/results/search-account.result";
import { AccountAddModel } from "types/models/account/account-add.model";
import { ResetPasswordModel } from "types/models/reset-password/reset-password.model";
import { ForgotPasswordModel } from "types/models/reset-password/forgot-password.model";
import { StoreRolesResult } from "types/results/account/store-roles.result";
import { ChangePasswordModel } from "types/models/change-password/change-password.model";
import { ChangePasswordForStaffModel } from "types/models/change-password-staff/change-password-staff.model";

const getAccountDetail = async (userId: string) => {
	return await api.get<AccountDetailResult>(Config.API_URL.GET_USER(userId), {});
}

const addAccount = async (model: AccountAddModel) => {
	return await api.post<AccountAddModel>(Config.API_URL.USER, model);
}

const checkExistedEmail = async (email: string) => {
	return await api.get<boolean>(Config.API_URL.CHECK_EXISTED_EMAIL, {email:email});
}

const editAccount = async (model: AccountEditModel) => {
	return await api.put<AccountEditModel>(Config.API_URL.USER, model);
}

const getListAccount = async (model: SearchAccountModel) => {
    return await api.get<SearchAccountResult[]>(Config.API_URL.LIST_ACCOUNT, model);
}

const deleteAccount = async (userId: string) => {
	return await api.delete(Config.API_URL.DELETE_ACCOUNT(userId));
}

const resetPassword = async (model: ResetPasswordModel) => {
	return await api.post(Config.API_URL.RESET_PASSWORD, model);
}

const forgotPassword = async (model: ForgotPasswordModel) => {
	return await api.post(Config.API_URL.FORGOT_PASSWORD, model);
}

const getStoreRoles = async () => {
	return await api.get<StoreRolesResult[]>(Config.API_URL.GET_STORE_ROLES);
}

const changePassword = async (model: ChangePasswordModel) => {
	return await api.post(Config.API_URL.CHANGE_PASSWORD, model);
}

const changePasswordForStaff = async (model: ChangePasswordForStaffModel) => {
	return await api.post(Config.API_URL.CHANGE_PASSWORD_STAFF, model);
}

export const accountService = {
	getAccountDetail,
	addAccount,
	checkExistedEmail,
	editAccount,
	getListAccount,
	deleteAccount,
	resetPassword,
	forgotPassword,
	getStoreRoles,
	changePassword,
	changePasswordForStaff
}