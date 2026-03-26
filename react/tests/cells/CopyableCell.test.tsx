import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { CopyableCell } from '../../src/cells/CopyableCell';

describe('CopyableCell', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn().mockResolvedValue(undefined),
            },
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders value as button text', () => {
        render(<CopyableCell value="192.168.1.1" />);
        expect(screen.getByText('192.168.1.1')).toBeTruthy();
    });

    it('renders as a button element', () => {
        render(<CopyableCell value="test" />);
        const button = screen.getByRole('button');
        expect(button).toBeTruthy();
    });

    it('renders nullText for null value', () => {
        render(<CopyableCell value={null} />);
        expect(screen.getByText('-')).toBeTruthy();
    });

    it('renders custom nullText', () => {
        render(<CopyableCell value={null} nullText="N/A" />);
        expect(screen.getByText('N/A')).toBeTruthy();
    });

    it('copies value to clipboard on click', async () => {
        render(<CopyableCell value="copy-me" />);
        const button = screen.getByRole('button');

        await act(async () => {
            fireEvent.click(button);
        });

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('copy-me');
    });

    it('shows copied state after click', async () => {
        render(<CopyableCell value="test" />);
        const button = screen.getByRole('button');

        await act(async () => {
            fireEvent.click(button);
        });

        expect(button.className).toContain('bg-green-100');
    });

    it('resets copied state after 2 seconds', async () => {
        render(<CopyableCell value="test" />);
        const button = screen.getByRole('button');

        await act(async () => {
            fireEvent.click(button);
        });

        expect(button.className).toContain('bg-green-100');

        act(() => {
            vi.advanceTimersByTime(2000);
        });

        expect(button.className).toContain('bg-gray-100');
    });

    it('does not copy null value', () => {
        render(<CopyableCell value={null} />);
        // Null renders as span, not button
        expect(screen.queryByRole('button')).toBeNull();
    });

    it('has accessible aria-label', () => {
        render(<CopyableCell value="192.168.1.1" />);
        const button = screen.getByRole('button');
        expect(button.getAttribute('aria-label')).toContain('192.168.1.1');
    });

    it('handles clipboard failure gracefully', async () => {
        (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('denied'));

        render(<CopyableCell value="test" />);
        const button = screen.getByRole('button');

        await act(async () => {
            fireEvent.click(button);
        });

        // Should not crash, button still exists
        expect(button).toBeTruthy();
        // Should not show copied state
        expect(button.className).not.toContain('bg-green-100');
    });
});
