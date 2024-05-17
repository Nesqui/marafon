<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps(['page', 'pages'])
const width = computed(() => {
    const result  = (props.page/props.pages * 100).toFixed(0)
    if (+result > 100) return `100%`
    return `${result}%`
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
    display: flex;
    gap: 6px;
    align-items: center;

    .pagination-left,
    .pagination-right,
    .pagination-center {
        background: rgba(0, 0, 0, 0.16);
    }

    .pagination-center {
        width: 50px;
        height: 7px;
        border-radius: 10px;
    }

    .pagination-left,
    .pagination-right {
        border-radius: 50%;
        width: 7px;
        height: 7px;
    }

    .active.pagination-left,
    .active.pagination-right {
        background: linear-gradient(47deg, #06EB70 35.14%, #00B0E6 68%);
    }

    .active {
        .bar {
            background: linear-gradient(47deg, #06EB70 35.14%, #00B0E6 68%);
            border-radius: 10px;
            width: v-bind(width);
            height: 7px;
            transition: all 1s ease-in-out;
        }
    }
}
</style>