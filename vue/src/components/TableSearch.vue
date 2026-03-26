<template>
    <div class="relative">
        <svg
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
        </svg>
        <input
            type="text"
            :value="searchTerm"
            @input="onSearch(($event.target as HTMLInputElement).value)"
            :placeholder="placeholder ?? 'Search...'"
            :class="`pl-9 ${className ?? ''}`"
            aria-label="Search table"
        />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    searchTerm: string;
    onSearch: (term: string) => void;
    placeholder?: string;
    className?: string;
}>();
</script>
