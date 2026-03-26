import React from 'react';

interface TableEmptyProps {
    colSpan: number;
    emptyText?: string;
    className?: string;
}

export function TableEmpty({ colSpan, emptyText = 'No results found.', className = '' }: TableEmptyProps) {
    return (
        <tr>
            <td colSpan={colSpan} className={className}>
                {emptyText}
            </td>
        </tr>
    );
}
