"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { format, subMonths } from "date-fns";
import { BadgeDollarSign, TrendingUp, Wallet } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import {
  leadsChartConfig,
  leadsChartData,
  proposalsChartConfig,
  proposalsChartData,
  revenueChartConfig,
  revenueChartData,
} from "./crm.config";

const trafficChartData = [
  { time: "09 AM", total: 10, known: 5, unknown: 0 },
  { time: "10 AM", total: 12, known: 6, unknown: 2 },
  { time: "12 PM", total: 10, known: 10, unknown: 4 },
  { time: "13 PM", total: 6, known: 12, unknown: 3 },
  { time: "14 PM", total: 11, known: 11, unknown: 6 },
  { time: "16 PM", total: 14, known: 11, unknown: 4 },
];

const trafficChartConfig = {
  total: { label: "Total", color: "#6366f1" },
  known: { label: "Known", color: "#22c55e" },
  unknown: { label: "Unknown", color: "#f97316" },
};

const lastMonth = format(subMonths(new Date(), 1), "LLLL");

import { Users, UserCheck, UserMinus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function OverviewCards({ className }: { className?: string }) {
  const [liveDetections, setLiveDetections] = useState<any[]>([]);

  useEffect(() => {
    const handleDetections = (e: any) => {
      setLiveDetections(e.detail || []);
    };
    window.addEventListener("ai:detections", handleDetections);
    return () => window.removeEventListener("ai:detections", handleDetections);
  }, []);

  const peopleCount = liveDetections.length;
  const facesCount = liveDetections.filter((d) => d.name && d.name !== "Unknown").length;
  const unknownCount = liveDetections.filter((d) => d.name === "Unknown").length;
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-0 *:data-[slot=card]:shadow-none sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
        className,
      )}
    >
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>New Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-18 w-full" config={leadsChartConfig}>
            <BarChart accessibilityLayer data={leadsChartData} barSize={8}>
              <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} hide />
              <ChartTooltip content={<ChartTooltipContent labelFormatter={(label) => `${lastMonth}: ${label}`} />} />
              <Bar
                background={{ fill: "var(--color-background)", radius: 2, opacity: 0.07 }}
                dataKey="newLeads"
                stackId="a"
                fill="var(--color-newLeads)"
                radius={[0, 0, 0, 0]}
              />
              <Bar dataKey="disqualified" stackId="a" fill="var(--color-disqualified)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="font-semibold text-xl tabular-nums">635</span>
          <span className="font-medium text-green-500 text-sm">+54.6%</span>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>People Traffic</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer className="w-full h-20" config={trafficChartConfig}>
            <LineChart data={trafficChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[10px] opacity-50"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="var(--color-total)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--color-total)" }}
              />
              <Line
                type="monotone"
                dataKey="known"
                stroke="var(--color-known)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--color-known)" }}
              />
              <Line
                type="monotone"
                dataKey="unknown"
                stroke="var(--color-unknown)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--color-unknown)" }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex gap-4 justify-center text-[12px] font-medium opacity-60">
          <div className="flex items-center gap-1">
            <div className="size-1.5 rounded-full bg-[#6366f1]" /> Total
          </div>
          <div className="flex items-center gap-1">
            <div className="size-1.5 rounded-full bg-[#22c55e]" /> Known
          </div>
          <div className="flex items-center gap-1">
            <div className="size-1.5 rounded-full bg-[#f97316]" /> Unknown
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">$1,250.00</CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Visitors for the last 6 months</div>
        </CardFooter>
      </Card>

      <Card className="h-full">
        <CardHeader>
          <CardTitle>Live Presence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-green-500/15 p-1.5 text-green-600">
                <Users className="size-3.5" />
              </div>
              <span className="text-xs font-medium opacity-70">People detected</span>
            </div>
            <span className="text-sm font-bold tabular-nums">{peopleCount}</span>
          </div>

          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-blue-500/15 p-1.5 text-blue-600">
                <UserCheck className="size-3.5" />
              </div>
              <span className="text-xs font-medium opacity-70">Faces detected</span>
            </div>
            <span className="text-sm font-bold tabular-nums">{facesCount}</span>
          </div>

          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-destructive/15 p-1.5 text-destructive">
                <UserMinus className="size-3.5" />
              </div>
              <span className="text-xs font-medium opacity-70">Unknown faces</span>
            </div>
            <span className="text-sm font-bold tabular-nums text-destructive">{unknownCount}</span>
          </div>
        </CardContent>
      </Card>

      {/* <Card className="col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle>Revenue Growth</CardTitle>
          <CardDescription>Year to Date (YTD)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueChartConfig} className="h-24 w-full">
            <LineChart
              data={revenueChartData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="revenue"
                stroke="var(--color-revenue)"
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-sm">+35% growth since last year</p>
        </CardFooter>
      </Card> */}
    </div>
  );
}
