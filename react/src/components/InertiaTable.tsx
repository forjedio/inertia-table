import React from 'react';
import { flexRender } from '@tanstack/react-table';
import type { InertiaTableProps, Row } from '@/types';
import { useTable } from '@/hooks/useTable';
import { TableSearch } from './TableSearch';
import { TablePagination } from './TablePagination';
import { TableEmpty } from './TableEmpty';

export function InertiaTable(props: InertiaTableProps) {
    const {
        tableData,
        className,
        modal,
        onRowClick,
        rowClassName,
        isFetching = false,
        emptyText,
        renderToolbar,
        renderToolbarActions,
        renderSearch,
        renderPagination,
        renderEmpty,
        renderRow,
    } = props;

    const {
        table,
        columns,
        classNames,
        searchTerm,
        onSearch,
        hasExternalSearch,
        onPageChange,
        isProcessing,
    } = useTable(props);

    const hasData = tableData.data.length > 0;
    const showBuiltInSearch = tableData.searchable && !hasExternalSearch;
    const busy = isFetching || isProcessing;

    const handleRowClick = onRowClick
        ? (row: Row, e: React.MouseEvent) => {
            // Don't trigger row click when clicking interactive elements inside the row
            const target = e.target as HTMLElement;
            if (target.closest('a, button, input, select, textarea, [role="button"]')) return;
            onRowClick(row);
        }
        : undefined;

    // Build a set of column IDs that should fit-to-content
    const fitColumns = new Set(columns.filter((c) => c.fit).map((c) => c.id));
    const visibleColumns = table.getAllColumns().length;

    const wrapperClass = [
        modal ? '' : classNames.wrapper,
        className ?? '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={wrapperClass}>
            {/* Toolbar */}
            {(showBuiltInSearch || renderToolbarActions) && (
                renderToolbar ? (
                    renderToolbar({
                        searchable: showBuiltInSearch,
                        searchTerm,
                        onSearch,
                        children: renderToolbarActions?.() ?? null,
                    })
                ) : (
                    <div className={classNames.toolbar}>
                        {showBuiltInSearch && (
                            renderSearch ? (
                                renderSearch({ searchTerm, onSearch, placeholder: 'Search...' })
                            ) : (
                                <TableSearch
                                    searchTerm={searchTerm}
                                    onSearch={onSearch}
                                    className={classNames.search}
                                />
                            )
                        )}
                        {renderToolbarActions?.()}
                    </div>
                )
            )}

            {/* Table */}
            <div className={`overflow-x-auto transition-opacity duration-150${busy ? ' opacity-50 pointer-events-none' : ''}`} aria-busy={busy}>
                <table className={classNames.table}>
                    <thead className={classNames.thead}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const builtCol = columns.find((c) => c.id === header.column.id);
                                    const ariaSort = builtCol?.getAriaSort();
                                    return (
                                        <th
                                            key={header.id}
                                            className={`${classNames.th}${fitColumns.has(header.column.id) ? ' w-0 whitespace-nowrap' : ''}`}
                                            aria-sort={ariaSort}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>

                    <tbody className={classNames.tbody}>
                        {hasData ? (
                            table.getRowModel().rows.map((row, rowIndex) => {
                                const rowClasses = [
                                    classNames.tr,
                                    onRowClick ? classNames.trClickable : '',
                                    rowClassName?.(row.original, rowIndex) ?? '',
                                ]
                                    .filter(Boolean)
                                    .join(' ');

                                const interactiveProps = handleRowClick ? {
                                    role: 'button' as const,
                                    tabIndex: 0,
                                    onClick: (e: React.MouseEvent) => handleRowClick(row.original, e),
                                    onKeyDown: (e: React.KeyboardEvent) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            onRowClick!(row.original);
                                        }
                                    },
                                } : {};

                                const cells = row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className={`${classNames.td}${fitColumns.has(cell.column.id) ? ' w-0 whitespace-nowrap' : ''}`}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ));

                                if (renderRow) {
                                    return (
                                        <React.Fragment key={row.id}>
                                            {renderRow({
                                                row: row.original,
                                                children: (
                                                    <tr className={rowClasses} {...interactiveProps}>
                                                        {cells}
                                                    </tr>
                                                ),
                                                rowIndex,
                                            })}
                                        </React.Fragment>
                                    );
                                }

                                return (
                                    <tr key={row.id} className={rowClasses} {...interactiveProps}>
                                        {cells}
                                    </tr>
                                );
                            })
                        ) : (
                            renderEmpty ? (
                                <tr>
                                    <td colSpan={visibleColumns}>
                                        {renderEmpty()}
                                    </td>
                                </tr>
                            ) : (
                                <TableEmpty
                                    colSpan={visibleColumns}
                                    emptyText={emptyText}
                                    className={classNames.empty}
                                />
                            )
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {hasData && (
                renderPagination ? (
                    renderPagination({
                        links: tableData.links,
                        meta: tableData.meta,
                        onPageChange,
                        isFetching: busy,
                    })
                ) : (
                    <TablePagination
                        links={tableData.links}
                        meta={tableData.meta}
                        onPageChange={onPageChange}
                        isFetching={busy}
                        classNames={{
                            pagination: classNames.pagination,
                            paginationButton: classNames.paginationButton,
                            paginationInfo: classNames.paginationInfo,
                        }}
                    />
                )
            )}
        </div>
    );
}
