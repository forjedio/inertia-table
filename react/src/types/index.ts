import type { ReactNode, ComponentType, RefObject } from 'react';

// ─── Backend Response Types ─────────────────────────

/** Union type for all cell display configurations from PHP Column::toArray() */
export type CellDisplay =
    | { type: 'text'; key?: string }
    | { type: 'badge'; key?: string; color_field?: string; variant?: string; tooltip_key?: string; icon_key?: string }
    | { type: 'date'; key?: string; formatted_key?: string; raw_key?: string; local?: boolean; includeTime?: boolean }
    | { type: 'link'; route?: string; params?: Record<string, string>; href_key?: string; key?: string; prefetch?: boolean }
    | { type: 'copyable'; key?: string }
    | { type: 'icon'; key: string }
    | { type: 'component'; component: string }
    | { type: 'actions' };

/** Column definition from PHP Column::toArray() */
export interface DynamicColumnDef {
    name: string;
    header: string;
    sortable: boolean;
    sort_key: string;
    hidden: boolean;
    fit: boolean;
    displays: CellDisplay[];
}

/** Every row must have an id */
export type Row = Record<string, unknown> & { id: string | number };

/** Pagination links from Laravel */
export interface PaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

/** Pagination metadata from Laravel */
export interface PaginationMeta {
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

/** Complete table data structure from PHP Table::toArray() */
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

// ─── Hook System ────────────────────────────────────

export interface TableHookContext {
    /** The value from tableSettings[key] */
    value: unknown;
    /** The full table data object */
    tableData: InertiaTableData;
    /** Trigger an Inertia reload of the table data */
    refresh: () => void;
}

export type TableHookCallback = (context: TableHookContext) => (() => void) | void;

// ─── Sort State ─────────────────────────────────────

export interface SortState {
    active: boolean;
    direction: 'asc' | 'desc' | null;
}

// ─── Render Context Types ───────────────────────────

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

// ─── ClassNames ─────────────────────────────────────

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
}

// ─── Built Column (internal table rendering) ───────

export interface BuiltColumn {
    id: string;
    fit: boolean;
    sortable: boolean;
    getAriaSort: () => 'ascending' | 'descending' | 'none' | undefined;
    renderHeader: () => ReactNode;
    renderCell: (row: Row, rowIndex: number) => ReactNode;
}

// ─── Registries ─────────────────────────────────────

export interface CellComponentProps<TData = Record<string, unknown>> {
    /** The full row data including hidden columns */
    row: TData;
    /** The column's resolved value (row[columnName]) */
    value: unknown;
    /** The column name this component is bound to */
    column: string;
}

export type IconResolver = (name: string) => ComponentType<{ className?: string }> | null | undefined;

// ─── Component Props ────────────────────────────────

export interface InertiaTableProps {
    tableData: InertiaTableData;

    /** Per-row actions render prop */
    actions?: (row: Row) => ReactNode;

    /** Cell renderer overrides by column name */
    cellRenderers?: Record<string, (props: CellRenderProps) => ReactNode>;

    /** Header renderer overrides by column name */
    headerRenderers?: Record<string, (props: HeaderRenderProps) => ReactNode>;

    // ─── Render prop overrides ───────────────────
    renderToolbar?: (props: {
        searchable: boolean;
        searchTerm: string;
        onSearch: (term: string) => void;
        children: ReactNode;
    }) => ReactNode;
    renderToolbarActions?: () => ReactNode;
    renderSearch?: (props: SearchRenderProps) => ReactNode;
    renderHeader?: (props: HeaderRenderProps) => ReactNode;
    renderCell?: (props: CellRenderProps & { defaultRender: () => ReactNode }) => ReactNode;
    renderRow?: (props: { row: Row; children: ReactNode; rowIndex: number }) => ReactNode;
    renderPagination?: (props: PaginationRenderProps) => ReactNode;
    renderEmpty?: () => ReactNode;

    // ─── Customisation ──────────────────────────
    className?: string;
    classNames?: Partial<ClassNames>;
    modal?: boolean;
    emptyText?: string;
    nullText?: string;

    // ─── Row interaction ────────────────────────
    onRowClick?: (row: Row) => void;
    rowClassName?: (row: Row, index: number) => string;

    // ─── External search ────────────────────────
    /** Pass a ref to an external search input. The table watches its value and searches with debounce. Hides the built-in search bar. */
    searchRef?: RefObject<HTMLInputElement | null>;

    // ─── Icons ────────────────────────────────────
    /** Resolve icon components by name. Checked before the global registry. */
    iconResolver?: IconResolver;

    // ─── Loading states ─────────────────────────
    isFetching?: boolean;
}
