export interface FilterGraphAnalysisModel {
  analysisType: number;
  startTime: Date | any;
  endTime: Date | any;
  isCompare: boolean;
  startTimeCompare?: Date | any;
  endTimeCompare?: Date | any;
}
