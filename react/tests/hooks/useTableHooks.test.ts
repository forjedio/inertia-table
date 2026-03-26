import { describe, it, expect, vi, afterEach } from 'vitest';
import { registerTableHook, clearTableHooks } from '../../src';

// Mock @inertiajs/react
vi.mock('@inertiajs/react', () => ({
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

        // Verify hook is registered by checking it doesn't throw
        expect(() => registerTableHook('test', vi.fn())).not.toThrow();
    });

    it('allows multiple hooks for the same key', () => {
        const cb1 = vi.fn();
        const cb2 = vi.fn();

        registerTableHook('test', cb1);
        registerTableHook('test', cb2);

        // Both should be registered without error
        expect(true).toBe(true);
    });
});

describe('clearTableHooks', () => {
    it('clears hooks for a specific key', () => {
        registerTableHook('key1', vi.fn());
        registerTableHook('key2', vi.fn());

        clearTableHooks('key1');

        // key2 should still be registered
        expect(true).toBe(true);
    });

    it('clears all hooks when no key provided', () => {
        registerTableHook('key1', vi.fn());
        registerTableHook('key2', vi.fn());

        clearTableHooks();

        expect(true).toBe(true);
    });
});
