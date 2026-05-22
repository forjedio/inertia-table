import { jsx as m } from "react/jsx-runtime";
import { getIcon as a } from "../registries/icon-registry.js";
function u({ iconName: r, iconResolver: t }) {
  const n = (t == null ? void 0 : t(r)) ?? a(r);
  return n ? /* @__PURE__ */ m(n, { className: "h-4 w-4 text-gray-500 dark:text-gray-400" }) : null;
}
export {
  u as IconCell
};
