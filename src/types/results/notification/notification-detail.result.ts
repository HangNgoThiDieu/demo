export interface NotificationDetailResult {
    notificationId: number;
    title: string;
    content: string;
    startDate: Date;
    endDate: Date;
    status: number;
    showMessage: boolean;
    showMessageRequired: boolean;
}