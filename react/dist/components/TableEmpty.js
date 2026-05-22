import { jsx as r } from "react/jsx-runtime";
function d({ colSpan: t, emptyText: e = "No results found.", className: n = "" }) {
  return /* @__PURE__ */ r("tr", { children: /* @__PURE__ */ r("td", { colSpan: t, className: n, children: e }) });
}
export {
  d as TableEmpty
};
