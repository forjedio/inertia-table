import { useRef as g, useEffect as p } from "react";
import { router as h } from "@inertiajs/react";
const o = /* @__PURE__ */ new Map();
function b(e, t) {
  o.has(e) || o.set(e, []), o.get(e).push(t);
}
function x(e) {
  e ? o.delete(e) : o.clear();
}
function H(e) {
  const t = g("");
  p(() => {
    const s = JSON.stringify(e.tableSettings);
    if (t.current === s) return;
    t.current = s;
    const r = [], f = () => {
      h.reload();
    };
    for (const [n, i] of Object.entries(e.tableSettings)) {
      const u = o.get(n) ?? [];
      for (const l of u) {
        const c = l({
          value: i,
          tableData: e,
          refresh: f
        });
        typeof c == "function" && r.push(c);
      }
    }
    return () => {
      r.forEach((n) => n());
    };
  }, [e]);
}
export {
  x as clearTableHooks,
  b as registerTableHook,
  H as useTableHooks
};
