import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TextCell } from '../../src/cells/TextCell';

describe('TextCell', () => {
    it('renders string value', () => {
        render(<TextCell value="Hello" />);
        expect(screen.getByText('Hello')).toBeTruthy();
    });

    it('renders number value as string', () => {
        render(<TextCell value={42} />);
        expect(screen.getByText('42')).toBeTruthy();
    });

    it('renders nullText for null value', () => {
        render(<TextCell value={null} />);
        expect(screen.getByText('-')).toBeTruthy();
    });

    it('renders nullText for undefined value', () => {
        render(<TextCell value={undefined} />);
        expect(screen.getByText('-')).toBeTruthy();
    });

    it('renders custom nullText', () => {
        render(<TextCell value={null} nullText="N/A" />);
        expect(screen.getByText('N/A')).toBeTruthy();
    });

    it('renders boolean false as string', () => {
        render(<TextCell value={false} />);
        expect(screen.getByText('false')).toBeTruthy();
    });

    it('renders zero as string', () => {
        render(<TextCell value={0} />);
        expect(screen.getByText('0')).toBeTruthy();
    });

    it('renders empty string', () => {
        const { container } = render(<TextCell value="" />);
        const span = container.querySelector('span');
        expect(span?.textContent).toBe('');
    });

    it('applies gray styling to null values', () => {
        const { container } = render(<TextCell value={null} />);
        const span = container.querySelector('span');
        expect(span?.className).toContain('text-gray-400');
    });
});
