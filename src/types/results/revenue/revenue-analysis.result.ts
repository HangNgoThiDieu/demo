export interface RevenueAnalysisResult {
    listDayRevenue: DayRevenueAnalysisResult[];
    listMonthRevenue: MonthRevenueAnalysisResult[];
}

export interface DayRevenueAnalysisResult {
    total: number;
    keyDay: number;
    keyDayOfWeek: number;
}

export interface MonthRevenueAnalysisResult {
    total: number;
    keyMonth: number;
}