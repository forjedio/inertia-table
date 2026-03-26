import { computed, ref, watch, onUnmounted, type Ref, type Slots } from 'vue';
import { router } from '@inertiajs/vue3';
import type { InertiaTableProps, InertiaTableData, ClassNames, IconResolver } from '@/types';
import { useSearch } from './useSearch';
import { useSort } from './useSort';
import { usePagination } from './usePagination';
import { useTableHooks } from './useTableHooks';
import { useColumnBuilder } from './useColumnBuilder';

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

export function useTable(props: InertiaTableProps, slots: Slots) {
    const { tableData } = props;
    const nullText = props.nullText ?? '-';

    const classNames = computed<ClassNames>(() => ({
        ...DEFAULT_CLASS_NAMES,
        ...props.classNames,
    }));

    const identifier = tableData.identifier ?? null;
    const searchParam = getParamName(identifier, 'Search', 'search');
    const sortParam = getParamName(identifier, 'Sort', 'sort');
    const pageParam = getParamName(identifier, 'Page', 'page');

    const { onPageChange } = usePagination(pageParam);
    const { searchTerm, onSearch, hasExternalSearch } = useSearch(tableData.searchDebounce, searchParam, pageParam, props.searchRef);
    const { sortBy, sortDir, onSort, getSortState } = useSort(sortParam, pageParam);

    const columns = useColumnBuilder({
        tableData,
        slots,
        onSort,
        getSortState,
        nullText,
        classNames,
        iconResolver: props.iconResolver,
    });

    useTableHooks(tableData);

    const isProcessing = useInertiaProcessing(tableData, searchParam, sortParam, pageParam);

    return {
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
): Ref<boolean> {
    const processing = ref(false);
    let prevData = tableData.data;

    watch(() => tableData.data, (newData) => {
        if (prevData !== newData) {
            prevData = newData;
            processing.value = false;
        }
    });

    const relevantParams = [searchParam, sortParam, pageParam];

    const removeStart = router.on('start', (event) => {
        try {
            const visitUrl = new URL((event as CustomEvent).detail.visit.url);
            const currentUrl = new URL(window.location.href);

            const isRelevant = relevantParams.some((p) => {
                return visitUrl.searchParams.get(p) !== currentUrl.searchParams.get(p);
            });

            if (isRelevant) {
                processing.value = true;
            }
        } catch {
            processing.value = true;
        }
    });

    const removeFinish = router.on('finish', () => {
        processing.value = false;
    });

    onUnmounted(() => {
        removeStart();
        removeFinish();
    });

    return processing;
}
