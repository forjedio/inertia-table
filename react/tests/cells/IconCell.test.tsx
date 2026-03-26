import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { IconCell } from '../../src/cells/IconCell';
import { registerIcon, registerIcons } from '../../src/registries/icon-registry';

// Reset icon registry between tests
afterEach(() => {
    // No clearIcons function, but tests use unique names so it's fine
});

describe('IconCell', () => {
    it('renders null when icon not found', () => {
        const { container } = render(<IconCell iconName="nonexistent" />);
        expect(container.innerHTML).toBe('');
    });

    it('renders icon from iconResolver prop', () => {
        const MockIcon = ({ className }: { className?: string }) => <svg data-testid="custom-icon" className={className} />;
        const resolver = vi.fn().mockReturnValue(MockIcon);

        render(<IconCell iconName="test" iconResolver={resolver} />);

        expect(resolver).toHaveBeenCalledWith('test');
        expect(screen.getByTestId('custom-icon')).toBeTruthy();
    });

    it('renders icon from global registry', () => {
        const MockIcon = ({ className }: { className?: string }) => <svg data-testid="registry-icon" className={className} />;
        registerIcon('server-icon', MockIcon);

        render(<IconCell iconName="server-icon" />);

        expect(screen.getByTestId('registry-icon')).toBeTruthy();
    });

    it('iconResolver takes precedence over registry', () => {
        const RegistryIcon = ({ className }: { className?: string }) => <svg data-testid="registry" className={className} />;
        const ResolverIcon = ({ className }: { className?: string }) => <svg data-testid="resolver" className={className} />;

        registerIcon('priority-icon', RegistryIcon);
        const resolver = vi.fn().mockReturnValue(ResolverIcon);

        render(<IconCell iconName="priority-icon" iconResolver={resolver} />);

        expect(screen.getByTestId('resolver')).toBeTruthy();
        expect(screen.queryByTestId('registry')).toBeNull();
    });

    it('falls back to registry when iconResolver returns null', () => {
        const RegistryIcon = ({ className }: { className?: string }) => <svg data-testid="fallback" className={className} />;
        registerIcon('fallback-icon', RegistryIcon);
        const resolver = vi.fn().mockReturnValue(null);

        render(<IconCell iconName="fallback-icon" iconResolver={resolver} />);

        expect(screen.getByTestId('fallback')).toBeTruthy();
    });

    it('passes className to icon component', () => {
        let receivedClass = '';
        const MockIcon = ({ className }: { className?: string }) => {
            receivedClass = className ?? '';
            return <svg data-testid="styled" />;
        };
        const resolver = vi.fn().mockReturnValue(MockIcon);

        render(<IconCell iconName="test" iconResolver={resolver} />);

        expect(receivedClass).toContain('h-4');
        expect(receivedClass).toContain('w-4');
    });
});
