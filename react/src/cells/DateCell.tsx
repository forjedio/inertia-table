import React from 'react';

interface DateCellProps {
    formattedValue: string | null;
    rawValue?: string | null;
    local?: boolean;
    includeTime?: boolean;
}

export function DateCell({ formattedValue, rawValue, local, includeTime }: DateCellProps) {
    if (formattedValue === null || formattedValue === undefined) {
        return <span className="text-gray-400 dark:text-gray-500">-</span>;
    }

    let displayText = formattedValue;

    if (local && rawValue) {
        try {
            const date = new Date(rawValue);
            displayText = includeTime
                ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
                : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date);
        } catch {
            displayText = formattedValue;
        }
    }

    return (
        <time dateTime={rawValue ?? undefined} className="text-sm text-gray-600 dark:text-gray-400">
            {displayText}
        </time>
    );
}
