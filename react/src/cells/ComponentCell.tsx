import React from 'react';
import type { Row } from '@/types';
import { getCellComponent } from '@/registries/component-registry';

interface ComponentCellProps {
    componentName: string;
    row: Row;
    columnName: string;
}

export function ComponentCell({ componentName, row, columnName }: ComponentCellProps) {
    const Component = getCellComponent(componentName);

    if (!Component) {
        return null;
    }

    return <Component row={row} value={row[columnName]} column={columnName} />;
}
