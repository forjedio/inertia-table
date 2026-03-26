import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import InertiaTable from '../../src/components/InertiaTable.vue';
import { createTableData, createEmptyTableData } from '../fixtures';

vi.mock('@inertiajs/vue3', () => ({
    router: {
        reload: vi.fn(),
        get: vi.fn(),
        on: vi.fn(() => () => {}),
    },
    Link: {
        name: 'Link',
        props: ['href', 'prefetch'],
        setup(props: any, { slots }: any) {
            return () => h('a', { href: props.href }, slots.default?.());
        },
    },
}));

beforeEach(() => {
    (window as any).route = vi.fn((name: string, params: Record<string, any>) => {
        return `/${name.replace(/\./g, '/')}/${Object.values(params).join('/')}`;
    });
});

describe('InertiaTable', () => {
    it('renders table with correct headers', () => {
        const wrapper = mount(InertiaTable, {
            props: { tableData: createTableData() },
        });

        expect(wrapper.text()).toContain('Name');
        expect(wrapper.text()).toContain('Email');
        expect(wrapper.text()).toContain('Status');
        expect(wrapper.text()).toContain('Created');
    });

    it('renders rows with data', () => {
        const wrapper = mount(InertiaTable, {
            props: { tableData: createTableData() },
        });

        expect(wrapper.text()).toContain('Alice');
        expect(wrapper.text()).toContain('Bob');
        expect(wrapper.text()).toContain('Charlie');
    });

    it('renders search input when searchable is true', () => {
        const wrapper = mount(InertiaTable, {
            props: { tableData: createTableData({ searchable: true }) },
        });

        expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    });

    it('hides search input when searchable is false', () => {
        const wrapper = mount(InertiaTable, {
            props: { tableData: createTableData({ searchable: false }) },
        });

        expect(wrapper.find('input[type="text"]').exists()).toBe(false);
    });

    it('renders empty state when no data', () => {
        const wrapper = mount(InertiaTable, {
            props: { tableData: createEmptyTableData() },
        });

        expect(wrapper.text()).toContain('No results found.');
    });

    it('renders custom empty state via slot', () => {
        const wrapper = mount(InertiaTable, {
            props: { tableData: createEmptyTableData() },
            slots: {
                empty: () => h('div', 'Custom empty state'),
            },
        });

        expect(wrapper.text()).toContain('Custom empty state');
    });

    it('renders custom emptyText', () => {
        const wrapper = mount(InertiaTable, {
            props: { tableData: createEmptyTableData(), emptyText: 'Nothing here' },
        });

        expect(wrapper.text()).toContain('Nothing here');
    });

    it('renders badge cells', () => {
        const wrapper = mount(InertiaTable, {
            props: { tableData: createTableData() },
        });

        const badges = wrapper.findAll('.rounded-full');
        expect(badges.length).toBeGreaterThan(0);
    });

    it('renders actions column when slot provided', () => {
        const wrapper = mount(InertiaTable, {
            props: { tableData: createTableData() },
            slots: {
                actions: (props: any) => h('button', { 'data-testid': `action-${props.row.id}` }, 'Edit'),
            },
        });

        expect(wrapper.find('[data-testid="action-1"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="action-2"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="action-3"]').exists()).toBe(true);
    });

    it('renders cell slot override for specific column', () => {
        const wrapper = mount(InertiaTable, {
            props: { tableData: createTableData() },
            slots: {
                'cell-status': (props: any) => h('span', { 'data-testid': 'custom-status' }, String(props.value)),
            },
        });

        const customElements = wrapper.findAll('[data-testid="custom-status"]');
        expect(customElements.length).toBe(3);
    });

    it('removes wrapper styles when modal is true', () => {
        const wrapper = mount(InertiaTable, {
            props: { tableData: createTableData(), modal: true },
        });

        const rootEl = wrapper.element as HTMLElement;
        expect(rootEl.className).not.toContain('rounded-lg');
        expect(rootEl.className).not.toContain('shadow-sm');
    });

    it('applies opacity when isFetching is true', () => {
        const wrapper = mount(InertiaTable, {
            props: { tableData: createTableData(), isFetching: true },
        });

        const tableContainer = wrapper.find('.overflow-x-auto');
        expect(tableContainer.classes()).toContain('opacity-50');
        expect(tableContainer.classes()).toContain('pointer-events-none');
    });

    it('renders pagination when data exists', () => {
        const wrapper = mount(InertiaTable, {
            props: { tableData: createTableData() },
        });

        expect(wrapper.text()).toContain('Showing 1 to 3 results');
        expect(wrapper.text()).toContain('Next');
    });

    it('hides pagination when no data', () => {
        const wrapper = mount(InertiaTable, {
            props: { tableData: createEmptyTableData() },
        });

        expect(wrapper.text()).not.toContain('Next');
    });

    it('renders pagination with total for full pagination', () => {
        const wrapper = mount(InertiaTable, {
            props: {
                tableData: createTableData({
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
                }),
            },
        });

        expect(wrapper.text()).toContain('Showing 1 to 3 of 25 results');
    });

    it('does not render hidden columns', () => {
        const wrapper = mount(InertiaTable, {
            props: { tableData: createTableData() },
        });

        const headers = wrapper.findAll('th');
        expect(headers.length).toBe(4);
    });

    it('renders custom search via slot', () => {
        const wrapper = mount(InertiaTable, {
            props: { tableData: createTableData({ searchable: true }) },
            slots: {
                search: (props: any) => h('input', { 'data-testid': 'custom-search', value: props.searchTerm }),
            },
        });

        expect(wrapper.find('[data-testid="custom-search"]').exists()).toBe(true);
    });

    it('renders custom pagination via slot', () => {
        const wrapper = mount(InertiaTable, {
            props: { tableData: createTableData() },
            slots: {
                pagination: (props: any) => h('div', { 'data-testid': 'custom-pagination' }, `Page ${props.meta.current_page}`),
            },
        });

        expect(wrapper.find('[data-testid="custom-pagination"]').exists()).toBe(true);
    });

    it('applies custom classNames', () => {
        const wrapper = mount(InertiaTable, {
            props: {
                tableData: createTableData(),
                classNames: { wrapper: 'custom-wrapper' },
            },
        });

        const rootEl = wrapper.element as HTMLElement;
        expect(rootEl.className).toContain('custom-wrapper');
    });
});
