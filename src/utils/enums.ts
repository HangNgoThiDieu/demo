export enum MasterDataStatusResponse {
  Failed = "Failed",
  DuplicatedName = "DuplicatedName",
}

export enum ProductStatusResponse {
  Failed = "Failed",
  DuplicatedName = "DuplicatedName",
  NotDelete = "NotDelete",
  Success = "Success",
}

export enum UsersStatusResponse {
  Failed = "Failed",
  NotFound = "NotFound",
  IsLogined = "IsLogined",
  Success = "Success",
  Locked = "UserLocked",
  Disable = "UserDisable",
  InvalidUserNameOrPassword = "InvalidUserNameOrPassword",
  NotMatchPassword = "NotMatchPassword",
  InValid = "InValid",
  ExistedEmail = "ExistedEmail",
  PasswordNotCorrect = "PasswordNotCorrect",
  DuplicateOldPassword = "DuplicateOldPassword"
}

export enum ErrorsCode {
  Failed = "Failed",
  Locked = "UserLocked",
  Disable = "UserDisable",
  InvalidUserNameOrPassword = "InvalidUserNameOrPassword",
  CompanyStop = "CompanyStop",
  Unauthorized = "Unauthorized"
}

export enum TableStatusResponse {
  Failed = "Failed",
  DuplicatedTableName = "DuplicatedTableName",
  DuplicatedSeatName = "DuplicatedSeatName",
  Success = "Success",
  NotFound = "NotFound",
  IsUsing = "IsUsing",
}

export enum TransactionStatusResponse {
  Failed = "Failed",
  NotFound = "NotFound",
  Expired = "Expired"
}

export enum TransactionStatus {
  BeforeOrdering = 1,
  Seated = 2,
  CompletedPayment = 3,
}

export enum TransactionStatusString {
  BeforeOrdering = "beforeOrdering",
  Seated = "seated",
  CompletedPayment = "completedPayment",
}

export enum OnePayResponseCode {
  Failed= "Failed",
  Success = "Success",
  InvalidSignature = "InvalidSignature"
}

export enum PaymentMethod {
  Cash = 1,
  Transfer = 2,
  CreditCard = 3,
}

export enum Role {
  StoreManager = "StoreManager",
  Staff = "Staff",
}

export enum AnalysisType {
  Product = 1,
  Category = 2,
}

export enum OptionType {
  RadioButton = 1,
  Checkbox = 2,
}

export enum AccountStatus {
  Valid = 0,
  Invalid = 1,
}

export enum AccountStatusResponse {
  Enable = "Enable",
  Disable = "Disable",
}

export enum MenuSider {
  StoreSetting = "StoreSetting",
  DesignSetting = "DesignSetting",
  TableSetting = "TableSetting",
  SeatSetting = "SeatSetting",
  PaymentSetting = "PaymentSetting",
  StaffManagement = "StaffManagement",
  SalesAnalysis = "SalesAnalysis",
  ProductManagement = "ProductManagement",
  NotificationSetting = "NotificationSetting",
  TableList = "TableList",
  OrderList = "OrderList",
}
