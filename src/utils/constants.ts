import { DictionaryItem } from "./dictionary-item";

export const ACCESS_TOKEN = 'X-Token';
export const REFRESH_TOKEN = "X-Refresh-Token"
export const COLORS_DEFAULT = 'COLORS-DEFAULT';
export const COLORS = 'COLORS';
export const MIN_LENGTH = 8;
export const MAX_LENGTH = 16;
export const LANGUAGE = 'LANGUAGE';
export const LANGUAGE_USER = 'LANGUAGE_USER';
export const COMPNAME = "COMPNAME";
export const CURRENCY_UNITS = "CURRENCY_UNIT";
export const TRANSACTION_INFO = "_TRANS_INFO";

export const AUTH_ACCESS_TOKEN = "AUTH_ACCESS_TOKEN";
export const AUTH_REFRESH_TOKEN = "AUTH_REFRESH_TOKEN";
export const LOCALE = "en-US";
export const OPTION_CURRENCY = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}
export const CURRENCY_UNIT_DEFAULT = "円";
export const MAX_SIZE_IMAGE= 5045947;

export const STORE_ROLES = {
  StoreManager: "StoreManager",
  Staff: "Staff"
}

//urls
export const ACCOUNT_DETAIL = "/account";
export const ADD_ACCOUNT = "/account/add/";
export const EDIT_ACCOUNT = "/account/edit/";
export const ADD_PRODUCT = "/product/add/";
export const TRANSACTION_DETAIL = "/transaction/";
export const PRODUCT = "/products/";
export const TABLE = "/table/";
export const TOP = "/";
export const LOGOUT = "/login";

//screen-name
export const LOGIN = 'login';
export const HOME = 'home';

export const REGEX = {
    EMAIL_PATTERN: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    REGEX_PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/,
    passwordFake: "Hqw0asd234#",
		DECIMAL: /^[+-]?\d+(\.\d+)?$/,
		SPACE: /[^\s]/,
    POSITIVE_INTEGER: /^[-+]?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)$/,
    POSITIVE_DECIMAL: /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
    POSI_NEGA_DECIMAL: /^[-+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
    REGEX_PHONE_NUMBER: /^\s*[(]*[+]{0,1}[0-9]{1,4}[)]{0,1}[-\s/0-9]*$/
  };

export const ORDER_STATUS = {
  All: 0,
  UnFinished: 1,
  Finished: 2,
  Cancelled: 3,
  Cart: 4
}

export const DISCOUNT_TYPE = {
  Percent: 1,
  Currency: 2
}

export const DiscountTypeList: DictionaryItem[] = [
  {key: 1, value: "%"},
  {key: 2, value: "unitPrice"},
];

export const OPTION_TYPE = {
  PickOne: 1,
  PickMultiple: 2
}

export const DAY_OF_WEEK = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6
}

export const TransactionStatusList: DictionaryItem[] = [
  {key: 0, value: "all"},
  {key: 1, value: "beforeOrdering"},
  {key: 2, value: "seated"},
  {key: 3, value: "completed"},
];

export const COLOR_TYPE = {
  MainColor: 1,
  SubColor: 2,
  AccentColor: 3,
  TextColor: 4,
};

export const NOTIFICATION_STATUS = {
  Public: 1,
  Private: 2,
}

export const NotificationStatusList: DictionaryItem[] = [
  {key: 1, value: "Public"},
  {key: 2, value: "Private"},
];

export const  LANGUAGE_LIST: DictionaryItem[] = [
  {key: 0, value: "japanese"},
  {key: 1, value: "english"},
  {key: 2, value: "korean"},
  {key: 3, value: "vietnamese"},
];

export const WORKING_DAY_LIST: DictionaryItem[] = [
  {key: 1, value: "monday"},
  {key: 2, value: "tuesday"},
  {key: 3, value: "wednesday"},
  {key: 4, value: "thursday"},
  {key: 5, value: "friday"},
  {key: 6, value: "saturday"},
  {key: 7, value: "sunday"},
  {key: 8, value: "holiday"},
];

export const WORK_STATUS = {
  Work: 1,
  DayOff: 2,
};

export const  TRANSLATE_LIST: DictionaryItem[] = [
  {key: 0, value: "jp"},
  {key: 1, value: "en"},
  {key: 2, value: "kr"},
  {key: 3, value: "vi"},
];

export const LANGUAGE_FLAG = [
  { code: "jp", title: "Japanese" },
  { code: "gb", title: "English" },
  { code: "kr", title: "Korean" },
  { code: "vn", title: "Vietnamese" },
];

export const TRANSACTION_STATUS = {
  BeforeOrdering: 1,
  Seated: 2,
  Completed: 3
};

export const PAYMENT_GATEWAY = {
  Cash: 1,
  Transfer: 2,
  OnePay: 3,
  MoMo: 4
};

export const MONTH_OF_YEAR = {
  January: 1,
  Febrary: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  Noveber: 11,
  December: 12
}

export const PAYMENT_GATEWAY_LIST: DictionaryItem[] = [
  {key: 1, value: "cash"},
  {key: 2, value: "transfer"},
  {key: 3, value: "onePay"},
  {key: 4, value: "momoPay"}
]

export const FLAG_CODES = {
  JP: "jp",
  ENG: "gb",
  KR: "kr",
  VN: "vn"
}

export const ONE_PAY_RESPONSE_CODE = {
  Failed: 0,
  Success:  1,
  InvalidSignature: 2
}

export const USER_STATUS = {
  Valid: 0,
  InValid: 1,
}

export const MOMO_ERROR = {
  CancelPayment: "1006"
}