<template>
    <div :class="wrapperClass">
        <!-- Toolbar -->
        <template v-if="showBuiltInSearch || slots['toolbar-actions']">
            <slot
                name="toolbar"
                :searchable="showBuiltInSearch"
                :searchTerm="searchTerm"
                :onSearch="onSearch"
            >
                <div :class="classNames.toolbar">
                    <template v-if="showBuiltInSearch">
                        <slot name="search" :searchTerm="searchTerm" :onSearch="onSearch" placeholder="Search...">
                            <TableSearch
                                :searchTerm="searchTerm"
                                :onSearch="onSearch"
                                :className="classNames.search"
                            />
                        </slot>
                    </template>
                    <slot name="toolbar-actions" />
                </div>
            </slot>
        </template>

        <!-- Table -->
        <div
            :class="['overflow-x-auto transition-opacity duration-150', busy ? 'opacity-50 pointer-events-none' : '']"
            :aria-busy="busy"
        >
            <table :class="classNames.table">
                <thead :class="classNames.thead">
                    <tr>
                        <th
                            v-for="col in builtColumns"
                            :key="col.id"
                            :class="[classNames.th, fitColumns.has(col.id) ? 'w-0 whitespace-nowrap' : '']"
                            :aria-sort="col.getAriaSort()"
                        >
                            <RenderVNode :render="col.renderHeader" />
                        </th>
                    </tr>
                </thead>

                <tbody :class="classNames.tbody">
                    <template v-if="hasData">
                        <template
                            v-for="(row, rowIndex) in tableData.data"
                            :key="row.id"
                        >
                            <slot name="row" :row="row" :rowIndex="rowIndex">
                                <tr
                                    :class="[
                                        classNames.tr,
                                        onRowClick ? classNames.trClickable : '',
                                        rowClassName?.(row, rowIndex) ?? '',
                                    ].filter(Boolean).join(' ')"
                                    v-bind="onRowClick ? {
                                        role: 'button',
                                        tabindex: 0,
                                        onClick: (e: MouseEvent) => handleRowClick(row, e),
                                        onKeydown: (e: KeyboardEvent) => handleRowKeydown(row, e),
                                    } : {}"
                                >
                                    <td
                                        v-for="col in builtColumns"
                                        :key="col.id"
                                        :class="[classNames.td, fitColumns.has(col.id) ? 'w-0 whitespace-nowrap' : '']"
                                    >
                                        <RenderVNode :render="() => col.renderCell(row, rowIndex)" />
                                    </td>
                                </tr>
                            </slot>
                        </template>
                    </template>

                    <template v-else>
                        <slot name="empty">
                            <TableEmpty
                                :colSpan="builtColumns.length"
                                :emptyText="emptyText"
                                :className="classNames.empty"
                            />
                        </slot>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <template v-if="hasData">
            <slot
                name="pagination"
                :links="tableData.links"
                :meta="tableData.meta"
                :onPageChange="onPageChange"
                :isFetching="busy"
            >
                <TablePagination
                    :links="tableData.links"
                    :meta="tableData.meta"
                    :onPageChange="onPageChange"
                    :isFetching="busy"
                    :classNames="{
                        pagination: classNames.pagination,
                        paginationButton: classNames.paginationButton,
                        paginationInfo: classNames.paginationInfo,
                    }"
                />
            </slot>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import type { InertiaTableProps, InertiaTableSlots, Row } from '@/types';
import { useTable } from '@/composables/useTable';
import TableSearch from './TableSearch.vue';
import TablePagination from './TablePagination.vue';
import TableEmpty from './TableEmpty.vue';
import RenderVNode from './RenderVNode';

const props = withDefaults(defineProps<InertiaTableProps>(), {
    isFetching: false,
});

defineSlots<InertiaTableSlots>();
const slots = useSlots();

const {
    columns,
    classNames,
    searchTerm,
    onSearch,
    hasExternalSearch,
    onPageChange,
    isProcessing,
} = useTable(props, slots as any);

const hasData = computed(() => props.tableData.data.length > 0);
const builtColumns = columns;
const busy = computed(() => props.isFetching || isProcessing.value);
const showBuiltInSearch = computed(() => props.tableData.searchable && !hasExternalSearch);

const fitColumns = computed(() => new Set(builtColumns.value.filter((c) => c.fit).map((c) => c.id)));

const wrapperClass = computed(() =>
    [
        props.modal ? '' : classNames.value.wrapper,
        props.className ?? '',
    ]
        .filter(Boolean)
        .join(' '),
);

function handleRowClick(row: Row, e: MouseEvent) {
    if (!props.onRowClick) return;
    const target = e.target as HTMLElement;
    if (target.closest('a, button, input, select, textarea, [role="button"]')) return;
    props.onRowClick(row);
}

function handleRowKeydown(row: Row, e: KeyboardEvent) {
    if (!props.onRowClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        props.onRowClick(row);
    }
}
</script>
