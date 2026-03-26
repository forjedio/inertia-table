import type { CellDisplay, Row } from '@/types';

/**
 * Resolve the display value from a row.
 * If the display has a `key`, use that field from the row.
 * Otherwise, use the column's own value (row[columnName]).
 */
export function resolveValue(row: Row, display: CellDisplay, columnName: string): unknown {
    if ('key' in display && display.key) {
        return row[display.key];
    }
    return row[columnName];
}
