export interface ChangePasswordModel {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword?: string;
    userId: string;
}