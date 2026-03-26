import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DateCell from '../../src/cells/DateCell.vue';

describe('DateCell', () => {
    it('renders formattedValue as-is in non-local mode', () => {
        const wrapper = mount(DateCell, {
            props: { formattedValue: 'Jun 15, 2024', rawValue: '2024-06-15T10:30:00Z' },
        });
        expect(wrapper.text()).toBe('Jun 15, 2024');
        expect(wrapper.find('time').exists()).toBe(true);
    });

    it('sets datetime attribute to rawValue', () => {
        const wrapper = mount(DateCell, {
            props: { formattedValue: 'Jun 15, 2024', rawValue: '2024-06-15T10:30:00Z' },
        });
        expect(wrapper.find('time').attributes('datetime')).toBe('2024-06-15T10:30:00Z');
    });

    it('renders dash for null formattedValue', () => {
        const wrapper = mount(DateCell, { props: { formattedValue: null } });
        expect(wrapper.text()).toBe('-');
        expect(wrapper.find('time').exists()).toBe(false);
    });

    it('renders dash when formattedValue is null even with rawValue', () => {
        const wrapper = mount(DateCell, {
            props: { formattedValue: null, rawValue: '2024-06-15T10:30:00Z' },
        });
        expect(wrapper.text()).toBe('-');
    });

    it('renders formattedValue without datetime when rawValue is absent', () => {
        const wrapper = mount(DateCell, {
            props: { formattedValue: 'Jun 15, 2024' },
        });
        expect(wrapper.text()).toBe('Jun 15, 2024');
        expect(wrapper.find('time').attributes('datetime')).toBeUndefined();
    });

    it('in local mode, attempts Intl formatting and falls back on error', () => {
        // jsdom has limited Intl support, but the code path should not throw
        const wrapper = mount(DateCell, {
            props: {
                formattedValue: 'Jun 15, 2024',
                rawValue: '2024-06-15T10:30:00Z',
                local: true,
                includeTime: false,
            },
        });
        // Should render some date text (either Intl-formatted or the fallback)
        expect(wrapper.text()).toBeTruthy();
        expect(wrapper.text()).not.toBe('-');
    });

    it('in local mode with includeTime, renders without throwing', () => {
        const wrapper = mount(DateCell, {
            props: {
                formattedValue: 'Jun 15, 2024, 10:30 AM',
                rawValue: '2024-06-15T10:30:00Z',
                local: true,
                includeTime: true,
            },
        });
        expect(wrapper.text()).toBeTruthy();
        expect(wrapper.text()).not.toBe('-');
    });

    it('in local mode without rawValue, shows formattedValue', () => {
        const wrapper = mount(DateCell, {
            props: {
                formattedValue: 'Jun 15, 2024',
                local: true,
            },
        });
        expect(wrapper.text()).toBe('Jun 15, 2024');
    });
});
