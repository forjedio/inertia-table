import type { Component } from 'vue';

const registry = new Map<string, Component>();

export function registerIcon(name: string, component: Component): void {
    registry.set(name, component);
}

export function registerIcons(icons: Record<string, Component>): void {
    for (const [name, component] of Object.entries(icons)) {
        registry.set(name, component);
    }
}

export function getIcon(name: string): Component | undefined {
    return registry.get(name);
}
