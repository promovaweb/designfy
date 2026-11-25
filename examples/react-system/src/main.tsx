/** Example application routes, shell navigation, settings and auth flows. */
import "@fontsource-variable/inter";
import "@fontsource-variable/manrope";
import "./styles.css";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Bell, Box, ChevronDown, ChevronRight, CircleHelp, Command as CommandIcon, LayoutDashboard, PackageOpen, Search, Settings, User, Users } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import { AppShell } from "@/components/designfy/app-shell/app-shell";
import { AuthCard } from "@/components/designfy/auth-card/auth-card";
import { PageHeader } from "@/components/designfy/page-header/page-header";
import { SettingsLayout } from "@/components/designfy/settings-layout/settings-layout";
import { SettingsSection } from "@/components/designfy/settings-section/settings-section";
import { Dashboard } from "./dashboard";
import { ImportOrders, NewOrder, OrderDetail, Orders } from "./orders";
import { delay, interceptNavigation, navigate, useDemoState, useLocation, type OrderFields } from "./shared";
import sample from "./sample.json";

const scheme = matchMedia("(prefers-color-scheme: dark)");
function assignTheme() { document.documentElement.classList.toggle("dark", scheme.matches); }
assignTheme();
scheme.addEventListener("change", assignTheme);

const mainNav = [{ label: "Workspace", items: [
  { href: "/app", label: "Overview", icon: <LayoutDashboard size={17} /> },
  { href: "/app/orders", label: "Orders", icon: <PackageOpen size={17} /> },
  { href: "/app/settings", label: "Settings", icon: <Settings size={17} /> },
] }];

function Brand() {
  return <span className="inline-flex min-w-0 items-center gap-2.5 font-heading text-base font-bold">
    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"><Box aria-hidden size={18} /></span>
    <span className="truncate">Parcel Lab</span>
  </span>;
}

function WorkspaceSwitcher() {
  return <DropdownMenu>
    <DropdownMenuTrigger className="df-press flex min-h-11 w-full items-center justify-between gap-2 rounded-lg p-1 hover:bg-sidebar-accent" aria-label="Switch workspace"><Brand /><ChevronDown aria-hidden size={14} /></DropdownMenuTrigger>
    <DropdownMenuContent align="start"><DropdownMenuItem className="min-h-11" onSelect={() => toast.info("Parcel Lab is the sample workspace")}>Parcel Lab · Sample workspace</DropdownMenuItem></DropdownMenuContent>
  </DropdownMenu>;
}

function ShellAccount({ openCommand }: { openCommand: () => void }) {
  return <DropdownMenu>
    <DropdownMenuTrigger className="df-press grid size-11 place-items-center rounded-lg hover:bg-muted" aria-label="Account menu"><Avatar size="sm"><AvatarFallback>SO</AvatarFallback></Avatar></DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem className="min-h-11 sm:hidden" onSelect={openCommand}>Search screens</DropdownMenuItem>
      <DropdownMenuItem className="min-h-11 sm:hidden" onSelect={() => toast.info("No new sample notifications")}>Notifications</DropdownMenuItem>
      <DropdownMenuItem className="min-h-11" onSelect={() => navigate("/app/settings")}>Account settings</DropdownMenuItem>
      <DropdownMenuItem className="min-h-11" onSelect={() => navigate("/login")}>Sign out of demo</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>;
}

