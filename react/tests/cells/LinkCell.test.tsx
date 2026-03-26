import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { LinkCell } from '../../src/cells/LinkCell';
import type { Row } from '../../src/types';

// Mock @inertiajs/react
vi.mock('@inertiajs/react', () => ({
    Link: ({ children, href, ...props }: any) =>
        React.createElement('a', { href, ...props }, children),
}));

const row: Row = { id: 5, name: 'Alice' };

describe('LinkCell', () => {
    let originalRoute: unknown;

    beforeEach(() => {
        originalRoute = (window as any).route;
        (window as any).route = vi.fn((name: string, params: Record<string, any>) => {
            return `/${name.replace(/\./g, '/')}/${Object.values(params).join('/')}`;
        });
    });

    afterEach(() => {
        (window as any).route = originalRoute;
    });

    it('renders link with Ziggy-resolved href', () => {
        const { container } = render(
            <LinkCell value="Alice" route="users.show" params={{ user: ':id' }} row={row} />,
        );

        const link = container.querySelector('a');
        expect(link?.textContent).toBe('Alice');
        expect(link?.getAttribute('href')).toBe('/users/show/5');
    });

    it('renders link with resolvedHref (server-side resolution)', () => {
        const { container } = render(
            <LinkCell value="Alice" resolvedHref="/users/5" row={row} />,
        );

        const link = container.querySelector('a');
        expect(link?.getAttribute('href')).toBe('/users/5');
    });

    it('prefers resolvedHref over Ziggy resolution', () => {
        const { container } = render(
            <LinkCell value="Alice" resolvedHref="/pre-resolved" route="users.show" params={{ user: ':id' }} row={row} />,
        );

        const link = container.querySelector('a');
        expect(link?.getAttribute('href')).toBe('/pre-resolved');
        expect((window as any).route).not.toHaveBeenCalled();
    });

    it('renders nullText for null value', () => {
        render(<LinkCell value={null} route="users.show" params={{ user: ':id' }} row={row} />);
        expect(screen.getByText('-')).toBeTruthy();
    });

    it('renders custom nullText', () => {
        render(<LinkCell value={null} row={row} nullText="N/A" />);
        expect(screen.getByText('N/A')).toBeTruthy();
    });

    it('renders plain text when no route or href available', () => {
        const { container } = render(
            <LinkCell value="Alice" row={row} />,
        );

        const link = container.querySelector('a');
        expect(link).toBeNull();
        expect(screen.getByText('Alice')).toBeTruthy();
    });

    it('renders plain text when route resolution fails', () => {
        const { container } = render(
            <LinkCell value="Alice" route="users.show" row={row} />,
        );

        // No params provided, so routeName && params is false
        const link = container.querySelector('a');
        expect(link).toBeNull();
    });
});
