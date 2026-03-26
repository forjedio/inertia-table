import { useCallback } from 'react';
import { navigateWithParams } from '@/utils/navigate';

interface UsePaginationReturn {
    onPageChange: (page: number) => void;
}

export function usePagination(pageParam: string): UsePaginationReturn {
    const onPageChange = useCallback(
        (page: number) => {
            navigateWithParams({ [pageParam]: String(page) }, pageParam);
        },
        [pageParam],
    );

    return { onPageChange };
}
