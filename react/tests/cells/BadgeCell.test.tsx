import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BadgeCell } from '../../src/cells/BadgeCell';
import type { Row } from '../../src/types';

const row: Row = {
    id: 1,
    status: 'Active',
    _status_color: 'success',
    _tooltip: 'This is active',
    _icon: 'check',
};

describe('BadgeCell', () => {
    it('renders value as badge text', () => {
        render(<BadgeCell value="Active" row={row} />);
        expect(screen.getByText('Active')).toBeTruthy();
    });

    it('renders with default variant classes', () => {
        const { container } = render(<BadgeCell value="Test" row={row} />);
        const badge = container.querySelector('span');
        expect(badge?.className).toContain('rounded-full');
        expect(badge?.className).toContain('bg-gray-100');
    });

    it('renders with specified variant', () => {
        const { container } = render(<BadgeCell value="Test" variant="success" row={row} />);
        const badge = container.querySelector('span');
        expect(badge?.className).toContain('bg-green-100');
    });

    it('resolves variant from colorField in row', () => {
        const { container } = render(<BadgeCell value="Active" colorField="_status_color" row={row} />);
        const badge = container.querySelector('span');
        expect(badge?.className).toContain('bg-green-100');
    });

    it('colorField takes precedence over variant prop', () => {
        const { container } = render(<BadgeCell value="Active" variant="danger" colorField="_status_color" row={row} />);
        const badge = container.querySelector('span');
        expect(badge?.className).toContain('bg-green-100');
        expect(badge?.className).not.toContain('bg-red-100');
    });

    it('falls back to variant when colorField value is missing', () => {
        const { container } = render(<BadgeCell value="Test" variant="warning" colorField="_nonexistent" row={row} />);
        const badge = container.querySelector('span');
        expect(badge?.className).toContain('bg-yellow-100');
    });

    it('falls back to default when unknown variant', () => {
        const { container } = render(<BadgeCell value="Test" variant="unknown" row={row} />);
        const badge = container.querySelector('span');
        expect(badge?.className).toContain('bg-gray-100');
    });

    it('renders tooltip from tooltipKey', () => {
        const { container } = render(<BadgeCell value="Active" tooltipKey="_tooltip" row={row} />);
        const badge = container.querySelector('span');
        expect(badge?.getAttribute('title')).toBe('This is active');
    });

    it('renders nullText for null value', () => {
        render(<BadgeCell value={null} row={row} />);
        expect(screen.getByText('-')).toBeTruthy();
    });

    it('renders custom nullText', () => {
        render(<BadgeCell value={null} row={row} nullText="N/A" />);
        expect(screen.getByText('N/A')).toBeTruthy();
    });

    it('renders icon when iconKey and iconResolver provided', () => {
        const MockIcon = ({ className }: { className?: string }) => <svg data-testid="icon" className={className} />;
        const resolver = vi.fn().mockReturnValue(MockIcon);

        render(<BadgeCell value="Active" iconKey="_icon" row={row} iconResolver={resolver} />);

        expect(resolver).toHaveBeenCalledWith('check');
        expect(screen.getByTestId('icon')).toBeTruthy();
    });

    it('skips icon when iconKey field is missing from row', () => {
        const resolver = vi.fn();

        const { container } = render(<BadgeCell value="Active" iconKey="_missing_icon" row={row} iconResolver={resolver} />);

        expect(resolver).not.toHaveBeenCalled();
        expect(container.querySelector('svg')).toBeNull();
    });

    it('renders all badge variants', () => {
        const variants = ['default', 'success', 'warning', 'danger', 'destructive', 'info', 'gray', 'outline'];

        for (const variant of variants) {
            const { unmount } = render(<BadgeCell value={variant} variant={variant} row={row} />);
            expect(screen.getByText(variant)).toBeTruthy();
            unmount();
        }
    });
});
