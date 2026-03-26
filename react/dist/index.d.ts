import { ComponentType } from 'react';
import { JSX as JSX_2 } from 'react/jsx-runtime';
import { ReactNode } from 'react';
import { RefObject } from 'react';
import { Table } from '@tanstack/table-core';

export declare interface BuiltColumn {
    id: string;
    fit: boolean;
    sortable: boolean;
    getAriaSort: () => 'ascending' | 'descending' | 'none' | undefined;
    renderHeader: () => ReactNode;
    renderCell: (row: Row, rowIndex: number) => ReactNode;
}

export declare interface CellComponentProps<TData = Record<string, unknown>> {
    /** The full row data including hidden columns */
    row: TData;
    /** The column's resolved value (row[columnName]) */
    value: unknown;
    /** The column name this component is bound to */
    column: string;
}

/** Union type for all cell display configurations from PHP Column::toArray() */
export declare type CellDisplay = {
    type: 'text';
    key?: string;
} | {
    type: 'badge';
    key?: string;
    color_field?: string;
    variant?: string;
    tooltip_key?: string;
    icon_key?: string;
} | {
    type: 'date';
    key?: string;
    formatted_key?: string;
    raw_key?: string;
    local?: boolean;
    includeTime?: boolean;
} | {
    type: 'link';
    route?: string;
    params?: Record<string, string>;
    href_key?: string;
    key?: string;
    prefetch?: boolean;
} | {
    type: 'copyable';
    key?: string;
} | {
    type: 'icon';
    key: string;
} | {
    type: 'component';
    component: string;
} | {
    type: 'actions';
};

export declare interface CellRenderProps {
    row: Row;
    value: unknown;
    column: DynamicColumnDef;
    displays: CellDisplay[];
    rowIndex: number;
}

export declare interface ClassNames {
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
}

/**
 * Remove all hooks registered for a key. If no key is provided, clears all hooks.
 * Useful in tests.
 */
export declare function clearTableHooks(key?: string): void;

/** Column definition from PHP Column::toArray() */
export declare interface DynamicColumnDef {
    name: string;
    header: string;
    sortable: boolean;
    sort_key: string;
    hidden: boolean;
    fit: boolean;
    displays: CellDisplay[];
}

export declare interface HeaderRenderProps {
    column: DynamicColumnDef;
    sortState: SortState;
    onSort: (sortKey: string) => void;
    index: number;
}

export declare type IconResolver = (name: string) => ComponentType<{
    className?: string;
}> | null | undefined;

export declare function InertiaTable(props: InertiaTableProps): JSX_2.Element;

/** Complete table data structure from PHP Table::toArray() */
export declare interface InertiaTableData {
    columns: DynamicColumnDef[];
    data: Row[];
    links: PaginationLinks;
    meta: PaginationMeta;
    searchable: boolean;
    searchDebounce: number;
    tableSettings: Record<string, unknown>;
    identifier: string | null;
}

export declare interface InertiaTableProps {
    tableData: InertiaTableData;
    /** Per-row actions render prop */
    actions?: (row: Row) => ReactNode;
    /** Cell renderer overrides by column name */
    cellRenderers?: Record<string, (props: CellRenderProps) => ReactNode>;
    /** Header renderer overrides by column name */
    headerRenderers?: Record<string, (props: HeaderRenderProps) => ReactNode>;
    renderToolbar?: (props: {
        searchable: boolean;
        searchTerm: string;
        onSearch: (term: string) => void;
        children: ReactNode;
    }) => ReactNode;
    renderToolbarActions?: () => ReactNode;
    renderSearch?: (props: SearchRenderProps) => ReactNode;
    renderHeader?: (props: HeaderRenderProps) => ReactNode;
    renderCell?: (props: CellRenderProps & {
        defaultRender: () => ReactNode;
    }) => ReactNode;
    renderRow?: (props: {
        row: Row;
        children: ReactNode;
        rowIndex: number;
    }) => ReactNode;
    renderPagination?: (props: PaginationRenderProps) => ReactNode;
    renderEmpty?: () => ReactNode;
    className?: string;
    classNames?: Partial<ClassNames>;
    modal?: boolean;
    emptyText?: string;
    nullText?: string;
    onRowClick?: (row: Row) => void;
    rowClassName?: (row: Row, index: number) => string;
    /** Pass a ref to an external search input. The table watches its value and searches with debounce. Hides the built-in search bar. */
    searchRef?: RefObject<HTMLInputElement | null>;
    /** Resolve icon components by name. Checked before the global registry. */
    iconResolver?: IconResolver;
    isFetching?: boolean;
}

/** Pagination links from Laravel */
export declare interface PaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

/** Pagination metadata from Laravel */
export declare interface PaginationMeta {
    current_page: number;
    current_page_url: string;
    from: number | null;
    path: string;
    per_page: number;
    to: number | null;
    /** Only present with full pagination (paginate(), not simplePaginate()) */
    total?: number;
    /** Only present with full pagination */
    last_page?: number;
}

export declare interface PaginationRenderProps {
    links: PaginationLinks;
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
    isFetching: boolean;
}

/** Register a named component for use with Column::component('name'). */
export declare function registerCellComponent(name: string, component: ComponentType<CellComponentProps>): void;

/** Register a single icon component by name. */
export declare function registerIcon(name: string, component: ComponentType<{
    className?: string;
}>): void;

/** Bulk register icon components. */
export declare function registerIcons(icons: Record<string, ComponentType<{
    className?: string;
}>>): void;

/**
 * Register a hook that runs when any InertiaTable mounts with a matching
 * tableSettings key.
 *
 * Multiple hooks can be registered for the same key — all will run.
 * Call this at application boot, before creating the Inertia app.
 */
export declare function registerTableHook(key: string, callback: TableHookCallback): void;

/** Every row must have an id */
export declare type Row = Record<string, unknown> & {
    id: string | number;
};

export declare interface SearchRenderProps {
    searchTerm: string;
    onSearch: (term: string) => void;
    placeholder: string;
}

export declare interface SortState {
    active: boolean;
    direction: 'asc' | 'desc' | null;
}

export declare type TableHookCallback = (context: TableHookContext) => (() => void) | void;

export declare interface TableHookContext {
    /** The value from tableSettings[key] */
    value: unknown;
    /** The full table data object */
    tableData: InertiaTableData;
    /** Trigger an Inertia reload of the table data */
    refresh: () => void;
}

export declare function useTable(props: InertiaTableProps): {
    table: Table<Row>;
    columns: BuiltColumn[];
    classNames: ClassNames;
    searchTerm: string;
    onSearch: (term: string) => void;
    hasExternalSearch: boolean;
    sortBy: string | null;
    sortDir: "asc" | "desc";
    onSort: (sortKey: string) => void;
    getSortState: (sortKey: string) => SortState;
    onPageChange: (page: number) => void;
    isProcessing: boolean;
};

export { }
