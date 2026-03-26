<template>
    <span v-if="value == null" class="text-gray-400 dark:text-gray-500">{{ nullText ?? '-' }}</span>
    <span v-else>{{ String(value) }}</span>
</template>

<script setup lang="ts">
defineProps<{
    value: unknown;
    nullText?: string;
}>();
</script>
