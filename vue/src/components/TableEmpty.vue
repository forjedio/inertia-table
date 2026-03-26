<template>
    <tr>
        <td :colspan="colSpan" :class="className">
            {{ emptyText ?? 'No results found.' }}
        </td>
    </tr>
</template>

<script setup lang="ts">
defineProps<{
    colSpan: number;
    emptyText?: string;
    className?: string;
}>();
</script>
