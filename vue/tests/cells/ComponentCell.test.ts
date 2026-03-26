import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import ComponentCell from '../../src/cells/ComponentCell.vue';
import { registerCellComponent } from '../../src/registries/component-registry';
import type { Row } from '../../src/types';

const row: Row = { id: 1, name: 'Alice', status: 'active' };

describe('ComponentCell', () => {
    it('renders registered component with row, value, and column props', () => {
        const TestComponent = {
            props: ['row', 'value', 'column'],
            setup(props: any) {
                return () => h('div', { 'data-testid': 'custom' }, [
                    h('span', { 'data-testid': 'value' }, String(props.value)),
                    h('span', { 'data-testid': 'column' }, props.column),
                ]);
            },
        };

        registerCellComponent('VueTestComponent', TestComponent as any);

        const wrapper = mount(ComponentCell, {
            props: { componentName: 'VueTestComponent', row, columnName: 'name' },
        });

        expect(wrapper.find('[data-testid="custom"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="value"]').text()).toBe('Alice');
        expect(wrapper.find('[data-testid="column"]').text()).toBe('name');
    });

    it('renders nothing when component is not registered', () => {
        const wrapper = mount(ComponentCell, {
            props: { componentName: 'VueNonExistent', row, columnName: 'name' },
        });
        expect(wrapper.html()).toBe('<!--v-if-->');
    });
});
