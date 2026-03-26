import { ref, watch, onUnmounted, type Ref } from 'vue';
import { navigateWithParams } from '@/utils/navigate';

interface UseSearchReturn {
    searchTerm: Ref<string>;
    onSearch: (term: string) => void;
    hasExternalSearch: boolean;
}

export function useSearch(
    debounceMs: number,
    searchParam: string,
    pageParam: string,
    searchRef?: Ref<HTMLInputElement | null>,
): UseSearchReturn {
    const searchTerm = ref(
        typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get(searchParam) ?? ''
            : '',
    );

    let timer: ReturnType<typeof setTimeout> | null = null;

    function onSearch(term: string) {
        searchTerm.value = term;

        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
            navigateWithParams(
                { [searchParam]: term || null },
                pageParam,
            );
        }, debounceMs);
    }

    onUnmounted(() => {
        if (timer) clearTimeout(timer);
    });

    if (searchRef) {
        watch(searchRef, (input, _, onCleanup) => {
            if (!input || typeof window === 'undefined') return;

            const params = new URLSearchParams(window.location.search);
            const currentSearch = params.get(searchParam) ?? '';
            if (input.value !== currentSearch) {
                input.value = currentSearch;
            }

            const handleInput = () => {
                onSearch(input.value);
            };

            input.addEventListener('input', handleInput);

            onCleanup(() => {
                input.removeEventListener('input', handleInput);
            });
        }, { immediate: true });
    }

    return { searchTerm, onSearch, hasExternalSearch: !!searchRef };
}
