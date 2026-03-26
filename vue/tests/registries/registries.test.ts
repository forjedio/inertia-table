import { describe, it, expect } from 'vitest';
import { registerIcon, registerIcons, getIcon } from '../../src/registries/icon-registry';
import { registerCellComponent, getCellComponent } from '../../src/registries/component-registry';

describe('Icon Registry', () => {
    it('registers and retrieves a single icon', () => {
        const MockIcon = () => null;
        registerIcon('vue-test-single', MockIcon as any);
        expect(getIcon('vue-test-single')).toBe(MockIcon);
    });

    it('bulk registers icons', () => {
        const Icon1 = () => null;
        const Icon2 = () => null;
        registerIcons({ 'vue-bulk-1': Icon1 as any, 'vue-bulk-2': Icon2 as any });
        expect(getIcon('vue-bulk-1')).toBe(Icon1);
        expect(getIcon('vue-bulk-2')).toBe(Icon2);
    });

    it('returns undefined for unregistered icon', () => {
        expect(getIcon('vue-does-not-exist')).toBeUndefined();
    });

    it('overwrites existing registration', () => {
        const Old = () => null;
        const New = () => null;
        registerIcon('vue-overwrite', Old as any);
        registerIcon('vue-overwrite', New as any);
        expect(getIcon('vue-overwrite')).toBe(New);
    });
});

describe('Component Registry', () => {
    it('registers and retrieves a component', () => {
        const MockComponent = () => null;
        registerCellComponent('VueTestComp', MockComponent as any);
        expect(getCellComponent('VueTestComp')).toBe(MockComponent);
    });

    it('returns undefined for unregistered component', () => {
        expect(getCellComponent('VueNonExistent')).toBeUndefined();
    });

    it('overwrites existing registration', () => {
        const Old = () => null;
        const New = () => null;
        registerCellComponent('VueOverwrite', Old as any);
        registerCellComponent('VueOverwrite', New as any);
        expect(getCellComponent('VueOverwrite')).toBe(New);
    });
});
