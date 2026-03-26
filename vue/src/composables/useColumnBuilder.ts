import { computed, h, type Slots, type ComputedRef } from 'vue';
import type {
    Row,
    BuiltColumn,
    InertiaTableData,
    CellDisplay,
    CellRenderProps,
    HeaderRenderProps,
    ClassNames,
    IconResolver,
} from '@/types';
import { resolveValue } from '@/utils/resolve-value';
import TextCell from '@/cells/TextCell.vue';
import BadgeCell from '@/cells/BadgeCell.vue';
import DateCell from '@/cells/DateCell.vue';
import LinkCell from '@/cells/LinkCell.vue';
import CopyableCell from '@/cells/CopyableCell.vue';
import IconCell from '@/cells/IconCell.vue';
import ComponentCell from '@/cells/ComponentCell.vue';

interface UseColumnBuilderOptions {
    tableData: InertiaTableData;
    slots: Slots;
    onSort: (sortKey: string) => void;
    getSortState: (sortKey: string) => { active: boolean; direction: 'asc' | 'desc' | null };
    nullText: string;
    classNames: ComputedRef<ClassNames>;
    iconResolver?: IconResolver;
}

export function useColumnBuilder(options: UseColumnBuilderOptions) {
    const { tableData, slots, onSort, getSortState, nullText, classNames, iconResolver } = options;

    return computed<BuiltColumn[]>(() => {
        const columns: BuiltColumn[] = [];

        for (const col of tableData.columns) {
            if (col.hidden) continue;

            columns.push({
                id: col.name,
                fit: col.fit ?? false,
                sortable: col.sortable,
                getAriaSort: () => {
                    if (!col.sortable) return undefined;
                    const state = getSortState(col.sort_key);
                    if (!state.active) return 'none';
                    return state.direction === 'asc' ? 'ascending' : 'descending';
                },
                renderHeader: () => {
                    const sortState = getSortState(col.sort_key);
                    const headerProps: HeaderRenderProps = {
                        column: col,
                        sortState,
                        onSort,
                        index: columns.length,
                    };

                    const headerSlot = slots[`header-${col.name}`];
                    if (headerSlot) return headerSlot(headerProps) as any;
                    if (slots.header) return slots.header(headerProps) as any;

                    let sortIndicator = null;
                    if (col.sortable) {
                        if (sortState.active) {
                            sortIndicator = h(
                                'svg',
                                { class: 'ml-1 h-3.5 w-3.5 inline-block', viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
                                [h('path', { d: sortState.direction === 'asc' ? 'M4 10l4-4 4 4' : 'M4 6l4 4 4-4' })],
                            );
                        } else {
                            sortIndicator = h(
                                'span',
                                { class: 'ml-1 inline-block text-gray-300 dark:text-gray-600' },
                                '\u21C5',
                            );
                        }
                    }

                    return h(
                        'div',
                        {
                            class: [
                                'flex items-center gap-1 -m-4 p-4',
                                col.sortable ? classNames.value.thSortable : '',
                                sortState.active ? classNames.value.thSorted : '',
                            ].filter(Boolean).join(' '),
                            onClick: col.sortable ? () => onSort(col.sort_key) : undefined,
                        },
                        [col.header, sortIndicator],
                    );
                },
                renderCell: (row: Row, rowIndex: number) => {
                    if (col.displays.length === 1 && col.displays[0].type === 'actions') {
                        return slots.actions?.({ row }) as any ?? null;
                    }

                    const value = row[col.name];
                    const cellProps: CellRenderProps = {
                        row, value, column: col, displays: col.displays, rowIndex,
                    };

                    const cellSlot = slots[`cell-${col.name}`];
                    if (cellSlot) return cellSlot(cellProps) as any;

                    if (slots.cell) {
                        const defaultRender = () => renderDisplays(col.displays, row, col.name, nullText, iconResolver);
                        return slots.cell({ ...cellProps, defaultRender }) as any;
                    }

                    return renderDisplays(col.displays, row, col.name, nullText, iconResolver);
                },
            });
        }

        if (slots.actions) {
            const hasActionsColumn = tableData.columns.some(
                (c) => c.displays.length === 1 && c.displays[0].type === 'actions',
            );
            if (!hasActionsColumn) {
                columns.push({
                    id: '_actions',
                    fit: true,
                    sortable: false,
                    getAriaSort: () => undefined,
                    renderHeader: () => null,
                    renderCell: (row: Row) => slots.actions!({ row }) as any,
                });
            }
        }

        return columns;
    });
}

/** Render a cell's display pipeline */
function renderDisplays(
    displays: CellDisplay[],
    row: Row,
    columnName: string,
    nullText: string,
    iconResolver?: IconResolver,
) {
    if (!displays || displays.length === 0) {
        return h(TextCell, { value: row[columnName], nullText });
    }

    if (displays.length === 1 && displays[0].type === 'component') {
        const display = displays[0] as { type: 'component'; component: string };
        return h(ComponentCell, { componentName: display.component, row, columnName });
    }

    const elements = displays.map((display, i) => {
        const value = resolveValue(row, display, columnName);

        switch (display.type) {
            case 'text':
                return h(TextCell, { key: i, value, nullText });
            case 'badge':
                return h(BadgeCell, {
                    key: i, value, variant: display.variant_key ? String(row[display.variant_key] ?? '') : display.variant,
                    colorField: display.color_field, tooltipKey: display.tooltip_key,
                    iconKey: display.icon_key, row, nullText, iconResolver,
                });
            case 'date':
                return h(DateCell, {
                    key: i,
                    formattedValue: display.formatted_key ? String(row[display.formatted_key] ?? '') : String(value ?? ''),
                    rawValue: display.raw_key ? String(row[display.raw_key] ?? '') : null,
                    local: display.local ?? false,
                    includeTime: display.includeTime ?? false,
                });
            case 'link': {
                const hrefValue = display.href_key ? row[display.href_key] : undefined;
                return h(LinkCell, {
                    key: i, value,
                    route: display.route, params: display.params,
                    resolvedHref: hrefValue != null ? String(hrefValue) : undefined,
                    row, prefetch: display.prefetch, nullText,
                });
            }
            case 'copyable':
                return h(CopyableCell, { key: i, value, nullText });
            case 'icon':
                return h(IconCell, { key: i, iconName: String(value ?? ''), iconResolver });
            case 'component':
                return h(ComponentCell, {
                    key: i, componentName: (display as { component: string }).component, row, columnName,
                });
            default:
                return null;
        }
    });

    if (elements.length > 1) {
        return h('div', { class: 'flex items-center gap-2' }, elements);
    }

    return elements[0] ?? null;
}
