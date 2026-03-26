import React from 'react';
import { Link } from '@inertiajs/react';
import type { Row } from '@/types';
import { resolveRouteParams, buildHref } from '@/utils/resolve-route-params';

interface LinkCellProps {
    value: unknown;
    route?: string;
    params?: Record<string, string>;
    resolvedHref?: string;
    row: Row;
    prefetch?: boolean;
    nullText?: string;
}

export function LinkCell({ value, route: routeName, params, resolvedHref, row, prefetch = true, nullText = '-' }: LinkCellProps) {
    if (value === null || value === undefined) {
        return <span className="text-gray-400 dark:text-gray-500">{nullText}</span>;
    }

    const href = resolvedHref
        ?? (routeName && params ? buildHref(routeName, resolveRouteParams(row, params)) : null);

    if (!href) {
        return <span className="text-gray-400 dark:text-gray-500">{String(value)}</span>;
    }

    return (
        <Link
            href={href}
            prefetch={prefetch ? 'hover' : undefined}
            className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
        >
            {String(value)}
        </Link>
    );
}
