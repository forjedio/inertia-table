import { jsx as r } from "react/jsx-runtime";
import { getCellComponent as l } from "../registries/component-registry.js";
function u({ componentName: e, row: n, columnName: o }) {
  const t = l(e);
  return t ? /* @__PURE__ */ r(t, { row: n, value: n[o], column: o }) : null;
}
export {
  u as ComponentCell
};
