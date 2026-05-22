import { useMemo as v, useState as L, useRef as A, useEffect as S } from "react";
import { useReactTable as B, createColumnHelper as j, getCoreRowModel as D } from "@tanstack/react-table";
import { router as w } from "@inertiajs/react";
import { useSearch as F } from "./useSearch.js";
import { useSort as I } from "./useSort.js";
import { usePagination as O } from "./usePagination.js";
import { useTableHooks as _ } from "./useTableHooks.js";
import { useColumnBuilder as $ } from "./useColumnBuilder.js";
const J = j(), q = D(), z = {
  wrapper: "rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900",
  toolbar: "flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700",
  table: "min-w-full",
  thead: "bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700",
  th: "px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-400",
  thSortable: "cursor-pointer select-none",
  thSorted: "text-gray-900 dark:text-gray-100",
  tbody: "divide-y divide-gray-100 dark:divide-gray-700",
  tr: "hover:bg-gray-50 transition-colors dark:hover:bg-gray-800",
  trClickable: "cursor-pointer",
  td: "px-4 py-3 text-sm text-gray-900 dark:text-gray-200",
  search: "rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:border-blue-400",
  pagination: "flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700",
  paginationButton: "px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700",
  paginationInfo: "text-sm text-gray-500 dark:text-gray-400",
  empty: "p-8 text-center text-gray-500 dark:text-gray-400",
  link: "text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
};
function p(r, e, a) {
  return r ? `${r}${e}` : a;
}
function re(r) {
  const {
    tableData: e,
    cellRenderers: a,
    headerRenderers: s,
    actions: g,
    renderCell: o,
    renderHeader: d,
    classNames: i,
    nullText: u = "-",
    iconResolver: b
  } = r, c = v(
    () => ({ ...z, ...i }),
    // Only recompute when overrides actually change (by value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(i)]
  ), n = e.identifier ?? null, l = p(n, "Search", "search"), y = p(n, "Sort", "sort"), t = p(n, "Page", "page"), { onPageChange: R } = O(t), { searchTerm: C, onSearch: P, hasExternalSearch: N } = F(e.searchDebounce, l, t, r.searchRef), { sortBy: T, sortDir: H, onSort: h, getSortState: x } = I(y, t), m = $({
    tableData: e,
    cellRenderers: a,
    headerRenderers: s,
    actions: g,
    renderCell: o,
    renderHeader: d,
    onSort: h,
    getSortState: x,
    nullText: u,
    classNames: c,
    iconResolver: b
  }), M = v(
    () => m.map(
      (f) => J.display({
        id: f.id,
        header: () => f.renderHeader(),
        cell: ({ row: k }) => f.renderCell(k.original, k.index)
      })
    ),
    [m]
  ), U = B({
    data: e.data,
    columns: M,
    getCoreRowModel: q
  });
  _(e);
  const E = G(e, l, y, t);
  return {
    table: U,
    columns: m,
    classNames: c,
    searchTerm: C,
    onSearch: P,
    hasExternalSearch: N,
    sortBy: T,
    sortDir: H,
    onSort: h,
    getSortState: x,
    onPageChange: R,
    isProcessing: E
  };
}
function G(r, e, a, s) {
  const [g, o] = L(!1), d = A(r.data);
  return S(() => {
    d.current !== r.data && (d.current = r.data, o(!1));
  }, [r.data]), S(() => {
    const i = [e, a, s], u = w.on("start", (c) => {
      try {
        const n = new URL(c.detail.visit.url), l = new URL(window.location.href);
        i.some((t) => n.searchParams.get(t) !== l.searchParams.get(t)) && o(!0);
      } catch {
        o(!0);
      }
    }), b = w.on("finish", () => {
      o(!1);
    });
    return () => {
      u(), b();
    };
  }, [e, a, s]), g;
}
export {
  re as useTable
};
