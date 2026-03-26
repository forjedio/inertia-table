import { navigateWithParams } from '@/utils/navigate';

export function usePagination(pageParam: string) {
    function onPageChange(page: number) {
        navigateWithParams({ [pageParam]: String(page) }, pageParam);
    }

    return { onPageChange };
}
