import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { InertiaTable } from '../../src';
import { createTableData } from '../fixtures';
import type { Row } from '../../src/types';

vi.mock('@inertiajs/react', () => ({
    router: { reload: vi.fn(), get: vi.fn(), on: vi.fn(() => () => {}) },
    Link: ({ children, href, ...props }: any) =>
        React.createElement('a', { href, ...props }, children),
}));

beforeEach(() => {
    (window as any).route = vi.fn();
});

describe('Null date column rendering (issue #12)', () => {
    const dashHtml = '<span class="text-gray-400 dark:text-gray-500">-</span>';

    it('renders "-" placeholder when formatted_key value is null', () => {
        const tableData = createTableData({
            data: [
                {
                    id: 1,
                    name: 'X',
                    email: 'x@x.com',
                    status: 'Active',
                    _status_enum_color: 'success',
                    created_at: null,
                    created_at_formatted: null,
                },
            ] as Row[],
        });
        const { container } = render(<InertiaTable tableData={tableData} />);
        const dateCell = container.querySelectorAll('tbody td')[3];
        expect(dateCell?.innerHTML).toBe(dashHtml);
    });

    it('renders "-" placeholder when formatted_key value is an empty string', () => {
        const tableData = createTableData({
            data: [
                {
                    id: 1,
                    name: 'X',
                    email: 'x@x.com',
                    status: 'Active',
                    _status_enum_color: 'success',
                    created_at: '',
                    created_at_formatted: '',
                },
            ] as Row[],
        });
        const { container } = render(<InertiaTable tableData={tableData} />);
        const dateCell = container.querySelectorAll('tbody td')[3];
        expect(dateCell?.innerHTML).toBe(dashHtml);
    });

    it('renders "-" placeholder when formatted_key value is missing', () => {
        const tableData = createTableData({
            data: [
                {
                    id: 1,
                    name: 'X',
                    email: 'x@x.com',
                    status: 'Active',
                    _status_enum_color: 'success',
                },
            ] as Row[],
        });
        const { container } = render(<InertiaTable tableData={tableData} />);
        const dateCell = container.querySelectorAll('tbody td')[3];
        expect(dateCell?.innerHTML).toBe(dashHtml);
    });
});
