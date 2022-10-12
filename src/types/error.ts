import { HTTPStatusCode } from "./http-code";

export enum ApiErrorCode {
    Failed = "Failed",
    InvalidUserNameOrPassword = "InvalidUserNameOrPassword",
    UserLocked = "UserLocked",
    Unauthorized = "Unauthorized",
    InvalidParameters = "InvalidParameters",
    AccessTokenExpired = "AccessTokenExpired",
}

export class AppError extends Error {
    public status: HTTPStatusCode;
    public errorCode: any;
    public data: any;

    constructor(status: HTTPStatusCode, message: string, errorCode: any = ApiErrorCode.InvalidUserNameOrPassword, data: any = null) {
        super(message);
        this.errorCode = errorCode;
        this.data = data;
        this.status = status;
    }
}