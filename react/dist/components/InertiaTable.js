import { jsxs as b, jsx as a } from "react/jsx-runtime";
import M from "react";
import { flexRender as T } from "@tanstack/react-table";
import { useTable as V } from "../hooks/useTable.js";
import { TableSearch as q } from "./TableSearch.js";
import { TablePagination as z } from "./TablePagination.js";
import { TableEmpty as G } from "./TableEmpty.js";
function Y(N) {
  const {
    tableData: r,
    className: $,
    modal: j,
    onRowClick: s,
    rowClassName: h,
    isFetching: E = !1,
    emptyText: F,
    renderToolbar: y,
    renderToolbarActions: l,
    renderSearch: w,
    renderPagination: C,
    renderEmpty: S,
    renderRow: k
  } = N, {
    table: p,
    columns: x,
    classNames: t,
    searchTerm: g,
    onSearch: u,
    hasExternalSearch: I,
    onPageChange: v,
    isProcessing: H
  } = V(N), D = r.data.length > 0, f = r.searchable && !I, c = E || H, P = s ? (e, n) => {
    n.target.closest('a, button, input, select, textarea, [role="button"]') || s(e);
  } : void 0, R = new Set(x.filter((e) => e.fit).map((e) => e.id)), B = p.getAllColumns().length, K = [
    j ? "" : t.wrapper,
    $ ?? ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ b("div", { className: K, children: [
    (f || l) && (y ? y({
      searchable: f,
      searchTerm: g,
      onSearch: u,
      children: (l == null ? void 0 : l()) ?? null
    }) : /* @__PURE__ */ b("div", { className: t.toolbar, children: [
      f && (w ? w({ searchTerm: g, onSearch: u, placeholder: "Search..." }) : /* @__PURE__ */ a(
        q,
        {
          searchTerm: g,
          onSearch: u,
          className: t.search
        }
      )),
      l == null ? void 0 : l()
    ] })),
    /* @__PURE__ */ a("div", { className: `overflow-x-auto transition-opacity duration-150${c ? " opacity-50 pointer-events-none" : ""}`, "aria-busy": c, children: /* @__PURE__ */ b("table", { className: t.table, children: [
      /* @__PURE__ */ a("thead", { className: t.thead, children: p.getHeaderGroups().map((e) => /* @__PURE__ */ a("tr", { children: e.headers.map((n) => {
        const o = x.find((d) => d.id === n.column.id), m = o == null ? void 0 : o.getAriaSort();
        return /* @__PURE__ */ a(
          "th",
          {
            className: `${t.th}${R.has(n.column.id) ? " w-0 whitespace-nowrap" : ""}`,
            "aria-sort": m,
            children: n.isPlaceholder ? null : T(n.column.columnDef.header, n.getContext())
          },
          n.id
        );
      }) }, e.id)) }),
      /* @__PURE__ */ a("tbody", { className: t.tbody, children: D ? p.getRowModel().rows.map((e, n) => {
        const o = [
          t.tr,
          s ? t.trClickable : "",
          (h == null ? void 0 : h(e.original, n)) ?? ""
        ].filter(Boolean).join(" "), m = P ? {
          role: "button",
          tabIndex: 0,
          onClick: (i) => P(e.original, i),
          onKeyDown: (i) => {
            (i.key === "Enter" || i.key === " ") && (i.preventDefault(), s(e.original));
          }
        } : {}, d = e.getVisibleCells().map((i) => /* @__PURE__ */ a("td", { className: `${t.td}${R.has(i.column.id) ? " w-0 whitespace-nowrap" : ""}`, children: T(i.column.columnDef.cell, i.getContext()) }, i.id));
        return k ? /* @__PURE__ */ a(M.Fragment, { children: k({
          row: e.original,
          children: /* @__PURE__ */ a("tr", { className: o, ...m, children: d }),
          rowIndex: n
        }) }, e.id) : /* @__PURE__ */ a("tr", { className: o, ...m, children: d }, e.id);
      }) : S ? /* @__PURE__ */ a("tr", { children: /* @__PURE__ */ a("td", { colSpan: B, children: S() }) }) : /* @__PURE__ */ a(
        G,
        {
          colSpan: B,
          emptyText: F,
          className: t.empty
        }
      ) })
    ] }) }),
    D && (C ? C({
      links: r.links,
      meta: r.meta,
      onPageChange: v,
      isFetching: c
    }) : /* @__PURE__ */ a(
      z,
      {
        links: r.links,
        meta: r.meta,
        onPageChange: v,
        isFetching: c,
        classNames: {
          pagination: t.pagination,
          paginationButton: t.paginationButton,
          paginationInfo: t.paginationInfo
        }
      }
    ))
  ] });
}
export {
  Y as InertiaTable
};
