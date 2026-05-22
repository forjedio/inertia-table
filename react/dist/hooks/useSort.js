import { useCallback as c } from "react";
import { navigateWithParams as i } from "../utils/navigate.js";
function e(t) {
  return t ? t.startsWith("-") ? { sortBy: t.slice(1), sortDir: "desc" } : { sortBy: t, sortDir: "asc" } : { sortBy: null, sortDir: "asc" };
}
function D(t, n) {
  const u = typeof window < "u" ? window.location.search : "", l = new URLSearchParams(u), { sortBy: o, sortDir: s } = e(l.get(t)), f = c(
    (r) => {
      const w = new URLSearchParams(window.location.search), { sortBy: a, sortDir: d } = e(w.get(t));
      a === r ? d === "asc" ? i({ [t]: `-${r}` }, n) : i({ [t]: null }, n) : i({ [t]: r }, n);
    },
    [t, n]
  ), S = c(
    (r) => ({
      active: o === r,
      direction: o === r ? s : null
    }),
    [o, s]
  );
  return { sortBy: o, sortDir: s, onSort: f, getSortState: S };
}
export {
  D as useSort
};
