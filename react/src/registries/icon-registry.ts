import type { ComponentType } from 'react';

const registry = new Map<string, ComponentType<{ className?: string }>>();

/** Register a single icon component by name. */
export function registerIcon(name: string, component: ComponentType<{ className?: string }>): void {
    registry.set(name, component);
}

/** Bulk register icon components. */
export function registerIcons(icons: Record<string, ComponentType<{ className?: string }>>): void {
    for (const [name, component] of Object.entries(icons)) {
        registry.set(name, component);
    }
}

/** Look up a registered icon component by name. */
export function getIcon(name: string): ComponentType<{ className?: string }> | undefined {
    return registry.get(name);
}
