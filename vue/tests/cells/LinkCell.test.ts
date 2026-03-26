import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import LinkCell from '../../src/cells/LinkCell.vue';
import type { Row } from '../../src/types';

vi.mock('@inertiajs/vue3', () => ({
    Link: {
        name: 'Link',
        props: ['href', 'prefetch'],
        setup(props: any, { slots }: any) {
            return () => h('a', { href: props.href }, slots.default?.());
        },
    },
}));

const row: Row = { id: 5, name: 'Alice' };

describe('LinkCell', () => {
    let originalRoute: unknown;

    beforeEach(() => {
        originalRoute = (window as any).route;
        (window as any).route = vi.fn((name: string, params: Record<string, any>) =>
            `/${name.replace(/\./g, '/')}/${Object.values(params).join('/')}`,
        );
    });

    afterEach(() => {
        (window as any).route = originalRoute;
    });

    it('renders link with Ziggy-resolved href', () => {
        const wrapper = mount(LinkCell, {
            props: { value: 'Alice', route: 'users.show', params: { user: ':id' }, row },
        });
        expect(wrapper.find('a').attributes('href')).toBe('/users/show/5');
        expect(wrapper.text()).toBe('Alice');
    });

    it('renders link with resolvedHref (server-side resolution)', () => {
        const wrapper = mount(LinkCell, {
            props: { value: 'Alice', resolvedHref: '/users/5', row },
        });
        expect(wrapper.find('a').attributes('href')).toBe('/users/5');
    });

    it('prefers resolvedHref over Ziggy resolution', () => {
        const wrapper = mount(LinkCell, {
            props: { value: 'Alice', resolvedHref: '/pre-resolved', route: 'users.show', params: { user: ':id' }, row },
        });
        expect(wrapper.find('a').attributes('href')).toBe('/pre-resolved');
    });

    it('renders nullText for null value', () => {
        const wrapper = mount(LinkCell, {
            props: { value: null, route: 'users.show', params: { user: ':id' }, row },
        });
        expect(wrapper.text()).toBe('-');
    });

    it('renders plain text when no route or href available', () => {
        const wrapper = mount(LinkCell, {
            props: { value: 'Alice', row },
        });
        expect(wrapper.find('a').exists()).toBe(false);
        expect(wrapper.text()).toBe('Alice');
    });
});