const areaLinks = [
  { href: "/app/settings", label: "Profile", icon: <User size={17} /> },
  { href: "/app/settings/notifications", label: "Notifications", icon: <Bell size={17} /> },
  { href: "/app/settings/workspace", label: "Workspace", icon: <Users size={17} /> },
];
function SettingsPage({ path }: { path: string }) {
  const current = areaLinks.find((item) => item.href === path) ?? areaLinks[0];
  const [profile, setProfile] = useState({ name: "Sample Operator", email: "operator@example.test" });
  const [draft, setDraft] = useState(profile);
  const [daily, setDaily] = useState(true);
  const [delays, setDelays] = useState(false);
  const [reset, setReset] = useState(false);
  return <div className="grid gap-6">
    <PageHeader title="Settings" description="Manage your sample profile, alerts and workspace." />
    <SettingsLayout areas={areaLinks} current={current.href} title={current.label}>
      {current.label === "Profile" && <SettingsSection title="Contact information" description="These sample details appear in the account record."
        dirty={profile.name !== draft.name || profile.email !== draft.email} onReset={() => setDraft(profile)}
        onSave={async () => { await delay(); setProfile(draft); }}>
        <div className="grid gap-2"><Label htmlFor="profile-name">Display name</Label><Input id="profile-name" className="h-11" required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></div>
        <div className="grid gap-2"><Label htmlFor="profile-email">Email address</Label><Input id="profile-email" className="h-11" type="email" required value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></div>
      </SettingsSection>}
      {current.label === "Notifications" && <SettingsSection title="Shipment alerts" description="Choose which events appear in this demo."
        toggles={[
          { id: "daily", label: "Daily digest", description: "A daily summary of sample orders.", checked: daily, save: async (value) => { await delay(); setDaily(value); } },
          { id: "delays", label: "Shipment delays", description: "A notification when a shipment misses its estimate.", checked: delays, save: async (value) => { await delay(); setDelays(value); } },
        ]} />}
      {current.label === "Workspace" && <>
        <SettingsSection title="Workspace information" description="Your current sample organization."><p className="text-sm font-medium">Parcel Lab · Sample workspace</p></SettingsSection>
        <SettingsSection title="Danger zone" description={reset ? "The demo reset was confirmed." : "Reset this example workspace to its starting configuration."}
          danger={{ label: "Reset workspace", title: "Reset the demo workspace?", description: "Profile and notification preferences will return to the example defaults.",
            run: async () => { await delay(); const original = { name: "Sample Operator", email: "operator@example.test" }; setProfile(original); setDraft(original); setDaily(true); setDelays(false); setReset(true); } }} />
      </>}
    </SettingsLayout>
  </div>;
}

const authModes = {
  "sign-in": { title: "Sign in to Parcel Lab", description: "Enter your sample credentials to open the workspace.", action: "Sign in" },
  "sign-up": { title: "Create a demo account", description: "Use a sample email to try the sign-up flow.", action: "Create account" },
  recover: { title: "Recover your account", description: "Enter a sample email to request a verification code.", action: "Send code" },
  verify: { title: "Enter your verification code", description: "In this demo, use the sample code 123456.", action: "Verify code" },
} as const;

function Login({ query }: { query: URLSearchParams }) {
  const requested = query.get("mode");
  const mode = requested === "sign-up" || requested === "recover" || requested === "verify" ? requested : "sign-in";
  const copy = authModes[mode];
  return <AuthCard mode={mode} title={copy.title} description={copy.description} submitLabel={copy.action} logo={<Brand />}
    onSubmit={async (value) => {
      await delay();
      if (query.get("state") === "error" || (mode === "verify" && value.code !== "123456")) throw new Error("Demo rejection");
      navigate(mode === "recover" || mode === "sign-up" ? "/login?mode=verify" : "/app");
    }}
    alternate={<div className="flex flex-wrap gap-x-4">
      {mode !== "sign-in" && <a href="/login" className="inline-flex min-h-11 items-center font-medium text-primary hover:underline">Back to sign in</a>}
      {mode === "sign-in" && <><a href="/login?mode=recover" className="inline-flex min-h-11 items-center font-medium text-primary hover:underline">Forgot password?</a><a href="/login?mode=sign-up" className="inline-flex min-h-11 items-center font-medium text-primary hover:underline">Create an account</a></>}
    </div>}
    legal="Parcel Lab is a fictional workspace for the Designfy component demo."
    brand={{ preset: "signal-grid", content: <div className="space-y-5 rounded-xl border border-border bg-card p-9">
      <div className="flex items-center gap-2 text-sm font-medium text-primary"><PackageOpen aria-hidden size={19} /> Parcel Lab</div>
      <p className="max-w-[13ch] font-heading text-headline font-semibold leading-tight">Track the journey of every order.</p>
      <p className="max-w-[38ch] text-sm text-muted-foreground">Explore an example workspace for shipment intake, fulfillment and delivery.</p>
    </div> }} />;
}

