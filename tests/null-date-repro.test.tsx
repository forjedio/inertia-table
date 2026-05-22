import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { InertiaTable } from '../src';
import { createTableData } from './fixtures';
import type { Row } from '../src/types';

vi.mock('@inertiajs/react', () => ({
    router: { reload: vi.fn(), get: vi.fn(), on: vi.fn(() => () => {}) },
    Link: ({ children, href, ...props }: any) => React.createElement('a', { href, ...props }, children),
}));

beforeEach(() => {
    (window as any).route = vi.fn();
});

describe('Reproductions', () => {
    it('A: formatted_key=null', () => {
        const tableData = createTableData({
            data: [{ id: 1, name: 'X', email: 'x@x.com', status: 'A', _status_enum_color: 'success', created_at: null, created_at_formatted: null }] as Row[],
        });
        const { container } = render(<InertiaTable tableData={tableData} />);
        console.log('A:', container.querySelectorAll('tbody td')[3]?.outerHTML);
    });

    it('B: formatted_key missing entirely', () => {
        const tableData = createTableData({
            data: [{ id: 1, name: 'X', email: 'x@x.com', status: 'A', _status_enum_color: 'success' }] as Row[],
        });
        const { container } = render(<InertiaTable tableData={tableData} />);
        console.log('B:', container.querySelectorAll('tbody td')[3]?.outerHTML);
    });

    it('C: only raw_key, no formatted_key in display', () => {
        const td = createTableData();
        // Date column has formatted_key set in fixtures already; remove it
        td.columns[3].displays = [{ type: 'date', raw_key: 'created_at' } as any];
        td.data = [{ id: 1, name: 'X', email: 'x@x.com', status: 'A', _status_enum_color: 'success', created_at: null }] as Row[];
        const { container } = render(<InertiaTable tableData={td} />);
        console.log('C:', container.querySelectorAll('tbody td')[3]?.outerHTML);
    });
});
