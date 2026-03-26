<template>
    <span v-if="value == null" class="text-gray-400 dark:text-gray-500">{{ nullText ?? '-' }}</span>
    <span v-else-if="!href" class="text-gray-400 dark:text-gray-500">{{ String(value) }}</span>
    <Link
        v-else
        :href="href"
        :prefetch="prefetch !== false ? 'hover' : undefined"
        class="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
    >
        {{ String(value) }}
    </Link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import type { Row } from '@/types';
import { resolveRouteParams, buildHref } from '@/utils/resolve-route-params';

const props = defineProps<{
    value: unknown;
    route?: string;
    params?: Record<string, string>;
    resolvedHref?: string;
    row: Row;
    prefetch?: boolean;
    nullText?: string;
}>();

const href = computed(() => {
    if (props.resolvedHref) return props.resolvedHref;
    if (props.route && props.params) {
        const resolvedParams = resolveRouteParams(props.row, props.params);
        return buildHref(props.route, resolvedParams);
    }
    return null;
});
</script>
