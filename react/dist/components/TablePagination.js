import { jsxs as p, jsx as l } from "react/jsx-runtime";
function b({ links: n, meta: t, onPageChange: a, isFetching: i, classNames: o }) {
  const r = n.prev !== null, u = n.next !== null;
  let e;
  return t.from !== null && t.to !== null ? t.total !== void 0 ? e = `Showing ${t.from} to ${t.to} of ${t.total} results` : e = `Showing ${t.from} to ${t.to} results` : e = "No results", /* @__PURE__ */ p("nav", { className: o.pagination, "aria-label": "Table pagination", children: [
    /* @__PURE__ */ l("span", { className: o.paginationInfo, children: e }),
    /* @__PURE__ */ p("div", { className: "flex items-center gap-2", children: [
      n.first !== null && /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          onClick: () => a(1),
          disabled: !r || i,
          className: o.paginationButton,
          "aria-label": "Go to first page",
          children: "First"
        }
      ),
      /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          onClick: () => a(t.current_page - 1),
          disabled: !r || i,
          className: o.paginationButton,
          "aria-label": "Go to previous page",
          children: "Previous"
        }
      ),
      /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          onClick: () => a(t.current_page + 1),
          disabled: !u || i,
          className: o.paginationButton,
          "aria-label": "Go to next page",
          children: "Next"
        }
      ),
      n.last !== null && t.last_page !== void 0 && /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          onClick: () => a(t.last_page),
          disabled: !u || i,
          className: o.paginationButton,
          "aria-label": "Go to last page",
          children: "Last"
        }
      )
    ] })
  ] });
}
export {
  b as TablePagination
};
