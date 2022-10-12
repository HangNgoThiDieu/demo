interface Empty { }

export interface Response {
    errorCode: number,
    errorMessage: string
}

export interface ResponseResult<T extends Empty> {
    errorCode: number;
    errorMessage: string;
    result: T;
}