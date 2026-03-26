import { useMemo, useRef } from 'react';
import type {
    Row,
    BuiltColumn,
    InertiaTableData,
    CellDisplay,
    CellRenderProps,
    HeaderRenderProps,
    ClassNames,
    InertiaTableProps,
    IconResolver,
} from '@/types';
import { resolveValue } from '@/utils/resolve-value';
import { TextCell } from '@/cells/TextCell';
import { BadgeCell } from '@/cells/BadgeCell';
import { DateCell } from '@/cells/DateCell';
import { LinkCell } from '@/cells/LinkCell';
import { CopyableCell } from '@/cells/CopyableCell';
import { IconCell } from '@/cells/IconCell';
import { ComponentCell } from '@/cells/ComponentCell';
import React from 'react';

interface UseColumnBuilderOptions {
    tableData: InertiaTableData;
    cellRenderers?: InertiaTableProps['cellRenderers'];
    headerRenderers?: InertiaTableProps['headerRenderers'];
    actions?: InertiaTableProps['actions'];
    renderCell?: InertiaTableProps['renderCell'];
    renderHeader?: InertiaTableProps['renderHeader'];
    onSort: (sortKey: string) => void;
    getSortState: (sortKey: string) => { active: boolean; direction: 'asc' | 'desc' | null };
    nullText: string;
    classNames: ClassNames;
    iconResolver?: IconResolver;
}

export function useColumnBuilder(options: UseColumnBuilderOptions): BuiltColumn[] {
    const {
        tableData,
        cellRenderers,
        headerRenderers,
        renderCell,
        renderHeader,
        onSort,
        getSortState,
        nullText,
        classNames,
        iconResolver,
    } = options;

    // Stabilise refs to prevent column rebuild on every render (PRF-02)
    // Columns are memoised, so callbacks inside them must read from refs
    const actionsRef = useRef(options.actions);
    actionsRef.current = options.actions;

    const getSortStateRef = useRef(getSortState);
    getSortStateRef.current = getSortState;

    const onSortRef = useRef(onSort);
    onSortRef.current = onSort;

    const columnsKey = JSON.stringify(tableData.columns);

    return useMemo(() => {
        const columns: BuiltColumn[] = [];

        for (const col of tableData.columns) {
            if (col.hidden) continue;

            columns.push({
                id: col.name,
                fit: col.fit ?? false,
                sortable: col.sortable,
                getAriaSort: () => {
                    if (!col.sortable) return undefined;
                    const state = getSortStateRef.current(col.sort_key);
                    if (!state.active) return 'none';
                    return state.direction === 'asc' ? 'ascending' : 'descending';
                },
                renderHeader: () => {
                    const sortState = getSortStateRef.current(col.sort_key);
                    const currentOnSort = onSortRef.current;
                    const headerProps: HeaderRenderProps = {
                        column: col,
                        sortState,
                        onSort: currentOnSort,
                        index: columns.length,
                    };

                    if (headerRenderers?.[col.name]) {
                        return headerRenderers[col.name](headerProps);
                    }

                    if (renderHeader) {
                        return renderHeader(headerProps);
                    }

                    // Sort indicator: chevron up/down when active, up-down arrows when inactive
                    let sortIndicator: React.ReactNode = null;
                    if (col.sortable) {
                        if (sortState.active) {
                            sortIndicator = React.createElement(
                                'svg',
                                { className: 'ml-1 h-3.5 w-3.5 inline-block', viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
                                React.createElement('path', { d: sortState.direction === 'asc' ? 'M4 10l4-4 4 4' : 'M4 6l4 4 4-4' }),
                            );
                        } else {
                            sortIndicator = React.createElement(
                                'span',
                                { className: 'ml-1 inline-block text-gray-300 dark:text-gray-600' },
                                '\u21C5',
                            );
                        }
                    }

                    return React.createElement(
                        'div',
                        {
                            className: [
                                'flex items-center gap-1 -m-4 p-4',
                                col.sortable ? classNames.thSortable : '',
                                sortState.active ? classNames.thSorted : '',
                            ]
                                .filter(Boolean)
                                .join(' '),
                            onClick: col.sortable ? () => currentOnSort(col.sort_key) : undefined,
                        },
                        col.header,
                        sortIndicator,
                    );
                },
                renderCell: (row: Row, rowIndex: number) => {
                    // Actions display type — render the actions prop
                    if (col.displays.length === 1 && col.displays[0].type === 'actions') {
                        return actionsRef.current?.(row) ?? null;
                    }

                    const value = row[col.name];
                    const cellProps: CellRenderProps = {
                        row,
                        value,
                        column: col,
                        displays: col.displays,
                        rowIndex,
                    };

                    if (cellRenderers?.[col.name]) {
                        return cellRenderers[col.name](cellProps);
                    }

                    const defaultRender = () => renderDisplays(col.displays, row, col.name, nullText, iconResolver);

                    if (renderCell) {
                        return renderCell({ ...cellProps, defaultRender });
                    }

                    return defaultRender();
                },
            });
        }

        // If actions prop provided but no ActionsColumn defined in PHP, append one
        if (actionsRef.current) {
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
                    renderCell: (row: Row) => actionsRef.current?.(row) ?? null,
                });
            }
        }

        return columns;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnsKey, cellRenderers, headerRenderers, renderCell, renderHeader, nullText, classNames, iconResolver]);
}

/** Render a cell's display pipeline */
function renderDisplays(
    displays: CellDisplay[],
    row: Row,
    columnName: string,
    nullText: string,
    iconResolver?: IconResolver,
): React.ReactNode {
    if (!displays || displays.length === 0) {
        return React.createElement(TextCell, { value: row[columnName], nullText });
    }

    if (displays.length === 1 && displays[0].type === 'component') {
        const display = displays[0] as { type: 'component'; component: string };
        return React.createElement(ComponentCell, { componentName: display.component, row, columnName });
    }

    const elements = displays.map((display, i) => {
        const value = resolveValue(row, display, columnName);

        switch (display.type) {
            case 'text':
                return React.createElement(TextCell, { key: i, value, nullText });
            case 'badge':
                return React.createElement(BadgeCell, {
                    key: i, value, variant: display.variant,
                    colorField: display.color_field, tooltipKey: display.tooltip_key,
                    iconKey: display.icon_key, row, nullText, iconResolver,
                });
            case 'date':
                return React.createElement(DateCell, {
                    key: i,
                    formattedValue: display.formatted_key ? row[display.formatted_key] as string : value as string,
                    rawValue: display.raw_key ? row[display.raw_key] as string : null,
                    local: display.local ?? false,
                    includeTime: display.includeTime ?? false,
                });
            case 'link': {
                const hrefValue = display.href_key ? row[display.href_key] : undefined;
                return React.createElement(LinkCell, {
                    key: i, value, route: display.route, params: display.params,
                    resolvedHref: hrefValue != null ? String(hrefValue) : undefined,
                    row, prefetch: display.prefetch, nullText,
                });
            }
            case 'copyable':
                return React.createElement(CopyableCell, { key: i, value, nullText });
            case 'icon':
                return React.createElement(IconCell, { key: i, iconName: String(value ?? ''), iconResolver });
            case 'component':
                return React.createElement(ComponentCell, {
                    key: i, componentName: (display as { component: string }).component, row, columnName,
                });
            default:
                return null;
        }
    });

    if (elements.length > 1) {
        return React.createElement('div', { className: 'flex items-center gap-2' }, ...elements);
    }

    return elements[0] ?? null;
}
