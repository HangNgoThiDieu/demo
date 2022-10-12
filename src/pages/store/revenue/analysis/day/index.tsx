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
import { DayRevenueAnalysisResult } from "types/results/revenue/revenue-analysis.result";

export default ({
  dayRevenue,
  CustomTooltip,
  CustomizedTickX,
  CustomizedTickY,
  CustomizedLabel,
  height
}: {
  dayRevenue: DayRevenueAnalysisResult[];
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
        data={dayRevenue}
        margin={{
          top: 30,
          right: 5,
          left: 0,
          bottom: -10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          domain={["", ""]}
          dataKey="keyDay"
          interval={0}
          tick={<CustomizedTickX isCustom={false} offesetY={12} />}
        />
        <XAxis
          domain={['dataMin', 'dataMax']}
          interval={0}
          dy={-10}
          dataKey="keyDayOfWeek"
          axisLine={false}
          tickLine={false}
          xAxisId="keyDayOfWeek"
          tick={<CustomizedTickX isCustom={true} />}
        />
        <YAxis
          width={30}
          label={<CustomizedLabel/>}
          tick={<CustomizedTickY isCustom={true} offesetX={-12} offesetY={4} />}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "#543005", strokeWidth: 2 }}
        />
        <Line dataKey="total" stroke="#543005" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};
