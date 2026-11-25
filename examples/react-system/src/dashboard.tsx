/** Parcel Lab dashboard with trend, distribution, orders and activity. */
import { useState } from "react";
import { Area, Bar, CartesianGrid, Cell, ComposedChart, XAxis, YAxis } from "recharts";
import { ArrowUpRight, Box, CircleDollarSign, Clock3, Plus, Truck } from "lucide-react";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ActivityFeed } from "@/components/designfy/activity-feed/activity-feed";
import { ChartCard } from "@/components/designfy/chart-card/chart-card";
import { DataTable } from "@/components/designfy/data-table/data-table";
import { PageHeader } from "@/components/designfy/page-header/page-header";
import { StatCard } from "@/components/designfy/stat-card/stat-card";
import { LinkButton, LoadError, OrdersEmpty, orderColumns, rowId, usd, type DemoState, type Order } from "./shared";
import sample from "./sample.json";

const trendConfig = { current: { label: "This period", color: "var(--chart-1)" }, prior: { label: "Previous period", color: "var(--chart-2)" } };
const distributionConfig = { count: { label: "Shipments", color: "var(--chart-1)" } };
const number = (value: number) => Math.round(value).toLocaleString("en-US");

export function Dashboard({ orders, state }: { orders: Order[]; state: DemoState }) {
  const [period, setPeriod] = useState("7");
  const [older, setOlder] = useState(false);
  const long = period === "30";
  const trend = long ? sample.trend.map((point) => ({ ...point, current: point.current * 4, prior: point.prior * 3 })) : sample.trend;
  const breakdown = long ? sample.distribution.map((point) => ({ ...point, count: point.count * 4 })) : sample.distribution;
  const available = state === "ready";
  const metricError = state === "error" ? "Could not load" : undefined;
  const metrics = [
    { label: "Orders processed", value: long ? 1680 : 420, change: { value: 12, text: "vs. previous period" }, trend: trend.map((p) => p.current), icon: <Box size={16} /> },
    { label: "In transit", value: long ? 496 : 124, change: { value: 8, text: "vs. previous period" }, icon: <Truck size={16} /> },
    { label: "Average lead time", value: long ? 3.1 : 2.8, format: (n: number) => `${n.toFixed(1)} days`, change: { value: -6, text: "vs. previous period" }, icon: <Clock3 size={16} /> },
    { label: "Order value", value: long ? 40800 : 10200, format: usd, change: { value: 10, text: "vs. previous period" }, icon: <CircleDollarSign size={16} /> },
  ];
  const periodControl = <label className="text-sm">
    <span className="sr-only">Reporting period</span>
    <select className="min-h-11 rounded-lg border border-input bg-card px-3 font-medium" value={period} onChange={(event) => setPeriod(event.target.value)}>
      <option value="7">Last 7 days</option><option value="30">Last 30 days</option>
    </select>
  </label>;
  return <div className="grid gap-6 lg:gap-7">
    <PageHeader title="Operations overview" description="Monitor sample shipments, fulfillment and order activity."
      secondaryActions={periodControl} primaryAction={<LinkButton primary href="/app/orders/new"><Plus aria-hidden /> New order</LinkButton>} />
    <div className="grid gap-3 min-[380px]:grid-cols-2 xl:grid-cols-4" aria-label="Key indicators">
      {metrics.map((metric) => <StatCard key={metric.label} {...metric} value={available ? metric.value : null} format={metric.format ?? number} loading={state === "loading"} error={metricError} />)}
    </div>
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <ChartCard title="Fulfillment volume" description="Orders processed by day" summary="Fulfillment generally increases through the week. Sunday has the highest order count in the sample."
        config={trendConfig} state={state} animationKey={period} period={<span className="text-xs tabular-nums text-muted-foreground">{period}-day window</span>}
        table={{ columns: ["Day", "This period", "Previous period"], rows: trend.map(({ day, current, prior }) => [day, current, prior]) }}
        legend={<><span className="inline-flex items-center gap-2"><span aria-hidden className="h-0.5 w-4 bg-chart-1" />This period</span>
          <span className="inline-flex items-center gap-2"><span aria-hidden className="w-4 border-b-2 border-dashed border-chart-2" />Previous period</span></>}
        chart={(animation) => <AreaChartPlot trend={trend} animation={animation} />} />
      <ChartCard title="Shipment status" description="Orders by current stage" summary="Delivered is the largest stage. Queued is the smallest stage."
        config={distributionConfig} state={state} animationKey={period}
        table={{ columns: ["Stage", "Shipments"], rows: breakdown.map(({ status, count }) => [status, count]) }}
        legend={<><span className="inline-flex items-center gap-2"><span aria-hidden className="size-2 rounded-sm bg-chart-1" />Delivered</span><span className="inline-flex items-center gap-2"><span aria-hidden className="size-2 rounded-sm bg-chart-2" />Other stages</span></>}
        chart={(animation) => <ComposedChart data={breakdown} margin={{ left: 1, right: 4, top: 10, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="status" tickLine={false} axisLine={false} tickMargin={9} minTickGap={10} />
          <YAxis width={28} tickLine={false} axisLine={false} tickCount={4} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} maxBarSize={32} {...animation}>
            {breakdown.map(({ status }) => <Cell key={status} fill={status === "Delivered" ? "var(--chart-1)" : "var(--chart-2)"} />)}
          </Bar>
        </ComposedChart>} />
    </div>
    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(17rem,1fr)]">
      <section className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-heading text-lg font-semibold">Recent orders</h2>
          <a href="/app/orders" className="df-press inline-flex min-h-11 items-center gap-1 rounded text-sm font-medium text-primary hover:underline">All orders <ArrowUpRight aria-hidden size={15} /></a></div>
        <DataTable label="Recent orders" rows={available ? orders.slice(0, 4) : []} columns={orderColumns} rowId={rowId} pageSize={4}
          loading={state === "loading"} empty={<OrdersEmpty />} error={state === "error" ? <LoadError target="the dashboard" retry="/app" /> : undefined} />
      </section>
      <ActivityFeed title="Recent activity" entries={available ? sample.activity.slice(0, older ? undefined : 3) : []} loading={state === "loading"}
        emptyMessage={state === "error" ? "Activity is unavailable." : "No activity for this period."}
        older={available && !older ? <button type="button" className="df-press min-h-11 rounded-md px-2 text-sm font-medium text-primary hover:bg-muted" onClick={() => setOlder(true)}>Load older activity</button> : undefined} />
    </div>
  </div>;
}

function AreaChartPlot({ trend, animation }: { trend: typeof sample.trend; animation: { isAnimationActive: boolean; animationDuration: number; onAnimationEnd: () => void } }) {
  return <ComposedChart data={trend} margin={{ left: 1, right: 10, top: 10, bottom: 0 }}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={9} minTickGap={26} />
    <YAxis width={28} tickLine={false} axisLine={false} tickCount={5} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Area dataKey="prior" type="monotone" stroke="var(--color-prior)" strokeWidth={2} fill="none" strokeDasharray="5 4" {...animation} />
    <Area dataKey="current" type="monotone" stroke="var(--color-current)" strokeWidth={2.5} fill="var(--color-current)" fillOpacity={0.14} {...animation} />
  </ComposedChart>;
}
