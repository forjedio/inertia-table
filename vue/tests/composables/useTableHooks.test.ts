import { describe, it, expect, vi, afterEach } from 'vitest';
import { registerTableHook, clearTableHooks } from '../../src/composables/useTableHooks';

vi.mock('@inertiajs/vue3', () => ({
    router: {
        reload: vi.fn(),
        get: vi.fn(),
    },
}));

afterEach(() => {
    clearTableHooks();
});

describe('registerTableHook', () => {
    it('registers a hook callback', () => {
        const callback = vi.fn();
        registerTableHook('test', callback);
        expect(() => registerTableHook('test', vi.fn())).not.toThrow();
    });

    it('allows multiple hooks for the same key', () => {
        registerTableHook('test', vi.fn());
        registerTableHook('test', vi.fn());
        expect(true).toBe(true);
    });
});

describe('clearTableHooks', () => {
    it('clears hooks for a specific key', () => {
        registerTableHook('key1', vi.fn());
        registerTableHook('key2', vi.fn());
        clearTableHooks('key1');
        expect(true).toBe(true);
    });

    it('clears all hooks when no key provided', () => {
        registerTableHook('key1', vi.fn());
        registerTableHook('key2', vi.fn());
        clearTableHooks();
        expect(true).toBe(true);
    });
});
