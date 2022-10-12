import axios from "axios";
import Config from "../config";
import { authService } from "../services/auth.service";
import { ApiErrorCode, AppError } from "../types/error";
import { HTTPStatusCode } from "../types/http-code";
import { ResponseResult } from "../types/response";
import { tokenHelper } from "./store-token";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const getInstance = (contentType = "application/json") => {
  const instance = axios.create({
    withCredentials: true,
    baseURL: Config.API_URL.BASE_URL,
    headers: {
      "Content-Type": contentType,
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const { accessToken } = tokenHelper.getTokenFromStorage();
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error: any) => {
      Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: any) => {
      return response;
    },
    (error: { response: { status: any; data: any }; config: any }) => {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response) {
        const { status, data } = error.response;
        const originalRequest = error.config;
        const { errorCode, errorMessage } = data;

        if (data) {
          const { errorCode, errorMessage } = data;
          switch (status) {
            case HTTPStatusCode.BadRequest:
              switch (errorCode) {
                case ApiErrorCode.InvalidParameters:
                  window.location.href = "/404";
                  break;
                default:
                  throw new AppError(status, errorMessage, errorCode);
              }
              break;
            case HTTPStatusCode.Forbidden:
              window.location.href = "/403";
              break;
            case HTTPStatusCode.NotFound:
              window.location.href = "/404";
              break;
            case HTTPStatusCode.InternalServerError:
              window.location.href = "/500";
              break;
            case HTTPStatusCode.Unauthorized:
              if (!originalRequest._retry) {
                if (originalRequest.url == Config.API_URL.REFRESH_TOKEN) {
                  tokenHelper.removeToken();
                  tokenHelper.removeColor();
                  window.location.href = "/login";
                  return Promise.reject(error);
                }

                if (isRefreshing) {
                  return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                  })
                    .then((token) => {
                      originalRequest.headers["Authorization"] =
                        "Bearer " + token;
                      return instance(originalRequest);
                    })
                    .catch((err) => {
                      return Promise.reject(err);
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                const { accessToken } = tokenHelper.getTokenFromStorage();
                const { refreshToken } = tokenHelper.getRefreshTokenFromStorage();

                return new Promise(function (resolve, reject) {
                  if (accessToken && refreshToken) {
                    authService
                      .refreshToken({
                        accessToken,
                        refreshToken,
                      })
                      .then((rs) => {
                        const {
                          accessToken: newToken,
                          refreshToken: newRefreshToken,
                        } = rs;

                        tokenHelper.saveTokenToStorage(newToken);
                        //tokenHelper.saveRefreshTokenToStorage(newRefreshToken);

                        axios.defaults.headers.common["Authorization"] =
                          "Bearer " + newToken;
                        originalRequest.headers["Authorization"] =
                          "Bearer " + newToken;

                        processQueue(null, newToken);
                        resolve(instance(originalRequest));
                      })
                      .catch((err) => {
                        processQueue(err, "");

                        reject(err);
                      })
                      .finally(() => { 
                        isRefreshing = false;
                      });
                  }
                });
              }

              return Promise.reject(error);
            default: {
              window.location.href = "/500";
              throw new AppError(status, errorMessage);
            }
          }
        } else {
          window.location.href = "/500";
          throw new AppError(status, errorMessage, errorCode);
        }
      } else {
        window.location.href = "/500";
      }
    }
  );

  return instance;
};

export const handleGet = async <TResult>(url: string, params?: any) => {
  const response = await getInstance().request<ResponseResult<TResult>>({
    method: "GET",
    url,
    params,
  });

  return response.data.result;
};

export const handlePostFormData = async <TResult>(
  url: string,
  body: object
) => {
  const response = await getInstance("multipart/form-data").request<
    ResponseResult<TResult>
  >({
    method: "POST",
    url: url,
    data: getFormData(body),
  });

  return response.data.result;
};

export const handlePostFile = async <TResult>(
  url: string,
  file: Blob | File
) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await getInstance("multipart/form-data").request<
    ResponseResult<TResult>
  >({
    method: "POST",
    url: url,
    data: formData,
  });

  return response.data.result;
};

export const handlePost = async <TResult>(url: string, body: any) => {
  const response = await getInstance().request<ResponseResult<TResult>>({
    method: "POST",
    url: url,
    data: body,
  });

  return response.data.result;
};

export const handlePut = async <TResult>(url: string, body: any) => {
  const response = await getInstance().request<ResponseResult<TResult>>({
    method: "PUT",
    url: url,
    data: body,
  });

  return response.data.result;
};

export const handlePutFormData = async <TResult>(url: string, body: any) => {
  const response = await getInstance("multipart/form-data").request<
    ResponseResult<TResult>
  >({
    method: "PUT",
    url: url,
    data: createFormData(body),
  });

  return response.data.result;
};

export const getFormData = (object: any) =>
  Object.entries(object).reduce((fd, [key, val]) => {
    if (Array.isArray(val)) {
      val.forEach((v) => fd.append(key, v));
    } else {
      fd.append(key, "" + val);
    }
    return fd;
  }, new FormData());

export const handleDelete = async (url: string) => {
  await getInstance().request({
    method: "DELETE",
    url: url,
  });
};

export const handlePostFormDataCustom = async <TResult>(
  url: string,
  body: object
) => {
  const response = await getInstance("multipart/form-data").request<
    ResponseResult<TResult>
  >({
    method: "POST",
    url: url,
    data: createFormData(body),
  });

  return response.data.result;
};

export const createFormData = (
  object: any,
  form?: FormData,
  namespace?: string
): FormData => {
  const formData = form || new FormData();
  for (let property in object) {
    if (!object.hasOwnProperty(property) || !object[property]) {
      continue;
    }
    let formKey = namespace ? `${namespace}[${property}]` : property;
    if (object[property] instanceof Date) {
      formData.append(formKey, object[property].toISOString());
    } else if (
      property === "mainFile" ||
      property === "subFiles" ||
      property === "file"
    ) {
      if (Array.isArray(object[property])) {
        object[property].forEach((v: any) => formData.append(property, v));
      } else {
        formData.append(property, "" + object[property]);
      }
    } else if (
      typeof object[property] === "object" &&
      !(object[property] instanceof File)
    ) {
      createFormData(object[property], formData, formKey);
    } else {
      formData.append(formKey, object[property]);
    }
  }
  return formData;
};

export default {
  get: handleGet,
  post: handlePost,
  postForm: handlePostFormData,
  postFormCustom: handlePostFormDataCustom,
  postFile: handlePostFile,
  put: handlePut,
  putForm: handlePutFormData,
  delete: handleDelete,
};
