import React from "react";
import { useTranslation } from "react-i18next";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MonthRevenueAnalysisResult } from "types/results/revenue/revenue-analysis.result";

export default ({
  monthRevenue,
  CustomTooltip,
  CustomizedTickX,
  CustomizedTickY,
  CustomizedLabel,
  height
}: {
  monthRevenue: MonthRevenueAnalysisResult[];
  CustomTooltip: any;
  CustomizedTickX: any;
  CustomizedTickY: any;
  CustomizedLabel: any;
  height: number;
}) => {
  const { t } = useTranslation();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={monthRevenue}
        margin={{
          top: 30,
          right: 8,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          interval={0}
          domain={[1, 12]}
          dataKey="keyMonth"
          tick={<CustomizedTickX isCustom={true} offesetY={12} />}
        />
        <YAxis
          width={30}
          label={<CustomizedLabel/>}
          tick={<CustomizedTickY isCustom={true} offesetX={-12} offesetY={4} />}
        />
        <Tooltip
          content={<CustomTooltip isMonthGraph={true} />}
          cursor={{ stroke: "#543005", strokeWidth: 2 }}
        />
        <Line dataKey="total" stroke="#543005" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};
