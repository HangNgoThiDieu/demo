import Config from "../config";
import { LoginModel } from "../types/models/login.model";
import { RefreshTokenModel } from "../types/models/refresh-token.model";
import { LoginResult } from "../types/results/login.result";
import { RefreshTokenResult } from "../types/results/refresh-token.result";
import api from "../utils/api";

const login = async (model: LoginModel) => {
  return await api.post<LoginResult>(Config.API_URL.LOGIN, model);
};

const refreshToken = async (model: RefreshTokenModel) => {
  return await api.post<RefreshTokenResult>(
    Config.API_URL.REFRESH_TOKEN,
    model
  );
};

const logout = async (refreshToken: string) => {
    return await api.post<boolean>(Config.API_URL.LOGOUT, {refreshToken});
};

export const authService = {
    login,
    refreshToken,
    logout,
}