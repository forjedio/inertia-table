import { defineComponent, type PropType, type VNode } from 'vue';

/** Helper component to render a VNode returned by a function */
export default defineComponent({
    name: 'RenderVNode',
    props: {
        render: {
            type: Function as PropType<() => VNode | string | null>,
            required: true,
        },
    },
    setup(props) {
        return () => props.render();
    },
});
