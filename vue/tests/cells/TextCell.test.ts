import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TextCell from '../../src/cells/TextCell.vue';

describe('TextCell', () => {
    it('renders string value', () => {
        const wrapper = mount(TextCell, { props: { value: 'Hello' } });
        expect(wrapper.text()).toBe('Hello');
    });

    it('renders number value as string', () => {
        const wrapper = mount(TextCell, { props: { value: 42 } });
        expect(wrapper.text()).toBe('42');
    });

    it('renders nullText for null value', () => {
        const wrapper = mount(TextCell, { props: { value: null } });
        expect(wrapper.text()).toBe('-');
    });

    it('renders nullText for undefined value', () => {
        const wrapper = mount(TextCell, { props: { value: undefined } });
        expect(wrapper.text()).toBe('-');
    });

    it('renders custom nullText', () => {
        const wrapper = mount(TextCell, { props: { value: null, nullText: 'N/A' } });
        expect(wrapper.text()).toBe('N/A');
    });

    it('renders zero as string', () => {
        const wrapper = mount(TextCell, { props: { value: 0 } });
        expect(wrapper.text()).toBe('0');
    });

    it('renders empty string', () => {
        const wrapper = mount(TextCell, { props: { value: '' } });
        expect(wrapper.text()).toBe('');
    });

    it('applies gray styling to null values', () => {
        const wrapper = mount(TextCell, { props: { value: null } });
        expect(wrapper.find('span').classes()).toContain('text-gray-400');
    });
});
