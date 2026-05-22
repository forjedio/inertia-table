const t = /* @__PURE__ */ new Map();
function r(e, n) {
  t.set(e, n);
}
function c(e) {
  for (const [n, o] of Object.entries(e))
    t.set(n, o);
}
function s(e) {
  return t.get(e);
}
export {
  s as getIcon,
  r as registerIcon,
  c as registerIcons
};
