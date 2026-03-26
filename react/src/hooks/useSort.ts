import { useCallback } from 'react';
import type { SortState } from '@/types';
import { navigateWithParams } from '@/utils/navigate';

interface UseSortReturn {
    sortBy: string | null;
    sortDir: 'asc' | 'desc';
    onSort: (sortKey: string) => void;
    getSortState: (sortKey: string) => SortState;
}

/**
 * Parse a single sort param value into sortBy and sortDir.
 * "name" = asc, "-name" = desc, null = no sort.
 */
function parseSortParam(value: string | null): { sortBy: string | null; sortDir: 'asc' | 'desc' } {
    if (!value) return { sortBy: null, sortDir: 'asc' };
    if (value.startsWith('-')) {
        return { sortBy: value.slice(1), sortDir: 'desc' };
    }
    return { sortBy: value, sortDir: 'asc' };
}

export function useSort(sortParam: string, pageParam: string): UseSortReturn {
    // Read fresh URL params on every render (Inertia re-renders after navigation)
    const url = typeof window !== 'undefined' ? window.location.search : '';
    const params = new URLSearchParams(url);
    const { sortBy, sortDir } = parseSortParam(params.get(sortParam));

    const onSort = useCallback(
        (sortKey: string) => {
            // Re-read current URL state at click time to avoid stale closures
            const currentParams = new URLSearchParams(window.location.search);
            const { sortBy: currentSortBy, sortDir: currentSortDir } = parseSortParam(currentParams.get(sortParam));

            if (currentSortBy === sortKey) {
                if (currentSortDir === 'asc') {
                    // asc -> desc
                    navigateWithParams({ [sortParam]: `-${sortKey}` }, pageParam);
                } else {
                    // desc -> clear
                    navigateWithParams({ [sortParam]: null }, pageParam);
                }
            } else {
                // New column -> asc
                navigateWithParams({ [sortParam]: sortKey }, pageParam);
            }
        },
        [sortParam, pageParam],
    );

    const getSortState = useCallback(
        (sortKey: string): SortState => ({
            active: sortBy === sortKey,
            direction: sortBy === sortKey ? sortDir : null,
        }),
        [sortBy, sortDir],
    );

    return { sortBy, sortDir, onSort, getSortState };
}
