import type { SortState } from '@/types';
import { navigateWithParams } from '@/utils/navigate';

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

export function useSort(sortParam: string, pageParam: string) {
    const url = typeof window !== 'undefined' ? window.location.search : '';
    const params = new URLSearchParams(url);
    const { sortBy, sortDir } = parseSortParam(params.get(sortParam));

    function onSort(sortKey: string) {
        const currentParams = new URLSearchParams(window.location.search);
        const { sortBy: currentSortBy, sortDir: currentSortDir } = parseSortParam(currentParams.get(sortParam));

        if (currentSortBy === sortKey) {
            if (currentSortDir === 'asc') {
                navigateWithParams({ [sortParam]: `-${sortKey}` }, pageParam);
            } else {
                navigateWithParams({ [sortParam]: null }, pageParam);
            }
        } else {
            navigateWithParams({ [sortParam]: sortKey }, pageParam);
        }
    }

    function getSortState(sortKey: string): SortState {
        return {
            active: sortBy === sortKey,
            direction: sortBy === sortKey ? sortDir : null,
        };
    }

    return { sortBy, sortDir, onSort, getSortState };
}
