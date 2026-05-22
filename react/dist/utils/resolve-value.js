function t(n, e, r) {
  return "key" in e && e.key ? n[e.key] : n[r];
}
export {
  t as resolveValue
};
