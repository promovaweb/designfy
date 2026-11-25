/** Example order CRUD, form validation, detail and staged file import. */
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpRight, FileUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityFeed } from "@/components/designfy/activity-feed/activity-feed";
import { DataTable } from "@/components/designfy/data-table/data-table";
import { DescriptionList } from "@/components/designfy/description-list/description-list";
import { FileUpload } from "@/components/designfy/file-upload/file-upload";
import { FilterBar } from "@/components/designfy/filter-bar/filter-bar";
import { FormLayout, useUnsavedChanges } from "@/components/designfy/form-layout/form-layout";
import { PageHeader } from "@/components/designfy/page-header/page-header";
import { Stepper } from "@/components/designfy/stepper/stepper";
import { LinkButton, LoadError, OrdersEmpty, StatusBadge, delay, navigate, orderColumns, rowId, statuses, usd, type DemoState, type Order, type OrderFields } from "./shared";
import sample from "./sample.json";

const schema = z.object({
  customer: z.string().trim().min(2, "Enter a customer name."),
  email: z.email("Enter a valid email address."),
  total: z.number("Enter an order total.").positive("Enter a total greater than zero."),
  status: z.enum(statuses),
});
const inputClass = "min-h-11";
const selectClass = "min-h-11 rounded-lg border border-input bg-background px-3 text-sm";
const back = { href: "/app/orders", label: "Back to orders" };

function OrderForm({ order, onSave, onCancel, blocked }: { order?: Order; onSave: (values: OrderFields) => Promise<void>; onCancel: () => void; blocked?: (guard: (() => boolean) | null) => void }) {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), shouldFocusError: false,
    defaultValues: order ? { customer: order.customer, email: order.email, total: order.total, status: schema.shape.status.parse(order.status) } : { customer: "", email: "", status: "Packed" } });
  const { errors, isDirty, isSubmitting, isSubmitSuccessful, submitCount } = form.formState;
  const canLeave = useUnsavedChanges(isDirty && !isSubmitSuccessful);
  useEffect(() => {
    blocked?.(canLeave);
    function protect(event: Event) { if (!canLeave()) event.preventDefault(); }
    window.addEventListener("parcel:navigate", protect);
    return () => { blocked?.(null); window.removeEventListener("parcel:navigate", protect); };
  }, [blocked, canLeave]);
  const validation = Object.entries(errors).map(([key, issue]) => ({ field: key === "root" ? undefined : `order-${key}`, message: issue?.message ?? "Check this field." }));
  const submit = form.handleSubmit(async (values) => {
    form.clearErrors("root");
    try { await onSave(values); form.reset(values, { keepIsSubmitted: true }); }
    catch { form.setError("root", { message: "Could not save the order. Try again." }); }
  }, () => undefined);

  const field = (name: "customer" | "email" | "total", label: string, type: string, placeholder: string) => <div className="grid gap-2">
    <Label htmlFor={`order-${name}`}>{label}</Label><Input id={`order-${name}`} type={type} placeholder={placeholder} className={inputClass}
      aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `order-${name}-error` : undefined} {...form.register(name, name === "total" ? { valueAsNumber: true } : undefined)} />
    {errors[name] && <p id={`order-${name}-error`} className="text-sm text-destructive">{errors[name]?.message}</p>}
  </div>;

  function onSubmit(event: FormEvent<HTMLFormElement>) { void submit(event); }

  return <FormLayout boxed layout={order ? "stacked" : "columns"} submitLabel={order ? "Save order" : "Create order"} onSubmit={onSubmit} errors={validation} errorKey={submitCount}
    dirty={isDirty} submitting={isSubmitting} saved={isSubmitSuccessful} cancel={<Button variant="outline" type="button" className="df-press h-11" onClick={() => { if (canLeave()) onCancel(); }}>Cancel</Button>}
    sections={[
      { id: "customer-section", title: "Customer", description: "Who should receive this order and its updates.", fields: <>{field("customer", "Customer name", "text", "Sample Studio")}{field("email", "Email address", "email", "studio@example.test")}</> },
      { id: "shipment-section", title: "Shipment", description: "The current stage and value in US dollars.", fields: <>{field("total", "Order total (USD)", "number", "0.00")}<div className="grid gap-2">
        <Label htmlFor="order-status">Status</Label><select id="order-status" className={selectClass} {...form.register("status")}>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
      </div></> },
    ]} />;
}

