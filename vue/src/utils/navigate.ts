import { router } from '@inertiajs/vue3';

/**
 * Navigate with updated URL parameters, preserving all existing params.
 * Used internally by useSearch, useSort, and usePagination.
 */
export function navigateWithParams(
    updates: Record<string, string | null>,
    pageParam: string = 'page',
): void {
    const url = new URL(window.location.href);

    for (const [key, value] of Object.entries(updates)) {
        if (value === null) {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, value);
        }
    }

    const isPageChange = pageParam in updates;
    if (!isPageChange) {
        url.searchParams.delete(pageParam);
    }

    router.get(url.toString(), {}, { preserveState: true, preserveScroll: true });
}
