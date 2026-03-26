import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resolveRouteParams, buildHref } from '../../src/utils/resolve-route-params';
import type { Row } from '../../src/types';

describe('resolveRouteParams', () => {
    const row: Row = { id: 1, name: 'Alice', org_id: 42 };

    it('substitutes :token params with row values', () => {
        expect(resolveRouteParams(row, { user: ':id' })).toEqual({ user: 1 });
    });

    it('handles multiple token params', () => {
        expect(resolveRouteParams(row, { user: ':id', org: ':org_id' })).toEqual({ user: 1, org: 42 });
    });

    it('passes through literal values unchanged', () => {
        expect(resolveRouteParams(row, { type: 'admin' })).toEqual({ type: 'admin' });
    });

    it('mixes tokens and literals', () => {
        expect(resolveRouteParams(row, { user: ':id', format: 'json' })).toEqual({ user: 1, format: 'json' });
    });

    it('returns undefined for missing row field', () => {
        expect(resolveRouteParams(row, { user: ':nonexistent' }).user).toBeUndefined();
    });

    it('handles empty params object', () => {
        expect(resolveRouteParams(row, {})).toEqual({});
    });
});

describe('buildHref', () => {
    let originalRoute: unknown;

    beforeEach(() => {
        originalRoute = (window as any).route;
    });

    afterEach(() => {
        (window as any).route = originalRoute;
    });

    it('calls window.route when Ziggy is available', () => {
        const mockRoute = vi.fn().mockReturnValue('/users/5');
        (window as any).route = mockRoute;

        const result = buildHref('users.show', { user: 5 });
        expect(mockRoute).toHaveBeenCalledWith('users.show', { user: 5 });
        expect(result).toBe('/users/5');
    });

    it('returns # and warns when Ziggy is not available', () => {
        (window as any).route = undefined;
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        expect(buildHref('users.show', { user: 5 })).toBe('#');
        expect(warnSpy).toHaveBeenCalledOnce();
        warnSpy.mockRestore();
    });
});
