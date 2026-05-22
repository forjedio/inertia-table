function i(t, o) {
  const e = {};
  for (const [r, n] of Object.entries(o))
    if (n.startsWith(":")) {
      const s = n.slice(1);
      e[r] = t[s];
    } else
      e[r] = n;
  return e;
}
function u(t, o) {
  const e = window.route;
  return typeof e == "function" ? e(t, o) : (console.warn(
    `[inertia-table-react] Ziggy route() not found. Set 'use_ziggy' => false in config to resolve routes server-side, or install ziggy-js. Route: ${t}`
  ), "#");
}
export {
  u as buildHref,
  i as resolveRouteParams
};
