import type { InertiaTableData, Row } from '../src/types';

/** Create a realistic InertiaTableData fixture matching PHP Table::toArray() output */
export function createTableData(overrides: Partial<InertiaTableData> = {}): InertiaTableData {
    return {
        columns: [
            {
                name: 'name',
                header: 'Name',
                sortable: true,
                sort_key: 'name',
                hidden: false,
                fit: false,
                displays: [{ type: 'text' }],
            },
            {
                name: 'email',
                header: 'Email',
                sortable: true,
                sort_key: 'email',
                hidden: false,
                fit: false,
                displays: [{ type: 'copyable' }],
            },
            {
                name: 'status',
                header: 'Status',
                sortable: true,
                sort_key: 'status',
                hidden: false,
                fit: false,
                displays: [{ type: 'badge', color_field: '_status_enum_color' }],
            },
            {
                name: 'created_at',
                header: 'Created',
                sortable: true,
                sort_key: 'created_at',
                hidden: false,
                fit: false,
                displays: [{ type: 'date', formatted_key: 'created_at_formatted', raw_key: 'created_at' }],
            },
            {
                name: 'id',
                header: '',
                sortable: false,
                sort_key: 'id',
                hidden: true,
                fit: false,
                displays: [],
            },
        ],
        data: [
            { id: 1, name: 'Alice', email: 'alice@test.com', status: 'Active', _status_enum_color: 'success', created_at: '2024-01-01T10:00:00Z', created_at_formatted: 'Jan 1, 2024' },
            { id: 2, name: 'Bob', email: 'bob@test.com', status: 'Inactive', _status_enum_color: 'danger', created_at: '2024-01-02T10:00:00Z', created_at_formatted: 'Jan 2, 2024' },
            { id: 3, name: 'Charlie', email: 'charlie@test.com', status: 'Active', _status_enum_color: 'success', created_at: '2024-01-03T10:00:00Z', created_at_formatted: 'Jan 3, 2024' },
        ] as Row[],
        links: {
            first: null,
            last: null,
            prev: null,
            next: 'http://localhost/items?page=2',
        },
        meta: {
            current_page: 1,
            current_page_url: 'http://localhost/items?page=1',
            from: 1,
            path: 'http://localhost/items',
            per_page: 10,
            to: 3,
        },
        searchable: true,
        searchDebounce: 300,
        tableSettings: {},
        identifier: null,
        ...overrides,
    };
}

export function createEmptyTableData(overrides: Partial<InertiaTableData> = {}): InertiaTableData {
    return createTableData({
        data: [],
        links: { first: null, last: null, prev: null, next: null },
        meta: {
            current_page: 1,
            current_page_url: 'http://localhost/items?page=1',
            from: null,
            path: 'http://localhost/items',
            per_page: 10,
            to: null,
        },
        ...overrides,
    });
}
