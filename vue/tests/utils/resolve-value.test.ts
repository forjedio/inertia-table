import { describe, it, expect } from 'vitest';
import { resolveValue } from '../../src/utils/resolve-value';
import type { Row, CellDisplay } from '../../src/types';

describe('resolveValue', () => {
    const row: Row = { id: 1, name: 'Alice', email: 'alice@test.com', _custom_key: 'custom' };

    it('returns row[columnName] when display has no key', () => {
        const display: CellDisplay = { type: 'text' };
        expect(resolveValue(row, display, 'name')).toBe('Alice');
    });

    it('returns row[key] when display has a key', () => {
        const display: CellDisplay = { type: 'text', key: '_custom_key' };
        expect(resolveValue(row, display, 'name')).toBe('custom');
    });

    it('returns undefined when key references non-existent field', () => {
        const display: CellDisplay = { type: 'text', key: 'nonexistent' };
        expect(resolveValue(row, display, 'name')).toBeUndefined();
    });

    it('returns undefined when columnName references non-existent field', () => {
        const display: CellDisplay = { type: 'text' };
        expect(resolveValue(row, display, 'nonexistent')).toBeUndefined();
    });

    it('ignores empty string key and falls back to columnName', () => {
        const display: CellDisplay = { type: 'text', key: '' };
        expect(resolveValue(row, display, 'name')).toBe('Alice');
    });
});
