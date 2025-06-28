"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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

export const description = "An area chart";

const chartData = [
  { day: "Monday", earnings: 0.32 },
  { day: "Tuesday", earnings: 0.45 },
  { day: "Wednesday", earnings: 0.51 },
  { day: "Thursday", earnings: 0.38 },
  { day: "Friday", earnings: 0.62 },
  { day: "Saturday", earnings: 0.29 },
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
        <CardTitle>Earnings Area Chart</CardTitle>
        <CardDescription>Monday - Saturday</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[450px] w-full">
          <AreaChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Area
              type="monotone"
              dataKey="earnings"
              stroke="var(--primary)"
              fill="var(--primary)"
              fillOpacity={0.2}
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this week <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total earnings for the last 6 days
        </div>
      </CardFooter>
    </Card>
  );
}
