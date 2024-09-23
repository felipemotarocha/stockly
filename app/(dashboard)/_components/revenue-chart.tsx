"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import { GetRevenueLast14DaysDto } from "@/app/_data-access/sale/get-last-14-days-revenue";
import { CartesianGrid, Bar, BarChart, XAxis } from "recharts";

const chartConfig = {
  revenue: {
    label: "Receita",
  },
} satisfies ChartConfig;

interface RevenueChartProps {
  data: GetRevenueLast14DaysDto[];
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  return (
    <ChartContainer config={chartConfig} className="min-h-0 w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="revenue" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};

export default RevenueChart;
