import { useCallback as t } from "react";
import { navigateWithParams as i } from "../utils/navigate.js";
function g(n) {
  return { onPageChange: t(
    (o) => {
      i({ [n]: String(o) }, n);
    },
    [n]
  ) };
}
export {
  g as usePagination
};
