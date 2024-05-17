<script lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
    page: {
        required: true,
        type: Number
    },
    pages: {
        required: true,
        type: Number
    }
})
</script>

<template>
    <div class="pagination">
        <div :class="{ active: page === 1 }" class="pagination-left"></div>
        <div :class="{ active: page !== 1 && page !== pages }" class="pagination-center">
            <div class="bar"></div>
        </div>
        <div :class="{ active: page === pages }" class="pagination-right"></div>
    </div>
</template>

<style lang="scss" scoped>
.pagination {
    .active {
        background-color: green;
    }

    .bar {
        background-color: green;
        width: 50%;
    }
}
</style>