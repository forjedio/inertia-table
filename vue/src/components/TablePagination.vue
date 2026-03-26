<template>
    <nav :class="classNames.pagination" aria-label="Table pagination">
        <span :class="classNames.paginationInfo">{{ infoText }}</span>

        <div class="flex items-center gap-2">
            <button
                v-if="links.first !== null"
                type="button"
                @click="onPageChange(1)"
                :disabled="!hasPrevious || isFetching"
                :class="classNames.paginationButton"
                aria-label="Go to first page"
            >
                First
            </button>

            <button
                type="button"
                @click="onPageChange(meta.current_page - 1)"
                :disabled="!hasPrevious || isFetching"
                :class="classNames.paginationButton"
                aria-label="Go to previous page"
            >
                Previous
            </button>

            <button
                type="button"
                @click="onPageChange(meta.current_page + 1)"
                :disabled="!hasNext || isFetching"
                :class="classNames.paginationButton"
                aria-label="Go to next page"
            >
                Next
            </button>

            <button
                v-if="links.last !== null && meta.last_page !== undefined"
                type="button"
                @click="onPageChange(meta.last_page!)"
                :disabled="!hasNext || isFetching"
                :class="classNames.paginationButton"
                aria-label="Go to last page"
            >
                Last
            </button>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PaginationLinks, PaginationMeta } from '@/types';

const props = defineProps<{
    links: PaginationLinks;
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
    isFetching?: boolean;
    classNames: {
        pagination: string;
        paginationButton: string;
        paginationInfo: string;
    };
}>();

const hasPrevious = computed(() => props.links.prev !== null);
const hasNext = computed(() => props.links.next !== null);

const infoText = computed(() => {
    const { from, to } = props.meta;
    if (from !== null && to !== null) {
        if (props.meta.total !== undefined) {
            return `Showing ${from} to ${to} of ${props.meta.total} results`;
        }
        return `Showing ${from} to ${to} results`;
    }
    return 'No results';
});
</script>
