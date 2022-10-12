import React from "react";
import { useTranslation } from "react-i18next";
import {
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Bar,
  XAxis,
  YAxis,
  BarChart,
} from "recharts";
import { DateRevenueGraphResult } from "types/results/revenue/date-revenue.result";

export default ({
  graphRevenue,
  CustomTooltip,
  CustomizedTickX,
  CustomizedTickY,
  CustomizedLabel,
  height
}: {
  graphRevenue: DateRevenueGraphResult[];
  CustomTooltip: any;
  CustomizedTickX: any;
  CustomizedTickY: any;
  CustomizedLabel:any;
  height: number;
}) => {
  const { t } = useTranslation();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
          data={graphRevenue}
          margin={{
            top: 30,
            right: 5,
            left: 0,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="paymentMethod"
            textAnchor="start"
            interval={0}
            tick={<CustomizedTickX isCustom={true} offesetX={0} offesetY={5}/>}
          />
          <YAxis
            width={30}
            label={<CustomizedLabel/>}
            tick={<CustomizedTickY isCustom={true} angle={-200} offesetX={-12} offesetY={4} />
            }
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeWidth: 2 }}/>
          <Bar
            dataKey="sales"
            fill="#543005"
            maxBarSize={30}
          />
        </BarChart>
    </ResponsiveContainer>
  );
};
