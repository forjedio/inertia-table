import o, { useRef as y, useMemo as A } from "react";
import { resolveValue as B } from "../utils/resolve-value.js";
import { TextCell as E } from "../cells/TextCell.js";
import { BadgeCell as H } from "../cells/BadgeCell.js";
import { DateCell as V } from "../cells/DateCell.js";
import { LinkCell as D } from "../cells/LinkCell.js";
import { CopyableCell as K } from "../cells/CopyableCell.js";
import { IconCell as L } from "../cells/IconCell.js";
import { ComponentCell as x } from "../cells/ComponentCell.js";
function z(s) {
  const {
    tableData: n,
    cellRenderers: i,
    headerRenderers: l,
    renderCell: d,
    renderHeader: h,
    onSort: k,
    getSortState: e,
    nullText: u,
    classNames: a,
    iconResolver: m
  } = s, c = y(s.actions);
  c.current = s.actions;
  const S = y(e);
  S.current = e;
  const C = y(k);
  C.current = k;
  const N = JSON.stringify(n.columns);
  return A(() => {
    const p = [];
    for (const t of n.columns)
      t.hidden || p.push({
        id: t.name,
        fit: t.fit ?? !1,
        sortable: t.sortable,
        getAriaSort: () => {
          if (!t.sortable) return;
          const r = S.current(t.sort_key);
          return r.active ? r.direction === "asc" ? "ascending" : "descending" : "none";
        },
        renderHeader: () => {
          const r = S.current(t.sort_key), f = C.current, v = {
            column: t,
            sortState: r,
            onSort: f,
            index: p.length
          };
          if (l != null && l[t.name])
            return l[t.name](v);
          if (h)
            return h(v);
          let g = null;
          return t.sortable && (r.active ? g = o.createElement(
            "svg",
            { className: "ml-1 h-3.5 w-3.5 inline-block", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
            o.createElement("path", { d: r.direction === "asc" ? "M4 10l4-4 4 4" : "M4 6l4 4 4-4" })
          ) : g = o.createElement(
            "span",
            { className: "ml-1 inline-block text-gray-300 dark:text-gray-600" },
            "⇅"
          )), o.createElement(
            "div",
            {
              className: [
                "flex items-center gap-1 -m-4 p-4",
                t.sortable ? a.thSortable : "",
                r.active ? a.thSorted : ""
              ].filter(Boolean).join(" "),
              onClick: t.sortable ? () => f(t.sort_key) : void 0
            },
            t.header,
            g
          );
        },
        renderCell: (r, f) => {
          var b;
          if (t.displays.length === 1 && t.displays[0].type === "actions")
            return ((b = c.current) == null ? void 0 : b.call(c, r)) ?? null;
          const v = r[t.name], g = {
            row: r,
            value: v,
            column: t,
            displays: t.displays,
            rowIndex: f
          };
          if (i != null && i[t.name])
            return i[t.name](g);
          const _ = () => M(t.displays, r, t.name, u, m, a.link);
          return d ? d({ ...g, defaultRender: _ }) : _();
        }
      });
    return c.current && (n.columns.some(
      (r) => r.displays.length === 1 && r.displays[0].type === "actions"
    ) || p.push({
      id: "_actions",
      fit: !0,
      sortable: !1,
      getAriaSort: () => {
      },
      renderHeader: () => null,
      renderCell: (r) => {
        var f;
        return ((f = c.current) == null ? void 0 : f.call(c, r)) ?? null;
      }
    })), p;
  }, [N, i, l, d, h, u, a, m]);
}
function M(s, n, i, l, d, h) {
  if (!s || s.length === 0)
    return o.createElement(E, { value: n[i], nullText: l });
  if (s.length === 1 && s[0].type === "component") {
    const e = s[0];
    return o.createElement(x, { componentName: e.component, row: n, columnName: i });
  }
  const k = s.map((e, u) => {
    const a = B(n, e, i);
    switch (e.type) {
      case "text":
        return o.createElement(E, { key: u, value: a, nullText: l });
      case "badge":
        return o.createElement(H, {
          key: u,
          value: a,
          variant: e.variant_key ? String(n[e.variant_key] ?? "") : e.variant,
          colorField: e.color_field,
          tooltipKey: e.tooltip_key,
          iconKey: e.icon_key,
          row: n,
          nullText: l,
          iconResolver: d
        });
      case "date": {
        const m = e.formatted_key ? n[e.formatted_key] : a, c = e.raw_key ? n[e.raw_key] : null;
        return o.createElement(V, {
          key: u,
          formattedValue: m == null ? null : String(m),
          rawValue: c == null ? null : String(c),
          local: e.local ?? !1,
          includeTime: e.includeTime ?? !1
        });
      }
      case "link": {
        const m = e.href_key ? n[e.href_key] : void 0;
        return o.createElement(D, {
          key: u,
          value: a,
          route: e.route,
          params: e.params,
          resolvedHref: m != null ? String(m) : void 0,
          row: n,
          prefetch: e.prefetch,
          nullText: l,
          linkClassName: h
        });
      }
      case "copyable":
        return o.createElement(K, { key: u, value: a, nullText: l });
      case "icon":
        return o.createElement(L, { key: u, iconName: String(a ?? ""), iconResolver: d });
      case "component":
        return o.createElement(x, {
          key: u,
          componentName: e.component,
          row: n,
          columnName: i
        });
      default:
        return null;
    }
  });
  return k.length > 1 ? o.createElement("div", { className: "flex items-center gap-2" }, ...k) : k[0] ?? null;
}
export {
  z as useColumnBuilder
};
