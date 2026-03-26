import type { Component, Ref, VNode } from 'vue';

export type CellDisplay =
    | { type: 'text'; key?: string }
    | { type: 'badge'; key?: string; color_field?: string; variant?: string; tooltip_key?: string; icon_key?: string }
    | { type: 'date'; key?: string; formatted_key?: string; raw_key?: string; local?: boolean; includeTime?: boolean }
    | { type: 'link'; route?: string; params?: Record<string, string>; href_key?: string; key?: string; prefetch?: boolean }
    | { type: 'copyable'; key?: string }
    | { type: 'icon'; key: string }
    | { type: 'component'; component: string }
    | { type: 'actions' };

export interface DynamicColumnDef {
    name: string;
    header: string;
    sortable: boolean;
    sort_key: string;
    hidden: boolean;
    fit: boolean;
    displays: CellDisplay[];
}

export type Row = Record<string, unknown> & { id: string | number };

export interface PaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface PaginationMeta {
    current_page: number;
    current_page_url: string;
    from: number | null;
    path: string;
    per_page: number;
    to: number | null;
    total?: number;
    last_page?: number;
}

export interface InertiaTableData {
    columns: DynamicColumnDef[];
    data: Row[];
    links: PaginationLinks;
    meta: PaginationMeta;
    searchable: boolean;
    searchDebounce: number;
    tableSettings: Record<string, unknown>;
    identifier: string | null;
}

export interface TableHookContext {
    value: unknown;
    tableData: InertiaTableData;
    refresh: () => void;
}

export type TableHookCallback = (context: TableHookContext) => (() => void) | void;

export interface SortState {
    active: boolean;
    direction: 'asc' | 'desc' | null;
}

export interface CellRenderProps {
    row: Row;
    value: unknown;
    column: DynamicColumnDef;
    displays: CellDisplay[];
    rowIndex: number;
}

export interface HeaderRenderProps {
    column: DynamicColumnDef;
    sortState: SortState;
    onSort: (sortKey: string) => void;
    index: number;
}

export interface SearchRenderProps {
    searchTerm: string;
    onSearch: (term: string) => void;
    placeholder: string;
}

export interface PaginationRenderProps {
    links: PaginationLinks;
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
    isFetching: boolean;
}

export interface ClassNames {
    wrapper: string;
    toolbar: string;
    table: string;
    thead: string;
    th: string;
    thSortable: string;
    thSorted: string;
    tbody: string;
    tr: string;
    trClickable: string;
    td: string;
    search: string;
    pagination: string;
    paginationButton: string;
    paginationInfo: string;
    empty: string;
    link: string;
}

export interface BuiltColumn {
    id: string;
    fit: boolean;
    sortable: boolean;
    getAriaSort: () => 'ascending' | 'descending' | 'none' | undefined;
    renderHeader: () => VNode | string | null;
    renderCell: (row: Row, rowIndex: number) => VNode | string | null;
}

export interface CellComponentProps<TData = Record<string, unknown>> {
    row: TData;
    value: unknown;
    column: string;
}

export type IconResolver = (name: string) => Component | null | undefined;

export interface InertiaTableProps {
    tableData: InertiaTableData;
    className?: string;
    classNames?: Partial<ClassNames>;
    modal?: boolean;
    emptyText?: string;
    nullText?: string;
    onRowClick?: (row: Row) => void;
    rowClassName?: (row: Row, index: number) => string;
    isFetching?: boolean;
    searchRef?: Ref<HTMLInputElement | null>;
    iconResolver?: IconResolver;
}

export interface InertiaTableSlots {
    search?: (props: SearchRenderProps) => any;
    pagination?: (props: PaginationRenderProps) => any;
    empty?: () => any;
    header?: (props: HeaderRenderProps) => any;
    cell?: (props: CellRenderProps & { defaultRender: () => VNode | string | null }) => any;
    row?: (props: { row: Row; rowIndex: number }) => any;
    toolbar?: (props: { searchable: boolean; searchTerm: string; onSearch: (term: string) => void }) => any;
    'toolbar-actions'?: () => any;
    actions?: (props: { row: Row }) => any;
    [key: `cell-${string}`]: (props: CellRenderProps) => any;
    [key: `header-${string}`]: (props: HeaderRenderProps) => any;
}