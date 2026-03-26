import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import CopyableCell from '../../src/cells/CopyableCell.vue';

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
        const wrapper = mount(CopyableCell, { props: { value: '192.168.1.1' } });
        expect(wrapper.text()).toContain('192.168.1.1');
    });

    it('renders as a button element', () => {
        const wrapper = mount(CopyableCell, { props: { value: 'test' } });
        expect(wrapper.find('button').exists()).toBe(true);
    });

    it('renders nullText for null value', () => {
        const wrapper = mount(CopyableCell, { props: { value: null } });
        expect(wrapper.text()).toBe('-');
    });

    it('renders custom nullText', () => {
        const wrapper = mount(CopyableCell, { props: { value: null, nullText: 'N/A' } });
        expect(wrapper.text()).toBe('N/A');
    });

    it('copies value to clipboard on click', async () => {
        const wrapper = mount(CopyableCell, { props: { value: 'copy-me' } });
        await wrapper.find('button').trigger('click');
        await vi.runAllTimersAsync();
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('copy-me');
    });

    it('has accessible aria-label', () => {
        const wrapper = mount(CopyableCell, { props: { value: '192.168.1.1' } });
        expect(wrapper.find('button').attributes('aria-label')).toContain('192.168.1.1');
    });

    it('handles clipboard failure gracefully', async () => {
        (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('denied'));

        const wrapper = mount(CopyableCell, { props: { value: 'test' } });
        await wrapper.find('button').trigger('click');
        await vi.runAllTimersAsync();

        // Should not crash
        expect(wrapper.find('button').exists()).toBe(true);
    });
});
