"use client";

/** TanStack Table v9 with semantic sorting, selection, paging and responsive cards. Motion: rows fade and reorder, bulk actions slide in. Catalog: data-table. */
import { Fragment, useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpDown, ChevronDown, Columns3, Ellipsis } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  columnVisibilityFeature, createColumnHelper, createPaginatedRowModel, createSortedRowModel,
  rowPaginationFeature, rowSelectionFeature, rowSortingFeature, sortFn_alphanumeric, sortFn_text, tableFeatures, useTable, type RowData,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@designfy/components/lib/cn";

const features = tableFeatures({
  columnVisibilityFeature, rowSelectionFeature, rowSortingFeature, rowPaginationFeature,
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
  sortedRowModel: createSortedRowModel(), paginatedRowModel: createPaginatedRowModel(),
});

export interface DataColumn<T> {
  /** Stable column identifier. */
  id: string;
  /** Header used in both presentations. */
  label: string;
  /** Raw sortable value. */
  value: (row: T) => string | number;
  /** Optional display formatting, editable control or custom cell. */
  cell?: (row: T) => ReactNode;
  /** Right align with tabular figures. */
  numeric?: boolean;
  /** Allow sorting on this column. */
  sortable?: boolean;
  /** Column metadata, including whether it appears in compact cards. */
  meta?: { key?: boolean };
}
export interface DataTableProps<T> {
  /** Accessible name for records. */
  label: string;
  /** Filtered records in default order. */
  rows: T[];
  /** Column definitions. */
  columns: readonly DataColumn<T>[];
  /** Creates stable selection and animation keys. */
  rowId: (row: T) => string;
  /** Number of records per page. */
  pageSize?: number;
  /** Present cards on phones or keep the table locally scrollable. */
  responsive?: "cards" | "scroll";
  /** Enables selection and renders commands for selected records. */
  bulkActions?: (rows: T[], clear: () => void) => ReactNode;
  /** Available actions for a row. */
  rowActions?: (row: T) => readonly { label: string; run: () => void; destructive?: boolean }[];
  /** Optional details for an expandable row. */
  rowDetails?: (row: T) => ReactNode;
  /** Show skeleton rows. */
  loading?: boolean;
  /** Error content takes precedence over empty data. */
  error?: ReactNode;
  /** First-use content. */
  empty?: ReactNode;
  /** Filtered-empty content, used only when filtered is true. */
  noResults?: ReactNode;
  /** Whether filters have been applied. */
  filtered?: boolean;
  /** Optional controls above the table. */
  toolbar?: ReactNode;
  /** Additional classes. */
  className?: string;
}

const iconButton = "df-press size-11";

function RowActions<T>({ row, name, actions }: { row: T; name: string; actions: NonNullable<DataTableProps<T>["rowActions"]> }) {
  return <DropdownMenu>
    <DropdownMenuTrigger asChild><Button type="button" variant="ghost" size="icon" aria-label={`Actions for ${name}`} className={iconButton}><Ellipsis aria-hidden /></Button></DropdownMenuTrigger>
    <DropdownMenuContent align="end">{actions(row).map((action) => <DropdownMenuItem key={action.label} variant={action.destructive ? "destructive" : "default"} onSelect={action.run} className="min-h-11">{action.label}</DropdownMenuItem>)}</DropdownMenuContent>
  </DropdownMenu>;
}

