import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    createColumnHelper,
    type ColumnDef,
} from '@tanstack/react-table';
import { router } from '@inertiajs/react';
import type { InertiaTableProps, InertiaTableData, ClassNames, Row, BuiltColumn } from '@/types';
import { useSearch } from './useSearch';
import { useSort } from './useSort';
import { usePagination } from './usePagination';
import { useTableHooks } from './useTableHooks';
import { useColumnBuilder } from './useColumnBuilder';

const tanstackColumnHelper = createColumnHelper<Row>();
const coreRowModel = getCoreRowModel<Row>();

const DEFAULT_CLASS_NAMES: ClassNames = {
    wrapper: 'rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900',
    toolbar: 'flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700',
    table: 'min-w-full',
    thead: 'bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700',
    th: 'px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-400',
    thSortable: 'cursor-pointer select-none',
    thSorted: 'text-gray-900 dark:text-gray-100',
    tbody: 'divide-y divide-gray-100 dark:divide-gray-700',
    tr: 'hover:bg-gray-50 transition-colors dark:hover:bg-gray-800',
    trClickable: 'cursor-pointer',
    td: 'px-4 py-3 text-sm text-gray-900 dark:text-gray-200',
    search: 'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 dark:focus:border-blue-400',
    pagination: 'flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700',
    paginationButton: 'px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700',
    paginationInfo: 'text-sm text-gray-500 dark:text-gray-400',
    empty: 'p-8 text-center text-gray-500 dark:text-gray-400',
};

function getParamName(identifier: string | null, suffix: string, fallback: string): string {
    return identifier ? `${identifier}${suffix}` : fallback;
}

export function useTable(props: InertiaTableProps) {
    const {
        tableData,
        cellRenderers,
        headerRenderers,
        actions,
        renderCell,
        renderHeader,
        classNames: classNamesOverrides,
        nullText = '-',
        iconResolver,
    } = props;

    const classNames: ClassNames = useMemo(
        () => ({ ...DEFAULT_CLASS_NAMES, ...classNamesOverrides }),
        // Only recompute when overrides actually change (by value)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(classNamesOverrides)],
    );

    // Derive scoped param names from identifier
    const identifier = tableData.identifier ?? null;
    const searchParam = getParamName(identifier, 'Search', 'search');
    const sortParam = getParamName(identifier, 'Sort', 'sort');
    const pageParam = getParamName(identifier, 'Page', 'page');

    const { onPageChange } = usePagination(pageParam);
    const { searchTerm, onSearch, hasExternalSearch } = useSearch(tableData.searchDebounce, searchParam, pageParam, props.searchRef);
    const { sortBy, sortDir, onSort, getSortState } = useSort(sortParam, pageParam);

    const columns = useColumnBuilder({
        tableData,
        cellRenderers,
        headerRenderers,
        actions,
        renderCell,
        renderHeader,
        onSort,
        getSortState,
        nullText,
        classNames,
        iconResolver,
    });

    // Build TanStack table from our BuiltColumn[]
    const tanstackColumns = useMemo<ColumnDef<Row, unknown>[]>(
        () =>
            columns.map((col: BuiltColumn) =>
                tanstackColumnHelper.display({
                    id: col.id,
                    header: () => col.renderHeader(),
                    cell: ({ row: tanstackRow }) =>
                        col.renderCell(tanstackRow.original, tanstackRow.index),
                }),
            ),
        [columns],
    );

    const table = useReactTable({
        data: tableData.data,
        columns: tanstackColumns,
        getCoreRowModel: coreRowModel,
    });

    useTableHooks(tableData);

    const isProcessing = useInertiaProcessing(tableData, searchParam, sortParam, pageParam);

    return {
        table,
        columns,
        classNames,
        searchTerm,
        onSearch,
        hasExternalSearch,
        sortBy,
        sortDir,
        onSort,
        getSortState,
        onPageChange,
        isProcessing,
    };
}

/**
 * Tracks Inertia router navigation state scoped to this table's params.
 * Only triggers when the navigation URL contains params relevant to this table.
 */
function useInertiaProcessing(
    tableData: InertiaTableData,
    searchParam: string,
    sortParam: string,
    pageParam: string,
): boolean {
    const [processing, setProcessing] = useState(false);
    const prevDataRef = useRef(tableData.data);

    // Clear processing when tableData actually changes (new data arrived)
    useEffect(() => {
        if (prevDataRef.current !== tableData.data) {
            prevDataRef.current = tableData.data;
            setProcessing(false);
        }
    }, [tableData.data]);

    // Listen to Inertia router events, scoped to this table's params
    useEffect(() => {
        const relevantParams = [searchParam, sortParam, pageParam];

        const removeStart = router.on('start', (event) => {
            try {
                const visitUrl = new URL((event as CustomEvent).detail.visit.url);
                const currentUrl = new URL(window.location.href);

                // Check if any relevant param changed between current and target URL
                const isRelevant = relevantParams.some((p) => {
                    return visitUrl.searchParams.get(p) !== currentUrl.searchParams.get(p);
                });

                if (isRelevant) {
                    setProcessing(true);
                }
            } catch {
                // If URL parsing fails, fall back to showing processing
                setProcessing(true);
            }
        });

        const removeFinish = router.on('finish', () => {
            setProcessing(false);
        });

        return () => {
            removeStart();
            removeFinish();
        };
    }, [searchParam, sortParam, pageParam]);

    return processing;
}
