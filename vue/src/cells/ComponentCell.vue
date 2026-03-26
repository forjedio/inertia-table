<template>
    <component v-if="CellComp" :is="CellComp" :row="row" :value="row[columnName]" :column="columnName" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Row } from '@/types';
import { getCellComponent } from '@/registries/component-registry';

const props = defineProps<{
    componentName: string;
    row: Row;
    columnName: string;
}>();

const CellComp = computed(() => getCellComponent(props.componentName));
</script>
