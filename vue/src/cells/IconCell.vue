<template>
    <component v-if="IconComponent" :is="IconComponent" class="h-4 w-4 text-gray-500 dark:text-gray-400" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { IconResolver } from '@/types';
import { getIcon } from '@/registries/icon-registry';

const props = defineProps<{
    iconName: string;
    iconResolver?: IconResolver;
}>();

const IconComponent = computed(() => props.iconResolver?.(props.iconName) ?? getIcon(props.iconName));
</script>