export function Orders({ orders, query, state, save, remove }: {
  orders: Order[]; query: URLSearchParams; state: DemoState; save: (order: Order, data: OrderFields) => Promise<void>; remove: (ids: string[]) => Promise<void>;
}) {
  const [editing, setEditing] = useState<Order>();
  const [confirm, setConfirm] = useState<{ ids: string[]; clear?: () => void }>();
  const [deleting, setDeleting] = useState(false);
  const editGuardRef = useRef<(() => boolean) | null>(null);
  const search = query.get("query") ?? "";
  const status = query.get("status") ?? "";
  const from = query.get("from") ?? "";
  const filtered = Boolean(search || status || from);
  const rows = useMemo(() => state === "ready" ? orders.filter((order) =>
    (!search || `${order.id} ${order.customer}`.toLowerCase().includes(search.toLowerCase())) &&
    (!status || order.status === status) && (!from || order.date >= from)) : [], [orders, search, status, from, state]);

  function change(key: string, value: string) {
    const next = new URLSearchParams(location.search);
    if (value) next.set(key, value); else next.delete(key);
    navigate(`/app/orders${next.size ? `?${next}` : ""}`, true);
  }
  function clear() {
    const next = new URLSearchParams(location.search);
    for (const filter of ["query", "status", "from"]) next.delete(filter);
    navigate(`/app/orders${next.size ? `?${next}` : ""}`, true);
  }
  return <div className="grid gap-6">
    <PageHeader title="Orders" description="Track shipments from intake to delivery."
      primaryAction={<LinkButton primary href="/app/orders/new"><Plus aria-hidden /> New order</LinkButton>}
      secondaryActions={<LinkButton href="/app/orders/import"><FileUp aria-hidden /> Import</LinkButton>}
      mobileActions={<DropdownMenuItem asChild className="min-h-11"><a href="/app/orders/import" onClick={(event) => { event.preventDefault(); navigate("/app/orders/import"); }}>Import orders</a></DropdownMenuItem>} />
    <FilterBar query={search} onChange={change} onClear={clear} resultCount={rows.length} searchLabel="Search orders"
      attributes={[{ id: "status", label: "Status", value: status, options: statuses.map((value) => ({ label: value, value })) }]}
      dateRange={<label className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">Created from<Input aria-label="Created from" type="date" value={from} onChange={(event) => change("from", event.target.value)} className="h-11 w-auto max-w-full" /></label>}
      extraChips={from ? [{ id: "from", label: `From ${from}`, remove: () => change("from", "") }] : undefined} />
    <DataTable label="Orders" rows={rows} columns={orderColumns} rowId={rowId} pageSize={5} loading={state === "loading"} filtered={filtered}
      empty={<OrdersEmpty />} noResults={<OrdersEmpty filtered onClear={clear} />}
      error={state === "error" ? <LoadError target="orders" retry="/app/orders" /> : undefined}
      bulkActions={(selected, clearSelection) => <><Button variant="ghost" type="button" className="h-11" onClick={clearSelection}>Clear selection</Button>
        <Button variant="destructive" type="button" className="h-11" onClick={() => setConfirm({ ids: selected.map(rowId), clear: clearSelection })}><Trash2 aria-hidden />Delete</Button></>}
      rowActions={(order) => [
        { label: "View order", run: () => navigate(`/app/orders/${order.id}`) },
        { label: "Edit order", run: () => setEditing(order) },
        { label: "Delete order", run: () => setConfirm({ ids: [order.id] }), destructive: true },
      ]} />
    <Sheet open={!!editing} onOpenChange={(open) => { if (!open && (!editGuardRef.current || editGuardRef.current())) setEditing(undefined); }}>
      <SheetContent className="w-full overflow-y-auto px-4 pt-5 sm:max-w-lg sm:px-6">
        <SheetTitle>Edit {editing?.id}</SheetTitle><SheetDescription>Update the customer or shipment details.</SheetDescription>
        {editing && <OrderForm key={editing.id} order={editing} onCancel={() => setEditing(undefined)} onSave={async (data) => {
          await save(editing, data); setEditing(undefined); toast.success("Order saved");
        }} blocked={(check) => { editGuardRef.current = check; }} />}
      </SheetContent>
    </Sheet>
    <AlertDialog open={!!confirm} onOpenChange={(open) => { if (!open && !deleting) setConfirm(undefined); }}>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle>Delete {confirm?.ids.length === 1 ? "this order" : `${confirm?.ids.length ?? 0} orders`}?</AlertDialogTitle>
          <AlertDialogDescription>Selected records will be removed from this demo workspace.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel disabled={deleting} className="min-h-11">Cancel</AlertDialogCancel>
          <Button variant="destructive" disabled={deleting} className="min-h-11" onClick={async () => {
            if (!confirm) return;
            setDeleting(true);
            try { await remove(confirm.ids); confirm.clear?.(); setConfirm(undefined); toast.success("Orders removed"); }
            catch { toast.error("Could not delete the orders"); }
            finally { setDeleting(false); }
          }}>{deleting ? "Deleting…" : "Delete orders"}</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>;
}

export function NewOrder({ create }: { create: (data: OrderFields) => Promise<void> }) {
  return <div className="grid gap-6">
    <PageHeader title="Create an order" description="Record a sample shipment and its customer details." back={back} />
    <OrderForm onCancel={() => navigate("/app/orders", false, true)} onSave={async (data) => { await create(data); toast.success("Order created"); navigate("/app/orders", false, true); }} />
  </div>;
}

export function OrderDetail({ order }: { order?: Order }) {
  const [tab, setTab] = useState("overview");
  if (!order) return <div className="space-y-6"><PageHeader title="Order unavailable" back={back} /><LoadError target="this order" retry="/app/orders" /></div>;
  return <Tabs value={tab} onValueChange={setTab} className="grid gap-5">
    <PageHeader title={order.id} description={`Shipment for ${order.customer}`} status={<StatusBadge status={order.status} />} back={back}
      primaryAction={<LinkButton href="/app/orders"><ArrowUpRight aria-hidden />All orders</LinkButton>}
      tabs={<TabsList variant="line" aria-label="Order sections" className="h-12"><TabsTrigger value="overview" className="min-h-11 px-4">Overview</TabsTrigger><TabsTrigger value="activity" className="min-h-11 px-4">Activity</TabsTrigger></TabsList>} />
    <TabsContent value="overview" className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <DescriptionList title="Shipment details" variant="card" items={[
        { term: "Order", value: order.id, copy: order.id }, { term: "Customer", value: order.customer },
        { term: "Email", value: order.email, copy: order.email }, { term: "Status", value: <StatusBadge status={order.status} /> },
        { term: "Total", value: usd(order.total) }, { term: "Created", value: order.date }, { term: "Tracking number" },
      ]} />
      <ActivityFeed title="Latest update" entries={sample.activity.filter((item) => item.action.includes(order.id)).slice(0, 1)} />
    </TabsContent>
    <TabsContent value="activity"><ActivityFeed title="Order activity" entries={sample.activity.filter((item) => item.action.includes(order.id))} /></TabsContent>
  </Tabs>;
}

const uploadSteps = [{ id: "upload", label: "Upload a CSV" }, { id: "review", label: "Review files" }, { id: "finish", label: "Confirm import" }];
async function simulateUpload(file: File, signal: AbortSignal, progress: (value: number) => void) {
  for (const percent of [20, 45, 70, 100]) {
    await delay(170);
    if (signal.aborted) return;
    if (file.name.includes("fail") && percent > 45) throw new Error("Demo failure");
    progress(percent);
  }
}

export function ImportOrders() {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<readonly File[]>([]);
  const [invalid, setInvalid] = useState(false);
  function next() {
    if (!step && !files.length) { setInvalid(true); return; }
    if (step < 2) { setStep(step + 1); return; }
    toast.success(`Demo import complete for ${files.length} ${files.length === 1 ? "file" : "files"}`);
    navigate("/app/orders");
  }
  return <div className="grid gap-6">
    <PageHeader title="Import orders" description="Try the import workflow using a sample CSV." back={back} />
    <Stepper current={step} steps={uploadSteps.map((item, index) => ({ ...item, error: invalid && index === 0 }))} onBack={() => setStep(step - 1)} onNext={next} finishLabel="Import orders">
      <div hidden={step !== 0}><FileUpload headingLevel={3} title="Drop a CSV here" limits="Up to 3 CSV files, 5 MB each." accept=".csv" maxFiles={3} maxBytes={5_000_000} upload={simulateUpload}
        onFilesChange={(nextFiles) => { if (nextFiles.length) setInvalid(false); if (nextFiles.length !== files.length || nextFiles.some((file, index) => file !== files[index])) setFiles(nextFiles); }} />
        {invalid && <p role="alert" className="mt-3 text-sm text-destructive">Upload at least one CSV before continuing.</p>}
      </div>
      {step === 1 && <ul className="divide-y divide-border rounded-xl border border-border bg-card">{files.map((file, index) => <li key={index} className="flex flex-wrap justify-between gap-2 p-4 text-sm"><span>{file.name}</span><span className="text-muted-foreground">{Math.ceil(file.size / 1024)} KB</span></li>)}</ul>}
      {step === 2 && <p className="text-sm text-muted-foreground">Ready to simulate importing {files.length} {files.length === 1 ? "file" : "files"}.</p>}
    </Stepper>
  </div>;
}
