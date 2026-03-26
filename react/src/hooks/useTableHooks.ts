import { useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import type { InertiaTableData, TableHookCallback, TableHookContext } from '@/types';

const hookRegistry = new Map<string, TableHookCallback[]>();

/**
 * Register a hook that runs when any InertiaTable mounts with a matching
 * tableSettings key.
 *
 * Multiple hooks can be registered for the same key — all will run.
 * Call this at application boot, before creating the Inertia app.
 */
export function registerTableHook(key: string, callback: TableHookCallback): void {
    if (!hookRegistry.has(key)) {
        hookRegistry.set(key, []);
    }
    hookRegistry.get(key)!.push(callback);
}

/**
 * Remove all hooks registered for a key. If no key is provided, clears all hooks.
 * Useful in tests.
 */
export function clearTableHooks(key?: string): void {
    if (key) {
        hookRegistry.delete(key);
    } else {
        hookRegistry.clear();
    }
}

/**
 * Internal hook called by InertiaTable on mount.
 * Iterates tableSettings and calls any registered hooks.
 */
export function useTableHooks(tableData: InertiaTableData): void {
    const settingsRef = useRef<string>('');

    useEffect(() => {
        const settingsJson = JSON.stringify(tableData.tableSettings);

        // Skip if settings haven't changed
        if (settingsRef.current === settingsJson) return;
        settingsRef.current = settingsJson;

        const cleanups: (() => void)[] = [];

        const refresh = () => {
            router.reload();
        };

        for (const [key, value] of Object.entries(tableData.tableSettings)) {
            const hooks = hookRegistry.get(key) ?? [];

            for (const hook of hooks) {
                const context: TableHookContext = {
                    value,
                    tableData,
                    refresh,
                };

                const cleanup = hook(context);

                if (typeof cleanup === 'function') {
                    cleanups.push(cleanup);
                }
            }
        }

        return () => {
            cleanups.forEach((fn) => fn());
        };
    }, [tableData]);
}
