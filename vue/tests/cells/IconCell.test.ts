import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import IconCell from '../../src/cells/IconCell.vue';
import { registerIcon } from '../../src/registries/icon-registry';

describe('IconCell', () => {
    it('renders null when icon not found', () => {
        const wrapper = mount(IconCell, { props: { iconName: 'nonexistent' } });
        expect(wrapper.html()).toBe('<!--v-if-->');
    });

    it('renders icon from iconResolver prop', () => {
        const MockIcon = { setup: () => () => h('svg', { 'data-testid': 'custom-icon' }) };
        const resolver = vi.fn().mockReturnValue(MockIcon);

        const wrapper = mount(IconCell, { props: { iconName: 'test', iconResolver: resolver } });
        expect(resolver).toHaveBeenCalledWith('test');
        expect(wrapper.find('[data-testid="custom-icon"]').exists()).toBe(true);
    });

    it('renders icon from global registry', () => {
        const MockIcon = { setup: () => () => h('svg', { 'data-testid': 'registry-icon' }) };
        registerIcon('vue-server-icon', MockIcon as any);

        const wrapper = mount(IconCell, { props: { iconName: 'vue-server-icon' } });
        expect(wrapper.find('[data-testid="registry-icon"]').exists()).toBe(true);
    });

    it('iconResolver takes precedence over registry', () => {
        const RegistryIcon = { setup: () => () => h('svg', { 'data-testid': 'registry' }) };
        const ResolverIcon = { setup: () => () => h('svg', { 'data-testid': 'resolver' }) };

        registerIcon('vue-priority-icon', RegistryIcon as any);
        const resolver = vi.fn().mockReturnValue(ResolverIcon);

        const wrapper = mount(IconCell, { props: { iconName: 'vue-priority-icon', iconResolver: resolver } });
        expect(wrapper.find('[data-testid="resolver"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="registry"]').exists()).toBe(false);
    });
});
