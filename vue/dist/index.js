import { ref as O, onUnmounted as j, watch as z, defineComponent as C, openBlock as g, createElementBlock as m, toDisplayString as w, computed as y, normalizeClass as h, createBlock as A, resolveDynamicComponent as G, createCommentVNode as $, createTextVNode as J, unref as d, withCtx as ne, h as p, createElementVNode as x, useSlots as ae, renderSlot as F, createVNode as D, Fragment as U, renderList as M, mergeProps as re } from "vue";
import { router as L, Link as oe } from "@inertiajs/vue3";
function I(e, t = "page") {
  const n = new URL(window.location.href);
  for (const [a, i] of Object.entries(e))
    i === null ? n.searchParams.delete(a) : n.searchParams.set(a, i);
  t in e || n.searchParams.delete(t), L.get(n.toString(), {}, { preserveState: !0, preserveScroll: !0 });
}
function le(e, t, n, o) {
  const a = O(
    typeof window < "u" ? new URLSearchParams(window.location.search).get(t) ?? "" : ""
  );
  let i = null;
  function s(r) {
    a.value = r, i && clearTimeout(i), i = setTimeout(() => {
      I(
        { [t]: r || null },
        n
      );
    }, e);
  }
  return j(() => {
    i && clearTimeout(i);
  }), o && z(o, (r, c, l) => {
    if (!r || typeof window > "u") return;
    const f = new URLSearchParams(window.location.search).get(t) ?? "";
    r.value !== f && (r.value = f);
    const k = () => {
      s(r.value);
    };
    r.addEventListener("input", k), l(() => {
      r.removeEventListener("input", k);
    });
  }, { immediate: !0 }), { searchTerm: a, onSearch: s, hasExternalSearch: !!o };
}
function q(e) {
  return e ? e.startsWith("-") ? { sortBy: e.slice(1), sortDir: "desc" } : { sortBy: e, sortDir: "asc" } : { sortBy: null, sortDir: "asc" };
}
function se(e, t) {
  const n = typeof window < "u" ? window.location.search : "", o = new URLSearchParams(n), { sortBy: a, sortDir: i } = q(o.get(e));
  function s(c) {
    const l = new URLSearchParams(window.location.search), { sortBy: u, sortDir: f } = q(l.get(e));
    I(u === c ? f === "asc" ? { [e]: `-${c}` } : { [e]: null } : { [e]: c }, t);
  }
  function r(c) {
    return {
      active: a === c,
      direction: a === c ? i : null
    };
  }
  return { sortBy: a, sortDir: i, onSort: s, getSortState: r };
}
function ie(e) {
  function t(n) {
    I({ [e]: String(n) }, e);
  }
  return { onPageChange: t };
}
const V = /* @__PURE__ */ new Map();
function Qe(e, t) {
  V.has(e) || V.set(e, []), V.get(e).push(t);
}
function Xe(e) {
  e ? V.delete(e) : V.clear();
}
function ce(e) {
  let t = "";
  const n = [];
  function o() {
    const a = JSON.stringify(e.tableSettings);
    if (t === a) return;
    t = a, n.forEach((s) => s()), n.length = 0;
    const i = () => {
      L.reload();
    };
    for (const [s, r] of Object.entries(e.tableSettings)) {
      const c = V.get(s) ?? [];
      for (const l of c) {
        const f = l({ value: r, tableData: e, refresh: i });
        typeof f == "function" && n.push(f);
      }
    }
  }
  z(
    () => e.tableSettings,
    () => o(),
    { immediate: !0, deep: !0 }
  ), j(() => {
    n.forEach((a) => a()), n.length = 0;
  });
}
function ue(e, t, n) {
  return "key" in t && t.key ? e[t.key] : e[n];
}
const de = {
  key: 0,
  class: "text-gray-400 dark:text-gray-500"
}, ge = { key: 1 }, Z = /* @__PURE__ */ C({
  __name: "TextCell",
  props: {
    value: {},
    nullText: {}
  },
  setup(e) {
    return (t, n) => e.value == null ? (g(), m("span", de, w(e.nullText ?? "-"), 1)) : (g(), m("span", ge, w(String(e.value)), 1));
  }
}), W = /* @__PURE__ */ new Map();
function Ye(e, t) {
  W.set(e, t);
}
function et(e) {
  for (const [t, n] of Object.entries(e))
    W.set(t, n);
}
function ee(e) {
  return W.get(e);
}
const me = {
  key: 0,
  class: "text-gray-400 dark:text-gray-500"
}, fe = ["title"], he = /* @__PURE__ */ C({
  __name: "BadgeCell",
  props: {
    value: {},
    variant: {},
    colorField: {},
    tooltipKey: {},
    iconKey: {},
    row: {},
    nullText: {},
    iconResolver: { type: Function }
  },
  setup(e) {
    const t = {
      default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      destructive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      gray: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
      outline: "bg-transparent text-gray-700 border border-gray-300 dark:text-gray-300 dark:border-gray-600"
    }, n = e, o = y(() => n.colorField && n.row[n.colorField] ? String(n.row[n.colorField]) : n.variant ?? "default"), a = y(() => t[o.value] ?? t.default), i = y(() => n.tooltipKey ? n.row[n.tooltipKey] : void 0), s = y(() => {
      var c;
      if (!n.iconKey) return null;
      const r = n.row[n.iconKey];
      return r ? ((c = n.iconResolver) == null ? void 0 : c.call(n, r)) ?? ee(r) ?? null : null;
    });
    return (r, c) => e.value == null ? (g(), m("span", me, w(e.nullText ?? "-"), 1)) : (g(), m("span", {
      key: 1,
      class: h(`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${a.value}`),
      title: i.value
    }, [
      s.value ? (g(), A(G(s.value), {
        key: 0,
        class: "h-3 w-3"
      })) : $("", !0),
      J(" " + w(String(e.value)), 1)
    ], 10, fe));
  }
}), ye = {
  key: 0,
  class: "text-gray-400 dark:text-gray-500"
}, ve = ["datetime"], ke = /* @__PURE__ */ C({
  __name: "DateCell",
  props: {
    formattedValue: {},
    rawValue: {},
    local: { type: Boolean },
    includeTime: { type: Boolean }
  },
  setup(e) {
    const t = e, n = y(() => {
      if (t.formattedValue == null) return null;
      if (t.local && t.rawValue)
        try {
          const o = new Date(t.rawValue), a = t.includeTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" };
          return new Intl.DateTimeFormat(void 0, a).format(o);
        } catch {
          return t.formattedValue;
        }
      return t.formattedValue;
    });
    return (o, a) => e.formattedValue == null ? (g(), m("span", ye, "-")) : (g(), m("time", {
      key: 1,
      datetime: e.rawValue ?? void 0,
      class: "text-sm text-gray-600 dark:text-gray-400"
    }, w(n.value), 9, ve));
  }
});
function be(e, t) {
  const n = {};
  for (const [o, a] of Object.entries(t))
    if (a.startsWith(":")) {
      const i = a.slice(1);
      n[o] = e[i];
    } else
      n[o] = a;
  return n;
}
function xe(e, t) {
  const n = window.route;
  return typeof n == "function" ? n(e, t) : (console.warn(
    `[inertia-table-vue] Ziggy route() not found. Set 'use_ziggy' => false in config to resolve routes server-side, or install ziggy-js. Route: ${e}`
  ), "#");
}
const pe = {
  key: 0,
  class: "text-gray-400 dark:text-gray-500"
}, Se = {
  key: 1,
  class: "text-gray-400 dark:text-gray-500"
}, we = /* @__PURE__ */ C({
  __name: "LinkCell",
  props: {
    value: {},
    route: {},
    params: {},
    resolvedHref: {},
    row: {},
    prefetch: { type: Boolean },
    nullText: {},
    linkClassName: {}
  },
  setup(e) {
    const t = e, n = y(() => {
      if (t.resolvedHref) return t.resolvedHref;
      if (t.route && t.params) {
        const o = be(t.row, t.params);
        return xe(t.route, o);
      }
      return null;
    });
    return (o, a) => e.value == null ? (g(), m("span", pe, w(e.nullText ?? "-"), 1)) : n.value ? (g(), A(d(oe), {
      key: 2,
      href: n.value,
      prefetch: e.prefetch !== !1 ? "hover" : void 0,
      class: h(e.linkClassName)
    }, {
      default: ne(() => [
        J(w(String(e.value)), 1)
      ]),
      _: 1
    }, 8, ["href", "prefetch", "class"])) : (g(), m("span", Se, w(String(e.value)), 1));
  }
}), Ce = {
  key: 0,
  class: "text-gray-400 dark:text-gray-500"
}, $e = ["aria-label", "title"], Ne = {
  class: "h-3.5 w-3.5",
  fill: "none",
  viewBox: "0 0 24 24",
  "stroke-width": "1.5",
  stroke: "currentColor"
}, Te = {
  key: 0,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M4.5 12.75l6 6 9-13.5"
}, Pe = {
  key: 1,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
}, Be = /* @__PURE__ */ C({
  __name: "CopyableCell",
  props: {
    value: {},
    nullText: {}
  },
  setup(e) {
    const t = e, n = O(!1);
    let o = null;
    function a() {
      t.value != null && navigator.clipboard.writeText(String(t.value)).then(() => {
        n.value = !0, o && clearTimeout(o), o = setTimeout(() => n.value = !1, 2e3);
      }).catch(() => {
      });
    }
    return j(() => {
      o && clearTimeout(o);
    }), (i, s) => e.value == null ? (g(), m("span", Ce, w(e.nullText ?? "-"), 1)) : (g(), m("button", {
      key: 1,
      type: "button",
      onClick: a,
      class: h([
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
        n.value ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
      ]),
      "aria-label": n.value ? "Copied!" : `Copy ${String(e.value)} to clipboard`,
      title: n.value ? "Copied!" : "Click to copy"
    }, [
      J(w(String(e.value)) + " ", 1),
      (g(), m("svg", Ne, [
        n.value ? (g(), m("path", Te)) : (g(), m("path", Pe))
      ]))
    ], 10, $e));
  }
}), Re = /* @__PURE__ */ C({
  __name: "IconCell",
  props: {
    iconName: {},
    iconResolver: { type: Function }
  },
  setup(e) {
    const t = e, n = y(() => {
      var o;
      return ((o = t.iconResolver) == null ? void 0 : o.call(t, t.iconName)) ?? ee(t.iconName);
    });
    return (o, a) => n.value ? (g(), A(G(n.value), {
      key: 0,
      class: "h-4 w-4 text-gray-500 dark:text-gray-400"
    })) : $("", !0);
  }
}), te = /* @__PURE__ */ new Map();
function tt(e, t) {
  te.set(e, t);
}
function Fe(e) {
  return te.get(e);
}
const Q = /* @__PURE__ */ C({
  __name: "ComponentCell",
  props: {
    componentName: {},
    row: {},
    columnName: {}
  },
  setup(e) {
    const t = e, n = y(() => Fe(t.componentName));
    return (o, a) => n.value ? (g(), A(G(n.value), {
      key: 0,
      row: e.row,
      value: e.row[e.columnName],
      column: e.columnName
    }, null, 8, ["row", "value", "column"])) : $("", !0);
  }
});
function Ve(e) {
  const { tableData: t, slots: n, onSort: o, getSortState: a, nullText: i, classNames: s, iconResolver: r } = e;
  return y(() => {
    const c = [];
    for (const l of t.columns)
      l.hidden || c.push({
        id: l.name,
        fit: l.fit ?? !1,
        sortable: l.sortable,
        getAriaSort: () => {
          if (!l.sortable) return;
          const u = a(l.sort_key);
          return u.active ? u.direction === "asc" ? "ascending" : "descending" : "none";
        },
        renderHeader: () => {
          const u = a(l.sort_key), f = {
            column: l,
            sortState: u,
            onSort: o,
            index: c.length
          }, k = n[`header-${l.name}`];
          if (k) return k(f);
          if (n.header) return n.header(f);
          let b = null;
          return l.sortable && (u.active ? b = p(
            "svg",
            { class: "ml-1 h-3.5 w-3.5 inline-block", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" },
            [p("path", { d: u.direction === "asc" ? "M4 10l4-4 4 4" : "M4 6l4 4 4-4" })]
          ) : b = p(
            "span",
            { class: "ml-1 inline-block text-gray-300 dark:text-gray-600" },
            "⇅"
          )), p(
            "div",
            {
              class: [
                "flex items-center gap-1 -m-4 p-4",
                l.sortable ? s.value.thSortable : "",
                u.active ? s.value.thSorted : ""
              ].filter(Boolean).join(" "),
              onClick: l.sortable ? () => o(l.sort_key) : void 0
            },
            [l.header, b]
          );
        },
        renderCell: (u, f) => {
          var T;
          if (l.displays.length === 1 && l.displays[0].type === "actions")
            return ((T = n.actions) == null ? void 0 : T.call(n, { row: u })) ?? null;
          const k = u[l.name], b = {
            row: u,
            value: k,
            column: l,
            displays: l.displays,
            rowIndex: f
          }, N = n[`cell-${l.name}`];
          if (N) return N(b);
          if (n.cell) {
            const B = () => X(l.displays, u, l.name, i, r, s.value.link);
            return n.cell({ ...b, defaultRender: B });
          }
          return X(l.displays, u, l.name, i, r, s.value.link);
        }
      });
    return n.actions && (t.columns.some(
      (u) => u.displays.length === 1 && u.displays[0].type === "actions"
    ) || c.push({
      id: "_actions",
      fit: !0,
      sortable: !1,
      getAriaSort: () => {
      },
      renderHeader: () => null,
      renderCell: (u) => n.actions({ row: u })
    })), c;
  });
}
function X(e, t, n, o, a, i) {
  if (!e || e.length === 0)
    return p(Z, { value: t[n], nullText: o });
  if (e.length === 1 && e[0].type === "component") {
    const r = e[0];
    return p(Q, { componentName: r.component, row: t, columnName: n });
  }
  const s = e.map((r, c) => {
    const l = ue(t, r, n);
    switch (r.type) {
      case "text":
        return p(Z, { key: c, value: l, nullText: o });
      case "badge":
        return p(he, {
          key: c,
          value: l,
          variant: r.variant_key ? String(t[r.variant_key] ?? "") : r.variant,
          colorField: r.color_field,
          tooltipKey: r.tooltip_key,
          iconKey: r.icon_key,
          row: t,
          nullText: o,
          iconResolver: a
        });
      case "date":
        return p(ke, {
          key: c,
          formattedValue: r.formatted_key ? String(t[r.formatted_key] ?? "") : String(l ?? ""),
          rawValue: r.raw_key ? String(t[r.raw_key] ?? "") : null,
          local: r.local ?? !1,
          includeTime: r.includeTime ?? !1
        });
      case "link": {
        const u = r.href_key ? t[r.href_key] : void 0;
        return p(we, {
          key: c,
          value: l,
          route: r.route,
          params: r.params,
          resolvedHref: u != null ? String(u) : void 0,
          row: t,
          prefetch: r.prefetch,
          nullText: o,
          linkClassName: i
        });
      }
      case "copyable":
        return p(Be, { key: c, value: l, nullText: o });
      case "icon":
        return p(Re, { key: c, iconName: String(l ?? ""), iconResolver: a });
      case "component":
        return p(Q, {
          key: c,
          componentName: r.component,
          row: t,
          columnName: n
        });
      default:
        return null;
    }
  });
  return s.length > 1 ? p("div", { class: "flex items-center gap-2" }, s) : s[0] ?? null;
}
const De = {
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
function K(e, t, n) {
  return e ? `${e}${t}` : n;
}
function Ie(e, t) {
  const { tableData: n } = e, o = e.nullText ?? "-", a = y(() => ({
    ...De,
    ...e.classNames
  })), i = n.identifier ?? null, s = K(i, "Search", "search"), r = K(i, "Sort", "sort"), c = K(i, "Page", "page"), { onPageChange: l } = ie(c), { searchTerm: u, onSearch: f, hasExternalSearch: k } = le(n.searchDebounce, s, c, e.searchRef), { sortBy: b, sortDir: N, onSort: T, getSortState: B } = se(r, c), E = Ve({
    tableData: n,
    slots: t,
    onSort: T,
    getSortState: B,
    nullText: o,
    classNames: a,
    iconResolver: e.iconResolver
  });
  ce(n);
  const v = Le(n, s, r, c);
  return {
    columns: E,
    classNames: a,
    searchTerm: u,
    onSearch: f,
    hasExternalSearch: k,
    sortBy: b,
    sortDir: N,
    onSort: T,
    getSortState: B,
    onPageChange: l,
    isProcessing: v
  };
}
function Le(e, t, n, o) {
  const a = O(!1);
  let i = e.data;
  z(() => e.data, (l) => {
    i !== l && (i = l, a.value = !1);
  });
  const s = [t, n, o], r = L.on("start", (l) => {
    try {
      const u = new URL(l.detail.visit.url), f = new URL(window.location.href);
      s.some((b) => u.searchParams.get(b) !== f.searchParams.get(b)) && (a.value = !0);
    } catch {
      a.value = !0;
    }
  }), c = L.on("finish", () => {
    a.value = !1;
  });
  return j(() => {
    r(), c();
  }), a;
}
const je = { class: "relative" }, Ae = ["value", "placeholder"], Ee = /* @__PURE__ */ C({
  __name: "TableSearch",
  props: {
    searchTerm: {},
    onSearch: { type: Function },
    placeholder: {},
    className: {}
  },
  setup(e) {
    return (t, n) => (g(), m("div", je, [
      n[1] || (n[1] = x("svg", {
        class: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor"
      }, [
        x("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        })
      ], -1)),
      x("input", {
        type: "text",
        value: e.searchTerm,
        onInput: n[0] || (n[0] = (o) => e.onSearch(o.target.value)),
        placeholder: e.placeholder ?? "Search...",
        class: h(`pl-9 ${e.className ?? ""}`),
        "aria-label": "Search table"
      }, null, 42, Ae)
    ]));
  }
}), He = { class: "flex items-center gap-2" }, Ue = ["disabled"], Me = ["disabled"], Ke = ["disabled"], Oe = ["disabled"], ze = /* @__PURE__ */ C({
  __name: "TablePagination",
  props: {
    links: {},
    meta: {},
    onPageChange: { type: Function },
    isFetching: { type: Boolean },
    classNames: {}
  },
  setup(e) {
    const t = e, n = y(() => t.links.prev !== null), o = y(() => t.links.next !== null), a = y(() => {
      const { from: i, to: s } = t.meta;
      return i !== null && s !== null ? t.meta.total !== void 0 ? `Showing ${i} to ${s} of ${t.meta.total} results` : `Showing ${i} to ${s} results` : "No results";
    });
    return (i, s) => (g(), m("nav", {
      class: h(e.classNames.pagination),
      "aria-label": "Table pagination"
    }, [
      x("span", {
        class: h(e.classNames.paginationInfo)
      }, w(a.value), 3),
      x("div", He, [
        e.links.first !== null ? (g(), m("button", {
          key: 0,
          type: "button",
          onClick: s[0] || (s[0] = (r) => e.onPageChange(1)),
          disabled: !n.value || e.isFetching,
          class: h(e.classNames.paginationButton),
          "aria-label": "Go to first page"
        }, " First ", 10, Ue)) : $("", !0),
        x("button", {
          type: "button",
          onClick: s[1] || (s[1] = (r) => e.onPageChange(e.meta.current_page - 1)),
          disabled: !n.value || e.isFetching,
          class: h(e.classNames.paginationButton),
          "aria-label": "Go to previous page"
        }, " Previous ", 10, Me),
        x("button", {
          type: "button",
          onClick: s[2] || (s[2] = (r) => e.onPageChange(e.meta.current_page + 1)),
          disabled: !o.value || e.isFetching,
          class: h(e.classNames.paginationButton),
          "aria-label": "Go to next page"
        }, " Next ", 10, Ke),
        e.links.last !== null && e.meta.last_page !== void 0 ? (g(), m("button", {
          key: 1,
          type: "button",
          onClick: s[3] || (s[3] = (r) => e.onPageChange(e.meta.last_page)),
          disabled: !o.value || e.isFetching,
          class: h(e.classNames.paginationButton),
          "aria-label": "Go to last page"
        }, " Last ", 10, Oe)) : $("", !0)
      ])
    ], 2));
  }
}), Ge = ["colspan"], Je = /* @__PURE__ */ C({
  __name: "TableEmpty",
  props: {
    colSpan: {},
    emptyText: {},
    className: {}
  },
  setup(e) {
    return (t, n) => (g(), m("tr", null, [
      x("td", {
        colspan: e.colSpan,
        class: h(e.className)
      }, w(e.emptyText ?? "No results found."), 11, Ge)
    ]));
  }
}), Y = C({
  name: "RenderVNode",
  props: {
    render: {
      type: Function,
      required: !0
    }
  },
  setup(e) {
    return () => e.render();
  }
}), We = ["aria-busy"], _e = ["aria-sort"], nt = /* @__PURE__ */ C({
  __name: "InertiaTable",
  props: {
    tableData: {},
    className: {},
    classNames: {},
    modal: { type: Boolean },
    emptyText: {},
    nullText: {},
    onRowClick: {},
    rowClassName: {},
    isFetching: { type: Boolean, default: !1 },
    searchRef: {},
    iconResolver: {}
  },
  setup(e) {
    const t = e, n = ae(), {
      columns: o,
      classNames: a,
      searchTerm: i,
      onSearch: s,
      hasExternalSearch: r,
      onPageChange: c,
      isProcessing: l
    } = Ie(t, n), u = y(() => t.tableData.data.length > 0), f = o, k = y(() => t.isFetching || l.value), b = y(() => t.tableData.searchable && !r), N = y(() => new Set(f.value.filter((v) => v.fit).map((v) => v.id))), T = y(
      () => [
        t.modal ? "" : a.value.wrapper,
        t.className ?? ""
      ].filter(Boolean).join(" ")
    );
    function B(v, R) {
      !t.onRowClick || R.target.closest('a, button, input, select, textarea, [role="button"]') || t.onRowClick(v);
    }
    function E(v, R) {
      t.onRowClick && (R.key === "Enter" || R.key === " ") && (R.preventDefault(), t.onRowClick(v));
    }
    return (v, R) => (g(), m("div", {
      class: h(T.value)
    }, [
      b.value || d(n)["toolbar-actions"] ? F(v.$slots, "toolbar", {
        key: 0,
        searchable: b.value,
        searchTerm: d(i),
        onSearch: d(s)
      }, () => [
        x("div", {
          class: h(d(a).toolbar)
        }, [
          b.value ? F(v.$slots, "search", {
            key: 0,
            searchTerm: d(i),
            onSearch: d(s),
            placeholder: "Search..."
          }, () => [
            D(Ee, {
              searchTerm: d(i),
              onSearch: d(s),
              className: d(a).search
            }, null, 8, ["searchTerm", "onSearch", "className"])
          ]) : $("", !0),
          F(v.$slots, "toolbar-actions")
        ], 2)
      ]) : $("", !0),
      x("div", {
        class: h(["overflow-x-auto transition-opacity duration-150", k.value ? "opacity-50 pointer-events-none" : ""]),
        "aria-busy": k.value
      }, [
        x("table", {
          class: h(d(a).table)
        }, [
          x("thead", {
            class: h(d(a).thead)
          }, [
            x("tr", null, [
              (g(!0), m(U, null, M(d(f), (S) => (g(), m("th", {
                key: S.id,
                class: h([d(a).th, N.value.has(S.id) ? "w-0 whitespace-nowrap" : ""]),
                "aria-sort": S.getAriaSort()
              }, [
                D(d(Y), {
                  render: S.renderHeader
                }, null, 8, ["render"])
              ], 10, _e))), 128))
            ])
          ], 2),
          x("tbody", {
            class: h(d(a).tbody)
          }, [
            u.value ? (g(!0), m(U, { key: 0 }, M(e.tableData.data, (S, H) => F(v.$slots, "row", {
              key: S.id,
              row: S,
              rowIndex: H
            }, () => {
              var _;
              return [
                x("tr", re({
                  class: [
                    d(a).tr,
                    e.onRowClick ? d(a).trClickable : "",
                    ((_ = e.rowClassName) == null ? void 0 : _.call(e, S, H)) ?? ""
                  ].filter(Boolean).join(" ")
                }, { ref_for: !0 }, e.onRowClick ? {
                  role: "button",
                  tabindex: 0,
                  onClick: (P) => B(S, P),
                  onKeydown: (P) => E(S, P)
                } : {}), [
                  (g(!0), m(U, null, M(d(f), (P) => (g(), m("td", {
                    key: P.id,
                    class: h([d(a).td, N.value.has(P.id) ? "w-0 whitespace-nowrap" : ""])
                  }, [
                    D(d(Y), {
                      render: () => P.renderCell(S, H)
                    }, null, 8, ["render"])
                  ], 2))), 128))
                ], 16)
              ];
            })), 128)) : F(v.$slots, "empty", { key: 1 }, () => [
              D(Je, {
                colSpan: d(f).length,
                emptyText: e.emptyText,
                className: d(a).empty
              }, null, 8, ["colSpan", "emptyText", "className"])
            ])
          ], 2)
        ], 2)
      ], 10, We),
      u.value ? F(v.$slots, "pagination", {
        key: 1,
        links: e.tableData.links,
        meta: e.tableData.meta,
        onPageChange: d(c),
        isFetching: k.value
      }, () => [
        D(ze, {
          links: e.tableData.links,
          meta: e.tableData.meta,
          onPageChange: d(c),
          isFetching: k.value,
          classNames: {
            pagination: d(a).pagination,
            paginationButton: d(a).paginationButton,
            paginationInfo: d(a).paginationInfo
          }
        }, null, 8, ["links", "meta", "onPageChange", "isFetching", "classNames"])
      ]) : $("", !0)
    ], 2));
  }
});
export {
  nt as InertiaTable,
  Xe as clearTableHooks,
  tt as registerCellComponent,
  Ye as registerIcon,
  et as registerIcons,
  Qe as registerTableHook,
  Ie as useTable
};
