import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import BadgeCell from '../../src/cells/BadgeCell.vue';
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
        const wrapper = mount(BadgeCell, { props: { value: 'Active', row } });
        expect(wrapper.text()).toBe('Active');
    });

    it('renders with default variant classes', () => {
        const wrapper = mount(BadgeCell, { props: { value: 'Test', row } });
        expect(wrapper.find('span').classes().join(' ')).toContain('bg-gray-100');
    });

    it('renders with specified variant', () => {
        const wrapper = mount(BadgeCell, { props: { value: 'Test', variant: 'success', row } });
        expect(wrapper.find('span').classes().join(' ')).toContain('bg-green-100');
    });

    it('resolves variant from colorField in row', () => {
        const wrapper = mount(BadgeCell, { props: { value: 'Active', colorField: '_status_color', row } });
        expect(wrapper.html()).toContain('bg-green-100');
    });

    it('falls back to variant when colorField value is missing', () => {
        const wrapper = mount(BadgeCell, { props: { value: 'Test', variant: 'warning', colorField: '_nonexistent', row } });
        expect(wrapper.html()).toContain('bg-yellow-100');
    });

    it('falls back to default when unknown variant', () => {
        const wrapper = mount(BadgeCell, { props: { value: 'Test', variant: 'unknown', row } });
        expect(wrapper.html()).toContain('bg-gray-100');
    });

    it('renders tooltip from tooltipKey', () => {
        const wrapper = mount(BadgeCell, { props: { value: 'Active', tooltipKey: '_tooltip', row } });
        expect(wrapper.find('span').attributes('title')).toBe('This is active');
    });

    it('renders nullText for null value', () => {
        const wrapper = mount(BadgeCell, { props: { value: null, row } });
        expect(wrapper.text()).toBe('-');
    });

    it('renders custom nullText', () => {
        const wrapper = mount(BadgeCell, { props: { value: null, row, nullText: 'N/A' } });
        expect(wrapper.text()).toBe('N/A');
    });

    it('renders all badge variants', () => {
        const variants = ['default', 'success', 'warning', 'danger', 'destructive', 'info', 'gray', 'outline'];
        for (const variant of variants) {
            const wrapper = mount(BadgeCell, { props: { value: variant, variant, row } });
            expect(wrapper.text()).toBe(variant);
            wrapper.unmount();
        }
    });
});
