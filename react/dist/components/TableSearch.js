import { jsxs as n, jsx as e } from "react/jsx-runtime";
function i({ searchTerm: a, onSearch: t, placeholder: r = "Search...", className: l = "" }) {
  return /* @__PURE__ */ n("div", { className: "relative", children: [
    /* @__PURE__ */ e(
      "svg",
      {
        className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        children: /* @__PURE__ */ e(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          }
        )
      }
    ),
    /* @__PURE__ */ e(
      "input",
      {
        type: "text",
        value: a,
        onChange: (o) => t(o.target.value),
        placeholder: r,
        "aria-label": "Search table",
        className: `pl-9 ${l}`
      }
    )
  ] });
}
export {
  i as TableSearch
};
