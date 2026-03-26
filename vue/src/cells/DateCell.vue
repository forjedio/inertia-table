<template>
    <span v-if="formattedValue == null" class="text-gray-400 dark:text-gray-500">-</span>
    <time v-else :datetime="rawValue ?? undefined" class="text-sm text-gray-600 dark:text-gray-400">
        {{ displayValue }}
    </time>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    formattedValue: string | null;
    rawValue?: string | null;
    local?: boolean;
    includeTime?: boolean;
}>();

const displayValue = computed(() => {
    if (props.formattedValue == null) return null;

    if (props.local && props.rawValue) {
        try {
            const date = new Date(props.rawValue);
            const options: Intl.DateTimeFormatOptions = props.includeTime
                ? { dateStyle: 'medium', timeStyle: 'short' }
                : { dateStyle: 'medium' };
            return new Intl.DateTimeFormat(undefined, options).format(date);
        } catch {
            return props.formattedValue;
        }
    }

    return props.formattedValue;
});
</script>
