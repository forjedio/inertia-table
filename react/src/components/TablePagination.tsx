import React from 'react';
import type { PaginationLinks, PaginationMeta } from '@/types';

interface TablePaginationProps {
    links: PaginationLinks;
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
    isFetching?: boolean;
    classNames: {
        pagination: string;
        paginationButton: string;
        paginationInfo: string;
    };
}

export function TablePagination({ links, meta, onPageChange, isFetching, classNames }: TablePaginationProps) {
    const hasPrevious = links.prev !== null;
    const hasNext = links.next !== null;

    // Build info text
    let infoText: string;
    if (meta.from !== null && meta.to !== null) {
        if (meta.total !== undefined) {
            infoText = `Showing ${meta.from} to ${meta.to} of ${meta.total} results`;
        } else {
            infoText = `Showing ${meta.from} to ${meta.to} results`;
        }
    } else {
        infoText = 'No results';
    }

    return (
        <nav className={classNames.pagination} aria-label="Table pagination">
            <span className={classNames.paginationInfo}>{infoText}</span>

            <div className="flex items-center gap-2">
                {links.first !== null && (
                    <button
                        type="button"
                        onClick={() => onPageChange(1)}
                        disabled={!hasPrevious || isFetching}
                        className={classNames.paginationButton}
                        aria-label="Go to first page"
                    >
                        First
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => onPageChange(meta.current_page - 1)}
                    disabled={!hasPrevious || isFetching}
                    className={classNames.paginationButton}
                    aria-label="Go to previous page"
                >
                    Previous
                </button>

                <button
                    type="button"
                    onClick={() => onPageChange(meta.current_page + 1)}
                    disabled={!hasNext || isFetching}
                    className={classNames.paginationButton}
                    aria-label="Go to next page"
                >
                    Next
                </button>

                {links.last !== null && meta.last_page !== undefined && (
                    <button
                        type="button"
                        onClick={() => onPageChange(meta.last_page!)}
                        disabled={!hasNext || isFetching}
                        className={classNames.paginationButton}
                        aria-label="Go to last page"
                    >
                        Last
                    </button>
                )}
            </div>
        </nav>
    );
}
