"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart";

const chartData = [
  { month: "January", earnings: 1.86 },
  { month: "February", earnings: 3.05 },
  { month: "March", earnings: 2.37 },
  { month: "April", earnings: 0.73 },
  { month: "May", earnings: 2.09 },
  { month: "June", earnings: 2.14 },
];

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function FullEarningsChart() {
  return (
    <Card className="mx-2 md:mx-0 bg-transparent">
      <CardHeader>
        <CardTitle>Earnings Bar Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[450px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="earnings" fill="var(--color-earnings)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total earnings for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
