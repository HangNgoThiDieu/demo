export interface NotificationEditModel {
    notificationId: number;
    title: string;
    content: string;
    startDate: Date | any;
    endDate: Date | any;
    status: number;
}