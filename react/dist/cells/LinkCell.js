import { jsx as t } from "react/jsx-runtime";
import { Link as f } from "@inertiajs/react";
import { buildHref as d, resolveRouteParams as m } from "../utils/resolve-route-params.js";
function u({ value: r, route: e, params: n, resolvedHref: o, row: l, prefetch: s = !0, nullText: a = "-", linkClassName: c }) {
  if (r == null)
    return /* @__PURE__ */ t("span", { className: "text-gray-400 dark:text-gray-500", children: a });
  const i = o ?? (e && n ? d(e, m(l, n)) : null);
  return i ? /* @__PURE__ */ t(
    f,
    {
      href: i,
      prefetch: s ? "hover" : void 0,
      className: c,
      children: String(r)
    }
  ) : /* @__PURE__ */ t("span", { className: "text-gray-400 dark:text-gray-500", children: String(r) });
}
export {
  u as LinkCell
};
