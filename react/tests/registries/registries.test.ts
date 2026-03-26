import { describe, it, expect } from 'vitest';
import { registerIcon, registerIcons, getIcon } from '../../src/registries/icon-registry';
import { registerCellComponent, getCellComponent } from '../../src/registries/component-registry';

describe('Icon Registry', () => {
    it('registers and retrieves a single icon', () => {
        const MockIcon = () => null;
        registerIcon('test-single', MockIcon as any);
        expect(getIcon('test-single')).toBe(MockIcon);
    });

    it('bulk registers icons', () => {
        const Icon1 = () => null;
        const Icon2 = () => null;
        registerIcons({ 'bulk-1': Icon1 as any, 'bulk-2': Icon2 as any });
        expect(getIcon('bulk-1')).toBe(Icon1);
        expect(getIcon('bulk-2')).toBe(Icon2);
    });

    it('returns undefined for unregistered icon', () => {
        expect(getIcon('does-not-exist')).toBeUndefined();
    });

    it('overwrites existing registration', () => {
        const Old = () => null;
        const New = () => null;
        registerIcon('overwrite-test', Old as any);
        registerIcon('overwrite-test', New as any);
        expect(getIcon('overwrite-test')).toBe(New);
    });
});

describe('Component Registry', () => {
    it('registers and retrieves a component', () => {
        const MockComponent = () => null;
        registerCellComponent('TestComp', MockComponent as any);
        expect(getCellComponent('TestComp')).toBe(MockComponent);
    });

    it('returns undefined for unregistered component', () => {
        expect(getCellComponent('NonExistent')).toBeUndefined();
    });

    it('overwrites existing registration', () => {
        const Old = () => null;
        const New = () => null;
        registerCellComponent('OverwriteComp', Old as any);
        registerCellComponent('OverwriteComp', New as any);
        expect(getCellComponent('OverwriteComp')).toBe(New);
    });
});