/** Displays a collection with real table semantics and an optional card presentation. */
export function DataTable<T extends RowData>({ label, rows, columns, rowId, pageSize = 10, responsive = "cards", bulkActions, rowActions, rowDetails, loading, error, empty, noResults, filtered, toolbar, className }: DataTableProps<T>) {
  const reduced = useReducedMotion();
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  function detailsButton(id: string) {
    return <Button type="button" variant="ghost" size="icon" className={cn(iconButton, "group")} aria-label={`Details for ${id}`} aria-expanded={!!expandedRows[id]} onClick={() => setExpandedRows((state) => ({ ...state, [id]: !state[id] }))}><ChevronDown aria-hidden className="transition-transform group-aria-expanded:rotate-180" /></Button>;
  }
  const defs = useMemo(() => {
    const helper = createColumnHelper<typeof features, T>();
    return helper.columns(columns.map((column) => helper.accessor(column.value, {
      id: column.id, header: column.label, enableSorting: column.sortable !== false,
      cell: (context) => column.cell ? column.cell(context.row.original) : context.getValue(),
    })));
  }, [columns]);
  const table = useTable({
    features, data: rows, columns: defs, getRowId: rowId, enableMultiSort: false,
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });
  const page = table.getRowModel().rows;
  const visible = table.getVisibleLeafColumns();
  const metadata = new Map(columns.map((column) => [column.id, column]));
  const cardColumns = visible.filter((column) => metadata.get(column.id)?.meta?.key);
  const selected = table.getSelectedRowModel().flatRows.map((row) => row.original);
  const sortIcon = (direction: false | "asc" | "desc") => direction === "asc" ? <ArrowUp aria-hidden size={14} /> : direction === "desc" ? <ArrowDown aria-hidden size={14} /> : <ArrowUpDown aria-hidden size={14} />;
  const pageIndex = table.state.pagination.pageIndex;

  return <section aria-label={label} aria-busy={loading || undefined} className={cn("@container min-w-0 rounded-xl border border-border bg-card", className)}>
    {(toolbar || rows.length > 0) && <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2 sm:px-4">
      {toolbar}
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button type="button" variant="outline" className="df-press ms-auto h-11"><Columns3 aria-hidden />Columns</Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table.getAllLeafColumns().map((column) => <DropdownMenuCheckboxItem key={column.id} checked={column.getIsVisible()}
            disabled={column.getIsVisible() && visible.length < 2}
            onSelect={(event) => event.preventDefault()} onCheckedChange={(checked) => column.toggleVisibility(checked)} className="min-h-11">{metadata.get(column.id)?.label}</DropdownMenuCheckboxItem>)}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>}
    {bulkActions && <div role="status" className="sr-only">{selected.length} selected</div>}
    {bulkActions && !!selected.length && !loading && !error && <div className="flex flex-wrap items-center justify-between gap-2 bg-accent px-4 py-2 text-sm text-accent-foreground motion-safe:animate-df-slide-in-left">
      <span className="font-semibold">{selected.length} selected</span><div className="flex flex-wrap gap-2">{bulkActions(selected, () => table.resetRowSelection(true))}</div>
    </div>}
    {loading ? <div className="divide-y divide-border" role="status"><span className="sr-only">Loading {label}</span>
      {Array.from({ length: Math.min(5, Math.max(1, pageSize)) }, (_, index) => <div key={index} className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, column) => <Skeleton key={column} className="h-5 w-full max-w-32 animate-none" />)}
      </div>)}
    </div> : error || (!page.length ? (filtered ? noResults : empty) ?? <p className="p-6 text-sm text-muted-foreground">{filtered ? "No matching records." : "No records yet."}</p> : <>
      <div role="region" aria-label={`${label} table`} tabIndex={0} className={cn("max-h-[42rem] overflow-auto", responsive === "cards" && "hidden md:block")}>
        <table className="w-full border-separate border-spacing-0 text-sm">
          <caption className="sr-only">{label}</caption>
          <thead className="sticky top-0 z-10 bg-muted text-muted-foreground"><tr>
            {bulkActions && <th scope="col" className="border-b border-border px-2"><label className="grid size-11 place-items-center"><Checkbox aria-label="Select page" checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() ? "indeterminate" : false)} onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked === true)} /></label></th>}
            {visible.map((column, index) => {
              const meta = metadata.get(column.id);
              const direction = column.getIsSorted();
              const content = meta?.label ?? column.id;
              return <th scope="col" key={column.id} aria-sort={direction === "asc" ? "ascending" : direction === "desc" ? "descending" : undefined}
                className={cn("whitespace-nowrap border-b border-border px-4 py-2 font-semibold", meta?.numeric ? "text-end" : "text-start", responsive === "scroll" && index === 0 && !bulkActions && "sticky start-0 bg-muted")}>
                {column.getCanSort() ? <button type="button" onClick={column.getToggleSortingHandler()} className="df-press inline-flex min-h-11 items-center gap-2 rounded-md hover:text-foreground">{content}{sortIcon(direction)}</button> : content}
              </th>;
            })}
            {(rowActions || rowDetails) && <th scope="col" className="border-b border-border px-3"><span className="sr-only">Actions</span></th>}
          </tr></thead>
          <tbody>{page.map((row) => <Fragment key={row.id}><motion.tr initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} layout={reduced || page.length > 30 ? false : "position"} transition={{ duration: 0.18 }}
            className={cn("group hover:bg-muted/60", row.getIsSelected() && "bg-accent")}>
            {bulkActions && <td className="border-b border-border px-2"><label className="grid size-11 place-items-center"><Checkbox aria-label={`Select ${row.id}`} checked={row.getIsSelected()} onCheckedChange={(checked) => row.toggleSelected(checked === true)} /></label></td>}
            {row.getVisibleCells().map((cell, index) => <td key={cell.id} className={cn("border-b border-border px-4 py-3", metadata.get(cell.column.id)?.numeric && "text-end tabular-nums", responsive === "scroll" && index === 0 && !bulkActions && "sticky start-0 bg-card group-hover:bg-muted")}>
              <table.FlexRender cell={cell} />
            </td>)}
            {(rowActions || rowDetails) && <td className="whitespace-nowrap border-b border-border text-end">{rowDetails && detailsButton(row.id)}{rowActions && <RowActions row={row.original} name={row.id} actions={rowActions} />}</td>}
          </motion.tr>{rowDetails && expandedRows[row.id] && <tr><td colSpan={visible.length + Number(!!bulkActions) + 1} className="border-b border-border bg-muted/50 px-4 py-3 motion-safe:animate-df-fade-in">{rowDetails(row.original)}</td></tr>}</Fragment>)}</tbody>
        </table>
      </div>
      {responsive === "cards" && <>
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2 md:hidden">
          {bulkActions && <label className="flex min-h-11 items-center gap-2 text-sm"><Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() ? "indeterminate" : false)} onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked === true)} />Select page</label>}
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button type="button" variant="ghost" className="df-press ms-auto h-11"><ArrowUpDown aria-hidden />Sort</Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">{visible.filter((column) => column.getCanSort()).map((column) => <DropdownMenuItem key={column.id} onSelect={() => column.toggleSorting(column.getIsSorted() === "asc")} className="min-h-11">{metadata.get(column.id)?.label}{sortIcon(column.getIsSorted())}</DropdownMenuItem>)}</DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ul className="divide-y divide-border md:hidden">{page.map((row) => <motion.li initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} layout={reduced || page.length > 30 ? false : "position"} transition={{ duration: 0.18 }} key={row.id} className={cn("min-w-0 px-4 py-3", row.getIsSelected() && "bg-accent")}>
          <div className="flex items-start gap-2">
            {bulkActions && <label className="grid min-h-11 min-w-11 place-items-center"><Checkbox aria-label={`Select ${row.id}`} checked={row.getIsSelected()} onCheckedChange={(checked) => row.toggleSelected(checked === true)} /></label>}
            <dl className="min-w-0 flex-1 divide-y divide-border">
              {row.getVisibleCells().filter((cell) => !cardColumns.length || cardColumns.includes(cell.column)).map((cell) => <div key={cell.id} className="flex flex-wrap justify-between gap-x-3 gap-y-1 py-2 text-sm">
                <dt className="text-muted-foreground">{metadata.get(cell.column.id)?.label}</dt>
                <dd className={cn("min-w-0 wrap-anywhere font-medium", metadata.get(cell.column.id)?.numeric && "ms-auto text-end tabular-nums")}><table.FlexRender cell={cell} /></dd>
              </div>)}
            </dl>
            {(rowDetails || rowActions) && <div className="grid">{rowDetails && detailsButton(row.id)}{rowActions && <RowActions row={row.original} name={row.id} actions={rowActions} />}</div>}
          </div>
          {rowDetails && expandedRows[row.id] && <div className="border-t border-border py-3 motion-safe:animate-df-fade-in">{rowDetails(row.original)}</div>}
        </motion.li>)}</ul>
      </>}
      <nav aria-label={`${label} pagination`} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2">
        <p className="text-sm tabular-nums text-muted-foreground">Page {pageIndex + 1} of {table.getPageCount()}</p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="icon" aria-label="Previous page" className={iconButton} disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}><ArrowLeft aria-hidden /></Button>
          <Button type="button" variant="outline" size="icon" aria-label="Next page" className={iconButton} disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}><ArrowRight aria-hidden /></Button>
        </div>
      </nav>
    </>)}
  </section>;
}
