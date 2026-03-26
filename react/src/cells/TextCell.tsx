import React from 'react';

interface TextCellProps {
    value: unknown;
    nullText?: string;
}

export function TextCell({ value, nullText = '-' }: TextCellProps) {
    if (value === null || value === undefined) {
        return <span className="text-gray-400 dark:text-gray-500">{nullText}</span>;
    }

    return <span>{String(value)}</span>;
}
