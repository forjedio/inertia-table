import { jsx as x, jsxs as o } from "react/jsx-runtime";
import { getIcon as f } from "../registries/icon-registry.js";
const s = {
  default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  destructive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  gray: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  outline: "bg-transparent text-gray-700 border border-gray-300 dark:text-gray-300 dark:border-gray-600"
};
function p({ value: e, variant: b, colorField: r, tooltipKey: n, iconKey: l, row: t, nullText: y = "-", iconResolver: a }) {
  if (e == null)
    return /* @__PURE__ */ x("span", { className: "text-gray-400 dark:text-gray-500", children: y });
  const k = r && t[r] ? String(t[r]) : b ?? "default", u = n ? t[n] : void 0, i = s[k] ?? s.default;
  let g = null;
  if (l) {
    const d = t[l];
    d && (g = (a == null ? void 0 : a(d)) ?? f(d) ?? null);
  }
  return /* @__PURE__ */ o(
    "span",
    {
      className: `inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${i}`,
      title: u,
      children: [
        g && /* @__PURE__ */ x(g, { className: "h-3 w-3" }),
        String(e)
      ]
    }
  );
}
export {
  p as BadgeCell
};
