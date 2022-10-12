export interface NotificationAddUserModel {
  title: string;
  label: string;
  startDate: Date| any;
  endDate: Date| any;
  content: string;
  file: File[];
}