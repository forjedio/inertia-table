import { useState as p, useRef as d, useCallback as f, useEffect as s } from "react";
import { navigateWithParams as w } from "../utils/navigate.js";
function E(i, e, o, n) {
  const [l, m] = p(() => typeof window > "u" ? "" : new URLSearchParams(window.location.search).get(e) ?? ""), r = d(null), u = f(
    (t) => {
      m(t), r.current && clearTimeout(r.current), r.current = setTimeout(() => {
        w(
          { [e]: t || null },
          o
        );
      }, i);
    },
    [i, e, o]
  );
  return s(() => () => {
    r.current && clearTimeout(r.current);
  }, []), s(() => {
    if (!(n != null && n.current)) return;
    const t = n.current;
    if (typeof window > "u") return;
    const c = new URLSearchParams(window.location.search).get(e) ?? "";
    t.value !== c && (t.value = c);
    const a = () => {
      u(t.value);
    };
    return t.addEventListener("input", a), () => {
      t.removeEventListener("input", a);
    };
  }, [n, e, u]), { searchTerm: l, onSearch: u, hasExternalSearch: !!n };
}
export {
  E as useSearch
};
