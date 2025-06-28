import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A line chart";

const chartData = [
  { month: "January", earnings: 1.86 },
  { month: "February", earnings: 3.05 },
  { month: "March", earnings: 2.37 },
  { month: "April", earnings: 0.73 },
  { month: "May", earnings: 2.09 },
  { month: "June", earnings: 2.14 },
];

const chartConfig = {
  desktop: {
    label: "Earnings",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function BriefEarningsChart() {
  return (
    <Card className="bg-transparent border-none shadow-none w-full p-0 flex flex-col">
      <CardContent className="">
        <ChartContainer config={chartConfig} className="md:max-h-[130px]">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
            height={50}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="earnings"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
              height={50}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