function App() {
  const { path, query } = useLocation();
  const state = useDemoState(query);
  const [orders, setOrders] = useState(sample.orders);
  const [command, setCommand] = useState(false);
  const isOrders = path.startsWith("/app/orders");
  const isSettings = path.startsWith("/app/settings");
  const id = path.split("/")[3];
  const label = isOrders ? "Orders" : isSettings ? "Settings" : "Overview";
  const openCommand = () => setCommand(true);
  const fail = query.get("mutations") === "error";

  async function mutation() { await delay(); if (fail) throw new Error("Demo mutation failure"); }
  async function create(fields: OrderFields) {
    await mutation();
    setOrders((rows) => [{ ...fields, id: `PL-${Math.max(1040, ...rows.map((row) => Number(row.id.slice(3)))) + 1}`, date: new Date().toISOString().slice(0, 10) }, ...rows]);
  }
  return <div onClick={interceptNavigation} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); openCommand(); } }}>
    {path === "/login" ? <Login query={query} /> : <AppShell brand={<WorkspaceSwitcher />} groups={mainNav} routeKey={path}
      activeHref={isOrders ? "/app/orders" : isSettings ? "/app/settings" : "/app"}
      mark={<span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Box aria-hidden size={19} /></span>}
      footer={<div className="flex items-center gap-2 text-xs text-muted-foreground"><CircleHelp aria-hidden size={16} />Sample workspace</div>}
      breadcrumbs={{ full: <nav aria-label="Breadcrumbs" className="flex items-center gap-2"><a href="/app" className="inline-flex min-h-11 items-center hover:text-foreground">Workspace</a><ChevronRight aria-hidden size={14} /><span aria-current="page" className="font-medium text-foreground">{label}</span></nav>,
        compact: <nav aria-label="Breadcrumbs"><span aria-current="page" className="font-medium text-foreground">{label}</span></nav> }}
      tools={<><Button variant="outline" type="button" aria-label="Search screens" onClick={openCommand} className="df-press h-11 gap-2"><Search aria-hidden /><span>Search</span><kbd className="hidden items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground lg:inline-flex"><CommandIcon aria-hidden size={12} />K</kbd></Button>
        <Button variant="ghost" size="icon" type="button" className="df-press size-11" aria-label="Notifications" onClick={() => toast.info("No new sample notifications")}><Bell aria-hidden /></Button></>}
      account={<ShellAccount openCommand={openCommand} />}>
      {path === "/app/orders" ? <Orders orders={orders} state={state} query={query}
        save={async (order, fields) => { await mutation(); setOrders((rows) => rows.map((row) => row.id === order.id ? { ...row, ...fields } : row)); }}
        remove={async (ids) => { await mutation(); setOrders((rows) => rows.filter((row) => !ids.includes(row.id))); }} />
        : id === "new" && isOrders ? <NewOrder create={create} />
        : id === "import" && isOrders ? <ImportOrders />
        : isOrders ? <OrderDetail key={id} order={orders.find((order) => order.id === id)} />
        : isSettings ? <SettingsPage path={path} /> : <Dashboard orders={orders} state={state} />}
    </AppShell>}
    <CommandDialog open={command} onOpenChange={setCommand} title="Search screens" description="Find a sample workspace screen.">
      <CommandInput placeholder="Search screens" /><CommandList><CommandEmpty>No screens found.</CommandEmpty><CommandGroup heading="Workspace">
        {mainNav[0].items.map((item) => <CommandItem key={item.href} className="min-h-11" onSelect={() => { setCommand(false); navigate(item.href); }}>{item.icon}{item.label}</CommandItem>)}
      </CommandGroup></CommandList>
    </CommandDialog>
    <Toaster position="bottom-right" />
  </div>;
}

createRoot(document.getElementById("root")!).render(<App />);
