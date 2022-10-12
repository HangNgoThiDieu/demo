import Config from "config";
import { EmailTokenModel } from "types/models/reset-password/email-token.model";
import api from "utils/api";

const validateEmailToken = async (model: EmailTokenModel) => {
    return await api.post<boolean>(Config.API_URL.VALIDATE_EMAIL_TOKEN, model);
}

export const tokenService = {
    validateEmailToken,
}