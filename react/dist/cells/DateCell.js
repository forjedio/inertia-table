import { jsx as a } from "react/jsx-runtime";
function l({ formattedValue: t, rawValue: e, local: m, includeTime: n }) {
  if (t == null || t === "")
    return /* @__PURE__ */ a("span", { className: "text-gray-400 dark:text-gray-500", children: "-" });
  let i = t;
  if (m && e)
    try {
      const r = new Date(e);
      i = n ? new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" }).format(r) : new Intl.DateTimeFormat(void 0, { dateStyle: "medium" }).format(r);
    } catch {
      i = t;
    }
  return /* @__PURE__ */ a("time", { dateTime: e ?? void 0, className: "text-sm text-gray-600 dark:text-gray-400", children: i });
}
export {
  l as DateCell
};
