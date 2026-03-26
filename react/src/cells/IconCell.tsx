import React from 'react';
import { getIcon } from '@/registries/icon-registry';
import type { IconResolver } from '@/types';

interface IconCellProps {
    iconName: string;
    iconResolver?: IconResolver;
}

export function IconCell({ iconName, iconResolver }: IconCellProps) {
    const IconComponent = iconResolver?.(iconName) ?? getIcon(iconName);

    if (!IconComponent) {
        return null;
    }

    return <IconComponent className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
}
