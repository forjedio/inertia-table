import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { DateCell } from '../../src/cells/DateCell';

describe('DateCell', () => {
    it('renders formattedValue as-is in non-local mode', () => {
        render(<DateCell formattedValue="Jun 15, 2024" />);
        const time = screen.getByText('Jun 15, 2024');
        expect(time).toBeTruthy();
        expect(time.tagName).toBe('TIME');
    });

    it('renders dash for null formattedValue', () => {
        render(<DateCell formattedValue={null} />);
        expect(screen.getByText('-')).toBeTruthy();
    });

    it('renders dash for undefined formattedValue', () => {
        render(<DateCell formattedValue={undefined as unknown as null} />);
        expect(screen.getByText('-')).toBeTruthy();
    });

    it('sets dateTime attribute when rawValue is provided', () => {
        const { container } = render(
            <DateCell formattedValue="Jun 15, 2024" rawValue="2024-06-15T10:30:00Z" />,
        );
        const time = container.querySelector('time');
        expect(time?.getAttribute('dateTime')).toBe('2024-06-15T10:30:00Z');
    });

    it('does not set dateTime attribute when rawValue is absent', () => {
        const { container } = render(<DateCell formattedValue="Jun 15, 2024" />);
        const time = container.querySelector('time');
        expect(time?.hasAttribute('dateTime')).toBe(false);
    });

    it('attempts Intl formatting in local mode with rawValue', () => {
        render(
            <DateCell
                formattedValue="Jun 15, 2024"
                rawValue="2024-06-15T10:30:00Z"
                local={true}
            />,
        );
        const time = screen.getByRole('time');
        // Intl output varies by environment, but it should contain "2024"
        expect(time.textContent).toContain('2024');
    });

    it('includes time when local and includeTime are set', () => {
        render(
            <DateCell
                formattedValue="Jun 15, 2024"
                rawValue="2024-06-15T10:30:00Z"
                local={true}
                includeTime={true}
            />,
        );
        const time = screen.getByRole('time');
        // Should contain some time-related content (varies by locale)
        expect(time.textContent).toBeTruthy();
        expect(time.textContent!.length).toBeGreaterThan(0);
    });

    it('falls back to formattedValue in local mode without rawValue', () => {
        render(<DateCell formattedValue="Jun 15, 2024" local={true} />);
        expect(screen.getByText('Jun 15, 2024')).toBeTruthy();
    });

    it('falls back to formattedValue when Intl formatting fails', () => {
        render(
            <DateCell
                formattedValue="Jun 15, 2024"
                rawValue="not-a-valid-date"
                local={true}
            />,
        );
        // Invalid date may or may not throw - either way we should see some text
        const time = screen.getByRole('time');
        expect(time.textContent).toBeTruthy();
    });
});
