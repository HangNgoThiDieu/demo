import jwtDecode from "jwt-decode";
import Cookies from "universal-cookie";
import {
  ACCESS_TOKEN,
  COLORS,
  COMPNAME,
  LANGUAGE,
  REFRESH_TOKEN,
} from "./constants";
import jwt_decode from "jwt-decode";

const cookies = new Cookies();

interface DecodeToken {
  userId: string;
  userName: string;
  exp: number;
  iss: string;
  aud: string;
  email: string;
  fullname: string;
  companyId: number;
  role: string;
}

const saveTokenToStorage = (accessToken: string) => {
  cookies.set(ACCESS_TOKEN, accessToken, {
    path: "/",
    secure: true,
    sameSite: "strict",
    maxAge: 2592000,
  });
};

const saveRefreshTokenToStorage = (refreshToken: string) => {
  cookies.set(REFRESH_TOKEN, refreshToken, {
    path: "/",
    secure: true,
    sameSite: "strict",
    maxAge: 2592000,
  });
};

const getTokenFromStorage = () => {
  return {
    accessToken: cookies.get(ACCESS_TOKEN),
  };
};

const getRefreshTokenFromStorage = () => {
  return {
    refreshToken: cookies.get(REFRESH_TOKEN),
  };
};

const removeToken = () => {
  // cookies.remove(ACCESS_TOKEN, {
  //   path: "/",
  //   secure: true,
  //   sameSite: "strict",
  // });
  cookies.remove(ACCESS_TOKEN, { path: "/" });
  cookies.remove(REFRESH_TOKEN, { path: "/" });
};

const decodeToken = (token: string) => {
  try {
    return jwtDecode<DecodeToken>(token);
  } catch {}
};

const isValidToken = (token: string) => {
  const decodedToken = decodeToken(token);
  if (decodedToken) {
    return new Date().getTime() <= decodedToken.exp * 1000;
  }
  return false;
};

const isAuth = () => {
  const token = cookies.get(ACCESS_TOKEN);
  return !!token;
};

const setColorsToStorage = (key: any, value: any) => {
  cookies.set(key, value, {
    path: "/",
    secure: true,
    sameSite: "strict",
    maxAge: 2592000,
  });
};

const getColorsFromStorage = (key: string) => {
  const value = cookies.get(key);

  return value;
};

const setLanguageToStorage = (key: any, value: any) => {
  cookies.set(key, value, {
    path: "/",
    secure: true,
    sameSite: "strict",
    maxAge: 2592000,
  });
};

const getCompanyName = () => {
  const value = cookies.get(COMPNAME);

  return value;
};

const removeColor = () => {
  cookies.remove(COLORS, { path: "/" });
};

const removeLanguage = () => {
  cookies.remove(LANGUAGE, { path: "/" });
};

const setCompanyName = (value: string) => {
  cookies.set(COMPNAME, value, {
    path: "/",
    secure: true,
    sameSite: "strict",
    maxAge: 2592000,
  });
};

const getLanguageFromStorage = (key: string) => {
  const value = cookies.get(key);

  return value;
};

const setPropertyToStorage = (key: string, value: any) => {
  cookies.set(key, value, {
    path: "/",
    secure: true,
    sameSite: "strict",
    maxAge: 2592000,
  });
};

const getPropertyFromStorage = (key: string) => {
  const value = cookies.get(key);

  return value;
};

const removePropertyFromStorage = (key: string) => {
  cookies.remove(key, { path: "/" });
};

const getToken = function (name: string) {
  var token = cookies.get(name);
  if (token) {
    return jwt_decode_token(token) as DecodeToken;
  }
  return null;
};

const jwt_decode_token = function (token: string) {
  var decode_token = jwt_decode(token) as DecodeToken;
  return decode_token;
};

export const tokenHelper = {
  isValidToken,
  decodeToken,
  getTokenFromStorage,
  saveTokenToStorage,
  removeToken,
  setColorsToStorage,
  getColorsFromStorage,
  saveRefreshTokenToStorage,
  getRefreshTokenFromStorage,
  removeColor,
  isAuth,
  setLanguageToStorage,
  getLanguageFromStorage,
  removeLanguage,
  setCompanyName,
  getCompanyName,
  setPropertyToStorage,
  getPropertyFromStorage,
  removePropertyFromStorage,
  getToken,
};
