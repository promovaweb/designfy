/** Local order types, demo routing, common actions and state fixtures. */
import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/designfy/empty-state/empty-state";
import { ErrorState } from "@/components/designfy/error-state/error-state";
import type { DataColumn } from "@/components/designfy/data-table/data-table";
import sample from "./sample.json";

export type Order = typeof sample.orders[number];
export type OrderFields = Pick<Order, "customer" | "email" | "total" | "status">;
export type DemoState = "ready" | "loading" | "empty" | "error";
export const statuses = ["Packed", "In transit", "Delivered"] as const;
export const usd = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
export const rowId = (row: Order) => row.id;
export const delay = (ms = 450) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function navigate(href: string, replace = false, confirmed = false) {
  if (href === location.pathname + location.search) return;
  if (!confirmed && href.split("?")[0] !== location.pathname && !window.dispatchEvent(new Event("parcel:navigate", { cancelable: true }))) return;
  history[replace ? "replaceState" : "pushState"](null, "", href);
  dispatchEvent(new PopStateEvent("popstate"));
}

export function useLocation() {
  const get = () => location.pathname + location.search;
  const [url, setUrl] = useState(get);
  useEffect(() => {
    const update = () => setUrl(get());
    addEventListener("popstate", update);
    return () => removeEventListener("popstate", update);
  }, []);
  const parsed = new URL(url, location.origin);
  return { path: parsed.pathname, query: parsed.searchParams };
}

export function interceptNavigation(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return;
  const link = (event.target as Element).closest("a[href]");
  const href = link?.getAttribute("href");
  if (!href?.startsWith("/") || href.startsWith("//")) return;
  event.preventDefault();
  navigate(href);
}

export function useDemoState(query: URLSearchParams) {
  const requested = query.get("state");
  const latency = Number(query.get("latency"));
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!Number.isFinite(latency) || latency <= 0) return;
    const timer = setTimeout(() => setElapsed(latency), Math.min(latency, 10_000));
    return () => clearTimeout(timer);
  }, [latency]);
  if (latency > 0 && elapsed !== latency) return "loading";
  return requested === "error" || requested === "empty" || requested === "loading" ? requested : "ready";
}

export function LinkButton({ href, children, primary }: { href: string; children: ReactNode; primary?: boolean }) {
  return <Button asChild variant={primary ? "default" : "outline"} className="df-press min-h-11"><a href={href}>{children}</a></Button>;
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = { Packed: "bg-warning/10 text-warning", "In transit": "bg-info/10 text-info", Delivered: "bg-success/10 text-success" };
  return <Badge variant="secondary" className={colors[status]}>{status}</Badge>;
}

export const orderColumns: readonly DataColumn<Order>[] = [
  { id: "order", label: "Order", value: (order) => order.id, meta: { key: true },
    cell: (order) => <a href={`/app/orders/${order.id}`} className="inline-flex min-h-11 items-center rounded-sm font-semibold text-primary hover:underline">{order.id}</a> },
  { id: "customer", label: "Customer", value: (order) => order.customer, meta: { key: true } },
  { id: "status", label: "Status", value: (order) => order.status, cell: (order) => <StatusBadge status={order.status} />, meta: { key: true } },
  { id: "date", label: "Created", value: (order) => order.date,
    cell: (order) => <time dateTime={order.date} className="whitespace-nowrap text-muted-foreground">{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(order.date))}</time> },
  { id: "total", label: "Total", value: (order) => order.total, numeric: true, cell: (order) => usd(order.total), meta: { key: true } },
];

export function OrdersEmpty({ filtered = false, onClear }: { filtered?: boolean; onClear?: () => void }) {
  return <EmptyState headingLevel={2} title={filtered ? "No matches found" : "No orders yet"}
    description={filtered ? "Try another search or clear the filters to see more orders." : "Create an order to start tracking a sample shipment."}
    illustration={<Inbox size={28} />} primaryAction={filtered ? <Button className="min-h-11" onClick={onClear}>Clear filters</Button> : <LinkButton primary href="/app/orders/new">Create an order</LinkButton>} />;
}

export function LoadError({ target, retry }: { target: string; retry: string }) {
  return <ErrorState announce title={`Couldn’t load ${target}`} description="Refresh the data to try the request again." code="DEMO-503" action={<LinkButton primary href={retry}>Try again</LinkButton>} />;
}
