import Config from "config";
import { FilterGraphAnalysisModel } from "types/models/revenue/filter-graph-analysis.model";
import { FilterTableAnalysisModel } from "types/models/revenue/filter-table-analysis.model";
import { GraphAnalysisResult } from "types/results/revenue/graph-analysis.result";
import { TableAnalysisResult } from "types/results/revenue/table-analysis.result";
import { RevenueAnalysisResult } from "types/results/revenue/revenue-analysis.result";
import api from "utils/api";
import { DateRevenueGraphResult } from "types/results/revenue/date-revenue.result";

const getGraphAnalysis = async (filter: FilterGraphAnalysisModel) => {
    return await api.post<GraphAnalysisResult[]>(Config.API_URL.GRAPH_ANALYSIS, filter);
}

const getRevenueAnalysis = async (month: number, year: number) => {
    return await api.post<RevenueAnalysisResult>(Config.API_URL.REVENUE_ANALYSIS, {month, year});
}

const getTableAnalysis = async (filter: FilterTableAnalysisModel) => {
    return await api.post<TableAnalysisResult[]>(Config.API_URL.TABLE_ANALYSIS, filter);
}

const getDateRevenueGraph = async (date: Date | any) => {
    return await api.post<DateRevenueGraphResult[]>(Config.API_URL.DATE_REVENUE, {date});
}

export const revenueAnalysisService = {
    getGraphAnalysis,
    getTableAnalysis,
    getRevenueAnalysis,
    getDateRevenueGraph
}