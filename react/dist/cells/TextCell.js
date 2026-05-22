import { jsx as t } from "react/jsx-runtime";
function i({ value: r, nullText: n = "-" }) {
  return r == null ? /* @__PURE__ */ t("span", { className: "text-gray-400 dark:text-gray-500", children: n }) : /* @__PURE__ */ t("span", { children: String(r) });
}
export {
  i as TextCell
};
