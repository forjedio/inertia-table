export { default as InertiaTable } from './components/InertiaTable.vue';
export type {
    CellDisplay,
    DynamicColumnDef,
    Row,
    PaginationLinks,
    PaginationMeta,
    InertiaTableData,
    InertiaTableProps,
    InertiaTableSlots,
    TableHookContext,
    TableHookCallback,
    ClassNames,
    SortState,
    CellRenderProps,
    HeaderRenderProps,
    SearchRenderProps,
    PaginationRenderProps,
    BuiltColumn,
    CellComponentProps,
    IconResolver,
} from './types';
export { registerCellComponent } from './registries/component-registry';
export { registerIcon, registerIcons } from './registries/icon-registry';
export { registerTableHook, clearTableHooks } from './composables/useTableHooks';
export { useTable } from './composables/useTable';
