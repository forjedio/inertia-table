import type { Component } from 'vue';

const registry = new Map<string, Component>();

export function registerCellComponent(name: string, component: Component): void {
    registry.set(name, component);
}

export function getCellComponent(name: string): Component | undefined {
    return registry.get(name);
}
