import type { Row } from '@/types';

/**
 * Substitute :token params in route parameters with values from the row.
 * Example: { server: ':id' } with row.id = 5 becomes { server: '5' }
 */
export function resolveRouteParams(row: Row, params: Record<string, string>): Record<string, string | number> {
    const resolved: Record<string, string | number> = {};

    for (const [key, value] of Object.entries(params)) {
        if (value.startsWith(':')) {
            const field = value.slice(1);
            resolved[key] = row[field] as string | number;
        } else {
            resolved[key] = value;
        }
    }

    return resolved;
}

/**
 * Build an href from a route name and resolved params using Ziggy.
 */
export function buildHref(routeName: string, params: Record<string, string | number>): string {
    const routeFn = (window as unknown as { route?: (name: string, params?: Record<string, string | number>) => string }).route;

    if (typeof routeFn === 'function') {
        return routeFn(routeName, params);
    }

    console.warn(
        `[inertia-table-vue] Ziggy route() not found. Set 'use_ziggy' => false in config ` +
        `to resolve routes server-side, or install ziggy-js. Route: ${routeName}`
    );
    return '#';
}
