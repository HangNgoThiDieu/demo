export interface WorkingTimeStoreModel {
    workingTimeId?: number;
    workingDay: number;
    workStatus: number;
    startTime?: Date;
    endTime?: Date;
    isEnableTime: boolean;
    startTimeDefault: string;
    endTimeDefault: string;
}
