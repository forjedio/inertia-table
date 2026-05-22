import { router as n } from "@inertiajs/react";
function c(r, t = "page") {
  const e = new URL(window.location.href);
  for (const [a, s] of Object.entries(r))
    s === null ? e.searchParams.delete(a) : e.searchParams.set(a, s);
  t in r || e.searchParams.delete(t), n.get(e.toString(), {}, { preserveState: !0, preserveScroll: !0 });
}
export {
  c as navigateWithParams
};
