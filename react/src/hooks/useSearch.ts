import { useState, useRef, useCallback, useEffect, type RefObject } from 'react';
import { navigateWithParams } from '@/utils/navigate';

interface UseSearchReturn {
    searchTerm: string;
    onSearch: (term: string) => void;
    hasExternalSearch: boolean;
}

export function useSearch(
    debounceMs: number,
    searchParam: string,
    pageParam: string,
    searchRef?: RefObject<HTMLInputElement | null>,
): UseSearchReturn {
    const [searchTerm, setSearchTerm] = useState(() => {
        if (typeof window === 'undefined') return '';
        const params = new URLSearchParams(window.location.search);
        return params.get(searchParam) ?? '';
    });

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const onSearch = useCallback(
        (term: string) => {
            setSearchTerm(term);

            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            timerRef.current = setTimeout(() => {
                navigateWithParams(
                    { [searchParam]: term || null },
                    pageParam,
                );
            }, debounceMs);
        },
        [debounceMs, searchParam, pageParam],
    );

    // Clear debounce timer on unmount to prevent stale navigation
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    // Watch external search ref for input events
    useEffect(() => {
        if (!searchRef?.current) return;

        const input = searchRef.current;
        if (typeof window === 'undefined') return;

        // Sync current URL search value into the external input (handles back/forward)
        const params = new URLSearchParams(window.location.search);
        const currentSearch = params.get(searchParam) ?? '';
        if (input.value !== currentSearch) {
            input.value = currentSearch;
        }

        const handleInput = () => {
            onSearch(input.value);
        };

        input.addEventListener('input', handleInput);

        return () => {
            input.removeEventListener('input', handleInput);
        };
    }, [searchRef, searchParam, onSearch]);

    return { searchTerm, onSearch, hasExternalSearch: !!searchRef };
}
