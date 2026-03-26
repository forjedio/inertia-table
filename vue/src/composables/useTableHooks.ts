import { watch, onUnmounted } from 'vue';
import { router } from '@inertiajs/vue3';
import type { InertiaTableData, TableHookCallback, TableHookContext } from '@/types';

const hookRegistry = new Map<string, TableHookCallback[]>();

export function registerTableHook(key: string, callback: TableHookCallback): void {
    if (!hookRegistry.has(key)) {
        hookRegistry.set(key, []);
    }
    hookRegistry.get(key)!.push(callback);
}

export function clearTableHooks(key?: string): void {
    if (key) {
        hookRegistry.delete(key);
    } else {
        hookRegistry.clear();
    }
}

export function useTableHooks(tableData: InertiaTableData): void {
    let lastSettingsJson = '';
    const cleanups: (() => void)[] = [];

    function runHooks() {
        const settingsJson = JSON.stringify(tableData.tableSettings);
        if (lastSettingsJson === settingsJson) return;
        lastSettingsJson = settingsJson;

        cleanups.forEach((fn) => fn());
        cleanups.length = 0;

        const refresh = () => {
            router.reload();
        };

        for (const [key, value] of Object.entries(tableData.tableSettings)) {
            const hooks = hookRegistry.get(key) ?? [];

            for (const hook of hooks) {
                const context: TableHookContext = { value, tableData, refresh };
                const cleanup = hook(context);

                if (typeof cleanup === 'function') {
                    cleanups.push(cleanup);
                }
            }
        }
    }

    watch(
        () => tableData.tableSettings,
        () => runHooks(),
        { immediate: true, deep: true },
    );

    onUnmounted(() => {
        cleanups.forEach((fn) => fn());
        cleanups.length = 0;
    });
}
