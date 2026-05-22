const t = /* @__PURE__ */ new Map();
function o(e, n) {
  t.set(e, n);
}
function r(e) {
  return t.get(e);
}
export {
  r as getCellComponent,
  o as registerCellComponent
};
