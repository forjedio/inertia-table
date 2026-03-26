import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resolveRouteParams, buildHref } from '../../src/utils/resolve-route-params';
import type { Row } from '../../src/types';

describe('resolveRouteParams', () => {
    const row: Row = { id: 1, name: 'Alice', org_id: 42 };

    it('substitutes :token params with row values', () => {
        const result = resolveRouteParams(row, { user: ':id' });
        expect(result).toEqual({ user: 1 });
    });

    it('handles multiple token params', () => {
        const result = resolveRouteParams(row, { user: ':id', org: ':org_id' });
        expect(result).toEqual({ user: 1, org: 42 });
    });

    it('passes through literal values unchanged', () => {
        const result = resolveRouteParams(row, { type: 'admin' });
        expect(result).toEqual({ type: 'admin' });
    });

    it('mixes tokens and literals', () => {
        const result = resolveRouteParams(row, { user: ':id', format: 'json' });
        expect(result).toEqual({ user: 1, format: 'json' });
    });

    it('returns undefined for missing row field', () => {
        const result = resolveRouteParams(row, { user: ':nonexistent' });
        expect(result.user).toBeUndefined();
    });

    it('handles empty params object', () => {
        const result = resolveRouteParams(row, {});
        expect(result).toEqual({});
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

        const result = buildHref('users.show', { user: 5 });

        expect(result).toBe('#');
        expect(warnSpy).toHaveBeenCalledOnce();
        expect(warnSpy.mock.calls[0][0]).toContain('users.show');
        warnSpy.mockRestore();
    });

    it('returns # when window.route is not a function', () => {
        (window as any).route = 'not a function';
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        const result = buildHref('test.route', {});

        expect(result).toBe('#');
        warnSpy.mockRestore();
    });
});
