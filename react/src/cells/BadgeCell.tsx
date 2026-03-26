import React from 'react';
import type { Row, IconResolver } from '@/types';
import { getIcon } from '@/registries/icon-registry';

const VARIANT_CLASSES: Record<string, string> = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    destructive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    outline: 'bg-transparent text-gray-700 border border-gray-300 dark:text-gray-300 dark:border-gray-600',
};

interface BadgeCellProps {
    value: unknown;
    variant?: string;
    colorField?: string;
    tooltipKey?: string;
    iconKey?: string;
    row: Row;
    nullText?: string;
    iconResolver?: IconResolver;
}

export function BadgeCell({ value, variant, colorField, tooltipKey, iconKey, row, nullText = '-', iconResolver }: BadgeCellProps) {
    if (value === null || value === undefined) {
        return <span className="text-gray-400 dark:text-gray-500">{nullText}</span>;
    }

    const resolvedVariant = colorField && row[colorField]
        ? String(row[colorField])
        : variant ?? 'default';

    const tooltip = tooltipKey ? (row[tooltipKey] as string | undefined) : undefined;
    const classes = VARIANT_CLASSES[resolvedVariant] ?? VARIANT_CLASSES.default;

    let IconComponent: React.ComponentType<{ className?: string }> | null = null;
    if (iconKey) {
        const iconName = row[iconKey] as string | undefined;
        if (iconName) {
            IconComponent = iconResolver?.(iconName) ?? getIcon(iconName) ?? null;
        }
    }

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}
            title={tooltip}
        >
            {IconComponent && <IconComponent className="h-3 w-3" />}
            {String(value)}
        </span>
    );
}
