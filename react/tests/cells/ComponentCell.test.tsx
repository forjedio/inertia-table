import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ComponentCell } from '../../src/cells/ComponentCell';
import { registerCellComponent } from '../../src/registries/component-registry';
import type { CellComponentProps, Row } from '../../src/types';

const row: Row = { id: 1, name: 'Alice', status: 'active' };

describe('ComponentCell', () => {
    it('renders registered component with row, value, and column props', () => {
        const TestComponent = ({ row, value, column }: CellComponentProps) => (
            <div data-testid="custom">
                <span data-testid="value">{String(value)}</span>
                <span data-testid="column">{column}</span>
            </div>
        );

        registerCellComponent('TestComponent', TestComponent);

        render(<ComponentCell componentName="TestComponent" row={row} columnName="name" />);

        expect(screen.getByTestId('custom')).toBeTruthy();
        expect(screen.getByTestId('value').textContent).toBe('Alice');
        expect(screen.getByTestId('column').textContent).toBe('name');
    });

    it('renders null when component is not registered', () => {
        const { container } = render(<ComponentCell componentName="NonExistent" row={row} columnName="name" />);
        expect(container.innerHTML).toBe('');
    });

    it('passes correct value from row based on columnName', () => {
        const ValueDisplay = ({ value }: CellComponentProps) => (
            <span data-testid="val">{String(value)}</span>
        );

        registerCellComponent('ValueDisplay', ValueDisplay);

        render(<ComponentCell componentName="ValueDisplay" row={row} columnName="status" />);

        expect(screen.getByTestId('val').textContent).toBe('active');
    });
});
