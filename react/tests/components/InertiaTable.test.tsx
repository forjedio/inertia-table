import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { InertiaTable } from '../../src';
import { createTableData, createEmptyTableData } from '../fixtures';

// Mock @inertiajs/react
vi.mock('@inertiajs/react', () => ({
    router: {
        reload: vi.fn(),
        get: vi.fn(),
        on: vi.fn(() => () => {}),
    },
    Link: ({ children, href, ...props }: any) =>
        React.createElement('a', { href, ...props }, children),
}));

// Mock ziggy-js route function
beforeEach(() => {
    (window as any).route = vi.fn((name: string, params: Record<string, any>) => {
        return `/${name.replace(/\./g, '/')}/${Object.values(params).join('/')}`;
    });
});

describe('InertiaTable', () => {
    it('renders table with correct headers', () => {
        const tableData = createTableData();

        render(<InertiaTable tableData={tableData} />);

        // Hidden columns should not render headers
        expect(screen.getByText('Name')).toBeTruthy();
        expect(screen.getByText('Email')).toBeTruthy();
        expect(screen.getByText('Status')).toBeTruthy();
        expect(screen.getByText('Created')).toBeTruthy();
    });

    it('renders rows with data', () => {
        const tableData = createTableData();

        render(<InertiaTable tableData={tableData} />);

        expect(screen.getByText('Alice')).toBeTruthy();
        expect(screen.getByText('Bob')).toBeTruthy();
        expect(screen.getByText('Charlie')).toBeTruthy();
    });

    it('renders search input when searchable is true', () => {
        const tableData = createTableData({ searchable: true });

        render(<InertiaTable tableData={tableData} />);

        expect(screen.getByPlaceholderText('Search...')).toBeTruthy();
    });

    it('hides search input when searchable is false', () => {
        const tableData = createTableData({ searchable: false });

        render(<InertiaTable tableData={tableData} />);

        expect(screen.queryByPlaceholderText('Search...')).toBeNull();
    });

    it('renders empty state when no data', () => {
        const tableData = createEmptyTableData();

        render(<InertiaTable tableData={tableData} />);

        expect(screen.getByText('No results found.')).toBeTruthy();
    });

    it('renders custom empty state via renderEmpty', () => {
        const tableData = createEmptyTableData();

        render(
            <InertiaTable
                tableData={tableData}
                renderEmpty={() => <div>Custom empty state</div>}
            />,
        );

        expect(screen.getByText('Custom empty state')).toBeTruthy();
    });

    it('renders custom emptyText', () => {
        const tableData = createEmptyTableData();

        render(<InertiaTable tableData={tableData} emptyText="Nothing here" />);

        expect(screen.getByText('Nothing here')).toBeTruthy();
    });

    it('renders badge cells with variant classes', () => {
        const tableData = createTableData();

        render(<InertiaTable tableData={tableData} />);

        const activeBadges = screen.getAllByText('Active');
        expect(activeBadges.length).toBeGreaterThan(0);
        expect(activeBadges[0].className).toContain('rounded-full');
    });

    it('renders actions column when actions prop provided', () => {
        const tableData = createTableData();

        render(
            <InertiaTable
                tableData={tableData}
                actions={(row) => (
                    <button data-testid={`action-${row.id}`}>Edit</button>
                )}
            />,
        );

        expect(screen.getByTestId('action-1')).toBeTruthy();
        expect(screen.getByTestId('action-2')).toBeTruthy();
        expect(screen.getByTestId('action-3')).toBeTruthy();
    });

    it('renders cellRenderers override for specific column', () => {
        const tableData = createTableData();

        render(
            <InertiaTable
                tableData={tableData}
                cellRenderers={{
                    status: ({ value }) => (
                        <span data-testid="custom-status">{String(value)}</span>
                    ),
                }}
            />,
        );

        const customElements = screen.getAllByTestId('custom-status');
        expect(customElements.length).toBe(3);
    });

    it('removes wrapper styles when modal is true', () => {
        const tableData = createTableData();

        const { container } = render(
            <InertiaTable tableData={tableData} modal={true} />,
        );

        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.className).not.toContain('rounded-lg');
        expect(wrapper.className).not.toContain('shadow-sm');
    });

    it('applies opacity when isFetching is true', () => {
        const tableData = createTableData();

        const { container } = render(
            <InertiaTable tableData={tableData} isFetching={true} />,
        );

        const tableContainer = container.querySelector('.overflow-x-auto') as HTMLElement;
        expect(tableContainer.className).toContain('opacity-50');
        expect(tableContainer.className).toContain('pointer-events-none');
    });

    it('renders pagination when data exists', () => {
        const tableData = createTableData();

        render(<InertiaTable tableData={tableData} />);

        expect(screen.getByText('Showing 1 to 3 results')).toBeTruthy();
        expect(screen.getByText('Next')).toBeTruthy();
    });

    it('hides pagination when no data', () => {
        const tableData = createEmptyTableData();

        render(<InertiaTable tableData={tableData} />);

        expect(screen.queryByText('Next')).toBeNull();
    });

    it('renders pagination with total when using full pagination', () => {
        const tableData = createTableData({
            meta: {
                current_page: 1,
                current_page_url: 'http://localhost/items?page=1',
                from: 1,
                path: 'http://localhost/items',
                per_page: 10,
                to: 3,
                total: 25,
                last_page: 3,
            },
            links: {
                first: 'http://localhost/items?page=1',
                last: 'http://localhost/items?page=3',
                prev: null,
                next: 'http://localhost/items?page=2',
            },
        });

        render(<InertiaTable tableData={tableData} />);

        expect(screen.getByText('Showing 1 to 3 of 25 results')).toBeTruthy();
    });

    it('does not render hidden columns', () => {
        const tableData = createTableData();

        const { container } = render(<InertiaTable tableData={tableData} />);

        // The 'id' column is hidden — should have 4 visible column headers, not 5
        const headers = container.querySelectorAll('th');
        expect(headers.length).toBe(4);
    });

    it('renders custom search via renderSearch', () => {
        const tableData = createTableData({ searchable: true });

        render(
            <InertiaTable
                tableData={tableData}
                renderSearch={({ searchTerm, onSearch }) => (
                    <input
                        data-testid="custom-search"
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                    />
                )}
            />,
        );

        expect(screen.getByTestId('custom-search')).toBeTruthy();
    });

    it('renders custom pagination via renderPagination', () => {
        const tableData = createTableData();

        render(
            <InertiaTable
                tableData={tableData}
                renderPagination={({ meta }) => (
                    <div data-testid="custom-pagination">Page {meta.current_page}</div>
                )}
            />,
        );

        expect(screen.getByTestId('custom-pagination')).toBeTruthy();
    });

    it('applies custom classNames', () => {
        const tableData = createTableData();

        const { container } = render(
            <InertiaTable
                tableData={tableData}
                classNames={{ wrapper: 'custom-wrapper' }}
            />,
        );

        const wrapper = container.firstChild as HTMLElement;
        expect(wrapper.className).toContain('custom-wrapper');
    });
});
