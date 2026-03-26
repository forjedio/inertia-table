import { jsx as c, jsxs as T } from "react/jsx-runtime";
import p, { useState as V, useRef as $, useCallback as H, useEffect as R, useMemo as J } from "react";
import { useReactTable as te, createColumnHelper as re, getCoreRowModel as ne, flexRender as Z } from "@tanstack/react-table";
import { router as W, Link as oe } from "@inertiajs/react";
function P(e, t = "page") {
  const r = new URL(window.location.href);
  for (const [n, i] of Object.entries(e))
    i === null ? r.searchParams.delete(n) : r.searchParams.set(n, i);
  t in e || r.searchParams.delete(t), W.get(r.toString(), {}, { preserveState: !0, preserveScroll: !0 });
}
function ae(e, t, r, o) {
  const [n, i] = V(() => typeof window > "u" ? "" : new URLSearchParams(window.location.search).get(t) ?? ""), u = $(null), a = H(
    (l) => {
      i(l), u.current && clearTimeout(u.current), u.current = setTimeout(() => {
        P(
          { [t]: l || null },
          r
        );
      }, e);
    },
    [e, t, r]
  );
  return R(() => () => {
    u.current && clearTimeout(u.current);
  }, []), R(() => {
    if (!(o != null && o.current)) return;
    const l = o.current;
    if (typeof window > "u") return;
    const f = new URLSearchParams(window.location.search).get(t) ?? "";
    l.value !== f && (l.value = f);
    const g = () => {
      a(l.value);
    };
    return l.addEventListener("input", g), () => {
      l.removeEventListener("input", g);
    };
  }, [o, t, a]), { searchTerm: n, onSearch: a, hasExternalSearch: !!o };
}
function q(e) {
  return e ? e.startsWith("-") ? { sortBy: e.slice(1), sortDir: "desc" } : { sortBy: e, sortDir: "asc" } : { sortBy: null, sortDir: "asc" };
}
function ie(e, t) {
  const r = typeof window < "u" ? window.location.search : "", o = new URLSearchParams(r), { sortBy: n, sortDir: i } = q(o.get(e)), u = H(
    (l) => {
      const d = new URLSearchParams(window.location.search), { sortBy: f, sortDir: g } = q(d.get(e));
      P(f === l ? g === "asc" ? { [e]: `-${l}` } : { [e]: null } : { [e]: l }, t);
    },
    [e, t]
  ), a = H(
    (l) => ({
      active: n === l,
      direction: n === l ? i : null
    }),
    [n, i]
  );
  return { sortBy: n, sortDir: i, onSort: u, getSortState: a };
}
function se(e) {
  return { onPageChange: H(
    (r) => {
      P({ [e]: String(r) }, e);
    },
    [e]
  ) };
}
const j = /* @__PURE__ */ new Map();
function Ie(e, t) {
  j.has(e) || j.set(e, []), j.get(e).push(t);
}
function De(e) {
  e ? j.delete(e) : j.clear();
}
function le(e) {
  const t = $("");
  R(() => {
    const r = JSON.stringify(e.tableSettings);
    if (t.current === r) return;
    t.current = r;
    const o = [], n = () => {
      W.reload();
    };
    for (const [i, u] of Object.entries(e.tableSettings)) {
      const a = j.get(i) ?? [];
      for (const l of a) {
        const f = l({
          value: u,
          tableData: e,
          refresh: n
        });
        typeof f == "function" && o.push(f);
      }
    }
    return () => {
      o.forEach((i) => i());
    };
  }, [e]);
}
function ce(e, t, r) {
  return "key" in t && t.key ? e[t.key] : e[r];
}
function Q({ value: e, nullText: t = "-" }) {
  return e == null ? /* @__PURE__ */ c("span", { className: "text-gray-400 dark:text-gray-500", children: t }) : /* @__PURE__ */ c("span", { children: String(e) });
}
const z = /* @__PURE__ */ new Map();
function je(e, t) {
  z.set(e, t);
}
function Pe(e) {
  for (const [t, r] of Object.entries(e))
    z.set(t, r);
}
function K(e) {
  return z.get(e);
}
const X = {
  default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  destructive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  gray: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  outline: "bg-transparent text-gray-700 border border-gray-300 dark:text-gray-300 dark:border-gray-600"
};
function ue({ value: e, variant: t, colorField: r, tooltipKey: o, iconKey: n, row: i, nullText: u = "-", iconResolver: a }) {
  if (e == null)
    return /* @__PURE__ */ c("span", { className: "text-gray-400 dark:text-gray-500", children: u });
  const l = r && i[r] ? String(i[r]) : t ?? "default", d = o ? i[o] : void 0, f = X[l] ?? X.default;
  let g = null;
  if (n) {
    const y = i[n];
    y && (g = (a == null ? void 0 : a(y)) ?? K(y) ?? null);
  }
  return /* @__PURE__ */ T(
    "span",
    {
      className: `inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${f}`,
      title: d,
      children: [
        g && /* @__PURE__ */ c(g, { className: "h-3 w-3" }),
        String(e)
      ]
    }
  );
}
function de({ formattedValue: e, rawValue: t, local: r, includeTime: o }) {
  if (e == null)
    return /* @__PURE__ */ c("span", { className: "text-gray-400 dark:text-gray-500", children: "-" });
  let n = e;
  if (r && t)
    try {
      const i = new Date(t);
      n = o ? new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" }).format(i) : new Intl.DateTimeFormat(void 0, { dateStyle: "medium" }).format(i);
    } catch {
      n = e;
    }
  return /* @__PURE__ */ c("time", { dateTime: t ?? void 0, className: "text-sm text-gray-600 dark:text-gray-400", children: n });
}
function ge(e, t) {
  const r = {};
  for (const [o, n] of Object.entries(t))
    if (n.startsWith(":")) {
      const i = n.slice(1);
      r[o] = e[i];
    } else
      r[o] = n;
  return r;
}
function fe(e, t) {
  const r = window.route;
  return typeof r == "function" ? r(e, t) : (console.warn(
    `[inertia-table-react] Ziggy route() not found. Set 'use_ziggy' => false in config to resolve routes server-side, or install ziggy-js. Route: ${e}`
  ), "#");
}
function me({ value: e, route: t, params: r, resolvedHref: o, row: n, prefetch: i = !0, nullText: u = "-", linkClassName: a }) {
  if (e == null)
    return /* @__PURE__ */ c("span", { className: "text-gray-400 dark:text-gray-500", children: u });
  const l = o ?? (t && r ? fe(t, ge(n, r)) : null);
  return l ? /* @__PURE__ */ c(
    oe,
    {
      href: l,
      prefetch: i ? "hover" : void 0,
      className: a,
      children: String(e)
    }
  ) : /* @__PURE__ */ c("span", { className: "text-gray-400 dark:text-gray-500", children: String(e) });
}
function he({ value: e, nullText: t = "-" }) {
  const [r, o] = V(!1), n = $(null);
  p.useEffect(() => () => {
    n.current && clearTimeout(n.current);
  }, []);
  const i = H(() => {
    e != null && navigator.clipboard.writeText(String(e)).then(() => {
      o(!0), n.current && clearTimeout(n.current), n.current = setTimeout(() => o(!1), 2e3);
    }).catch(() => {
    });
  }, [e]);
  return e == null ? /* @__PURE__ */ c("span", { className: "text-gray-400 dark:text-gray-500", children: t }) : /* @__PURE__ */ T(
    "button",
    {
      type: "button",
      onClick: i,
      className: `inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors ${r ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"}`,
      "aria-label": r ? "Copied!" : `Copy ${String(e)} to clipboard`,
      title: r ? "Copied!" : "Click to copy",
      children: [
        String(e),
        /* @__PURE__ */ c(
          "svg",
          {
            className: "h-3.5 w-3.5",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: 1.5,
            stroke: "currentColor",
            children: r ? /* @__PURE__ */ c("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4.5 12.75l6 6 9-13.5" }) : /* @__PURE__ */ c(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                d: "M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
              }
            )
          }
        )
      ]
    }
  );
}
function pe({ iconName: e, iconResolver: t }) {
  const r = (t == null ? void 0 : t(e)) ?? K(e);
  return r ? /* @__PURE__ */ c(r, { className: "h-4 w-4 text-gray-500 dark:text-gray-400" }) : null;
}
const ee = /* @__PURE__ */ new Map();
function He(e, t) {
  ee.set(e, t);
}
function ye(e) {
  return ee.get(e);
}
function Y({ componentName: e, row: t, columnName: r }) {
  const o = ye(e);
  return o ? /* @__PURE__ */ c(o, { row: t, value: t[r], column: r }) : null;
}
function be(e) {
  const {
    tableData: t,
    cellRenderers: r,
    headerRenderers: o,
    renderCell: n,
    renderHeader: i,
    onSort: u,
    getSortState: a,
    nullText: l,
    classNames: d,
    iconResolver: f
  } = e, g = $(e.actions);
  g.current = e.actions;
  const y = $(a);
  y.current = a;
  const C = $(u);
  C.current = u;
  const b = JSON.stringify(t.columns);
  return J(() => {
    const w = [];
    for (const s of t.columns)
      s.hidden || w.push({
        id: s.name,
        fit: s.fit ?? !1,
        sortable: s.sortable,
        getAriaSort: () => {
          if (!s.sortable) return;
          const m = y.current(s.sort_key);
          return m.active ? m.direction === "asc" ? "ascending" : "descending" : "none";
        },
        renderHeader: () => {
          const m = y.current(s.sort_key), k = C.current, N = {
            column: s,
            sortState: m,
            onSort: k,
            index: w.length
          };
          if (o != null && o[s.name])
            return o[s.name](N);
          if (i)
            return i(N);
          let x = null;
          return s.sortable && (m.active ? x = p.createElement(
            "svg",
            { className: "ml-1 h-3.5 w-3.5 inline-block", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
            p.createElement("path", { d: m.direction === "asc" ? "M4 10l4-4 4 4" : "M4 6l4 4 4-4" })
          ) : x = p.createElement(
            "span",
            { className: "ml-1 inline-block text-gray-300 dark:text-gray-600" },
            "⇅"
          )), p.createElement(
            "div",
            {
              className: [
                "flex items-center gap-1 -m-4 p-4",
                s.sortable ? d.thSortable : "",
                m.active ? d.thSorted : ""
              ].filter(Boolean).join(" "),
              onClick: s.sortable ? () => k(s.sort_key) : void 0
            },
            s.header,
            x
          );
        },
        renderCell: (m, k) => {
          var E;
          if (s.displays.length === 1 && s.displays[0].type === "actions")
            return ((E = g.current) == null ? void 0 : E.call(g, m)) ?? null;
          const N = m[s.name], x = {
            row: m,
            value: N,
            column: s,
            displays: s.displays,
            rowIndex: k
          };
          if (r != null && r[s.name])
            return r[s.name](x);
          const B = () => ke(s.displays, m, s.name, l, f, d.link);
          return n ? n({ ...x, defaultRender: B }) : B();
        }
      });
    return g.current && (t.columns.some(
      (m) => m.displays.length === 1 && m.displays[0].type === "actions"
    ) || w.push({
      id: "_actions",
      fit: !0,
      sortable: !1,
      getAriaSort: () => {
      },
      renderHeader: () => null,
      renderCell: (m) => {
        var k;
        return ((k = g.current) == null ? void 0 : k.call(g, m)) ?? null;
      }
    })), w;
  }, [b, r, o, n, i, l, d, f]);
}
function ke(e, t, r, o, n, i) {
  if (!e || e.length === 0)
    return p.createElement(Q, { value: t[r], nullText: o });
  if (e.length === 1 && e[0].type === "component") {
    const a = e[0];
    return p.createElement(Y, { componentName: a.component, row: t, columnName: r });
  }
  const u = e.map((a, l) => {
    const d = ce(t, a, r);
    switch (a.type) {
      case "text":
        return p.createElement(Q, { key: l, value: d, nullText: o });
      case "badge":
        return p.createElement(ue, {
          key: l,
          value: d,
          variant: a.variant_key ? String(t[a.variant_key] ?? "") : a.variant,
          colorField: a.color_field,
          tooltipKey: a.tooltip_key,
          iconKey: a.icon_key,
          row: t,
          nullText: o,
          iconResolver: n
        });
      case "date":
        return p.createElement(de, {
          key: l,
          formattedValue: a.formatted_key ? t[a.formatted_key] : d,
          rawValue: a.raw_key ? t[a.raw_key] : null,
          local: a.local ?? !1,
          includeTime: a.includeTime ?? !1
        });
      case "link": {
        const f = a.href_key ? t[a.href_key] : void 0;
        return p.createElement(me, {
          key: l,
          value: d,
          route: a.route,
          params: a.params,
          resolvedHref: f != null ? String(f) : void 0,
          row: t,
          prefetch: a.prefetch,
          nullText: o,
          linkClassName: i
        });
      }
      case "copyable":
        return p.createElement(he, { key: l, value: d, nullText: o });
      case "icon":
        return p.createElement(pe, { key: l, iconName: String(d ?? ""), iconResolver: n });
      case "component":
        return p.createElement(Y, {
          key: l,
          componentName: a.component,
          row: t,
          columnName: r
        });
      default:
        return null;
    }
  });
  return u.length > 1 ? p.createElement("div", { className: "flex items-center gap-2" }, ...u) : u[0] ?? null;
}
const xe = re(), Se = ne(), ve = {
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
function G(e, t, r) {
  return e ? `${e}${t}` : r;
}
function Ce(e) {
  const {
    tableData: t,
    cellRenderers: r,
    headerRenderers: o,
    actions: n,
    renderCell: i,
    renderHeader: u,
    classNames: a,
    nullText: l = "-",
    iconResolver: d
  } = e, f = J(
    () => ({ ...ve, ...a }),
    // Only recompute when overrides actually change (by value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(a)]
  ), g = t.identifier ?? null, y = G(g, "Search", "search"), C = G(g, "Sort", "sort"), b = G(g, "Page", "page"), { onPageChange: w } = se(b), { searchTerm: s, onSearch: m, hasExternalSearch: k } = ae(t.searchDebounce, y, b, e.searchRef), { sortBy: N, sortDir: x, onSort: B, getSortState: E } = ie(C, b), L = be({
    tableData: t,
    cellRenderers: r,
    headerRenderers: o,
    actions: n,
    renderCell: i,
    renderHeader: u,
    onSort: B,
    getSortState: E,
    nullText: l,
    classNames: f,
    iconResolver: d
  }), I = J(
    () => L.map(
      (D) => xe.display({
        id: D.id,
        header: () => D.renderHeader(),
        cell: ({ row: U }) => D.renderCell(U.original, U.index)
      })
    ),
    [L]
  ), M = te({
    data: t.data,
    columns: I,
    getCoreRowModel: Se
  });
  le(t);
  const A = we(t, y, C, b);
  return {
    table: M,
    columns: L,
    classNames: f,
    searchTerm: s,
    onSearch: m,
    hasExternalSearch: k,
    sortBy: N,
    sortDir: x,
    onSort: B,
    getSortState: E,
    onPageChange: w,
    isProcessing: A
  };
}
function we(e, t, r, o) {
  const [n, i] = V(!1), u = $(e.data);
  return R(() => {
    u.current !== e.data && (u.current = e.data, i(!1));
  }, [e.data]), R(() => {
    const a = [t, r, o], l = W.on("start", (f) => {
      try {
        const g = new URL(f.detail.visit.url), y = new URL(window.location.href);
        a.some((b) => g.searchParams.get(b) !== y.searchParams.get(b)) && i(!0);
      } catch {
        i(!0);
      }
    }), d = W.on("finish", () => {
      i(!1);
    });
    return () => {
      l(), d();
    };
  }, [t, r, o]), n;
}
function Ne({ searchTerm: e, onSearch: t, placeholder: r = "Search...", className: o = "" }) {
  return /* @__PURE__ */ T("div", { className: "relative", children: [
    /* @__PURE__ */ c(
      "svg",
      {
        className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        children: /* @__PURE__ */ c(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          }
        )
      }
    ),
    /* @__PURE__ */ c(
      "input",
      {
        type: "text",
        value: e,
        onChange: (n) => t(n.target.value),
        placeholder: r,
        "aria-label": "Search table",
        className: `pl-9 ${o}`
      }
    )
  ] });
}
function Ee({ links: e, meta: t, onPageChange: r, isFetching: o, classNames: n }) {
  const i = e.prev !== null, u = e.next !== null;
  let a;
  return t.from !== null && t.to !== null ? t.total !== void 0 ? a = `Showing ${t.from} to ${t.to} of ${t.total} results` : a = `Showing ${t.from} to ${t.to} results` : a = "No results", /* @__PURE__ */ T("nav", { className: n.pagination, "aria-label": "Table pagination", children: [
    /* @__PURE__ */ c("span", { className: n.paginationInfo, children: a }),
    /* @__PURE__ */ T("div", { className: "flex items-center gap-2", children: [
      e.first !== null && /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          onClick: () => r(1),
          disabled: !i || o,
          className: n.paginationButton,
          "aria-label": "Go to first page",
          children: "First"
        }
      ),
      /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          onClick: () => r(t.current_page - 1),
          disabled: !i || o,
          className: n.paginationButton,
          "aria-label": "Go to previous page",
          children: "Previous"
        }
      ),
      /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          onClick: () => r(t.current_page + 1),
          disabled: !u || o,
          className: n.paginationButton,
          "aria-label": "Go to next page",
          children: "Next"
        }
      ),
      e.last !== null && t.last_page !== void 0 && /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          onClick: () => r(t.last_page),
          disabled: !u || o,
          className: n.paginationButton,
          "aria-label": "Go to last page",
          children: "Last"
        }
      )
    ] })
  ] });
}
function Te({ colSpan: e, emptyText: t = "No results found.", className: r = "" }) {
  return /* @__PURE__ */ c("tr", { children: /* @__PURE__ */ c("td", { colSpan: e, className: r, children: t }) });
}
function Re(e) {
  const {
    tableData: t,
    className: r,
    modal: o,
    onRowClick: n,
    rowClassName: i,
    isFetching: u = !1,
    emptyText: a,
    renderToolbar: l,
    renderToolbarActions: d,
    renderSearch: f,
    renderPagination: g,
    renderEmpty: y,
    renderRow: C
  } = e, {
    table: b,
    columns: w,
    classNames: s,
    searchTerm: m,
    onSearch: k,
    hasExternalSearch: N,
    onPageChange: x,
    isProcessing: B
  } = Ce(e), E = t.data.length > 0, L = t.searchable && !N, I = u || B, M = n ? (h, S) => {
    S.target.closest('a, button, input, select, textarea, [role="button"]') || n(h);
  } : void 0, A = new Set(w.filter((h) => h.fit).map((h) => h.id)), D = b.getAllColumns().length, U = [
    o ? "" : s.wrapper,
    r ?? ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ T("div", { className: U, children: [
    (L || d) && (l ? l({
      searchable: L,
      searchTerm: m,
      onSearch: k,
      children: (d == null ? void 0 : d()) ?? null
    }) : /* @__PURE__ */ T("div", { className: s.toolbar, children: [
      L && (f ? f({ searchTerm: m, onSearch: k, placeholder: "Search..." }) : /* @__PURE__ */ c(
        Ne,
        {
          searchTerm: m,
          onSearch: k,
          className: s.search
        }
      )),
      d == null ? void 0 : d()
    ] })),
    /* @__PURE__ */ c("div", { className: `overflow-x-auto transition-opacity duration-150${I ? " opacity-50 pointer-events-none" : ""}`, "aria-busy": I, children: /* @__PURE__ */ T("table", { className: s.table, children: [
      /* @__PURE__ */ c("thead", { className: s.thead, children: b.getHeaderGroups().map((h) => /* @__PURE__ */ c("tr", { children: h.headers.map((S) => {
        const _ = w.find((F) => F.id === S.column.id), O = _ == null ? void 0 : _.getAriaSort();
        return /* @__PURE__ */ c(
          "th",
          {
            className: `${s.th}${A.has(S.column.id) ? " w-0 whitespace-nowrap" : ""}`,
            "aria-sort": O,
            children: S.isPlaceholder ? null : Z(S.column.columnDef.header, S.getContext())
          },
          S.id
        );
      }) }, h.id)) }),
      /* @__PURE__ */ c("tbody", { className: s.tbody, children: E ? b.getRowModel().rows.map((h, S) => {
        const _ = [
          s.tr,
          n ? s.trClickable : "",
          (i == null ? void 0 : i(h.original, S)) ?? ""
        ].filter(Boolean).join(" "), O = M ? {
          role: "button",
          tabIndex: 0,
          onClick: (v) => M(h.original, v),
          onKeyDown: (v) => {
            (v.key === "Enter" || v.key === " ") && (v.preventDefault(), n(h.original));
          }
        } : {}, F = h.getVisibleCells().map((v) => /* @__PURE__ */ c("td", { className: `${s.td}${A.has(v.column.id) ? " w-0 whitespace-nowrap" : ""}`, children: Z(v.column.columnDef.cell, v.getContext()) }, v.id));
        return C ? /* @__PURE__ */ c(p.Fragment, { children: C({
          row: h.original,
          children: /* @__PURE__ */ c("tr", { className: _, ...O, children: F }),
          rowIndex: S
        }) }, h.id) : /* @__PURE__ */ c("tr", { className: _, ...O, children: F }, h.id);
      }) : y ? /* @__PURE__ */ c("tr", { children: /* @__PURE__ */ c("td", { colSpan: D, children: y() }) }) : /* @__PURE__ */ c(
        Te,
        {
          colSpan: D,
          emptyText: a,
          className: s.empty
        }
      ) })
    ] }) }),
    E && (g ? g({
      links: t.links,
      meta: t.meta,
      onPageChange: x,
      isFetching: I
    }) : /* @__PURE__ */ c(
      Ee,
      {
        links: t.links,
        meta: t.meta,
        onPageChange: x,
        isFetching: I,
        classNames: {
          pagination: s.pagination,
          paginationButton: s.paginationButton,
          paginationInfo: s.paginationInfo
        }
      }
    ))
  ] });
}
export {
  Re as InertiaTable,
  De as clearTableHooks,
  He as registerCellComponent,
  je as registerIcon,
  Pe as registerIcons,
  Ie as registerTableHook,
  Ce as useTable
};
