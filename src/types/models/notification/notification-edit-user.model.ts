export interface NotificationEditUserModel {
  id: number;
  title: string;
  label: string;
  startDate: Date | any;
  endDate: Date| any;
  content: string;
  file: File[];
  hasDeleteImg: boolean;
}