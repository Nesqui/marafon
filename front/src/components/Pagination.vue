<script setup lang="ts">
import { defineProps } from 'vue';

defineProps(['page', 'pages'])
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

    .active {
        background: linear-gradient(47deg, #06EB70 35.14%, #00B0E6 68%);
    }

    .bar {
        background: linear-gradient(47deg, #06EB70 35.14%, #00B0E6 68%);
        border-radius: 10px;
        width: 50%;
    }
}
</style>