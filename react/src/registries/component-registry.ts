import type { ComponentType } from 'react';
import type { CellComponentProps } from '@/types';

const registry = new Map<string, ComponentType<CellComponentProps>>();

/** Register a named component for use with Column::component('name'). */
export function registerCellComponent(name: string, component: ComponentType<CellComponentProps>): void {
    registry.set(name, component);
}

/** Look up a registered cell component by name. */
export function getCellComponent(name: string): ComponentType<CellComponentProps> | undefined {
    return registry.get(name);
}
