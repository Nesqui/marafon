<script setup lang="ts">
// import { computed, onMounted, ref } from 'vue'
import { PropType } from 'vue';
import RunnerCard from './RunnerCard.vue'
import { Display } from '../hooks';

const props = defineProps({
  cardData: { required: true },
  display: { type: String as PropType<Display>, required: true },
  currentPage: {},
  totalPages: {},
})

</script>

<template>
  <!-- <div class="card-container"> -->
    <RunnerCard v-for="(item, index) in cardData" :key="index" :runner="item" />
  <!-- </div> -->
</template>

<style scoped lang="scss">
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

@media (max-width: 768px) {
  .card-container {
    gap: 12px;
  }
}

@media (max-width: 450px) {
  .card-container {
    gap: 12px;
  }
}
</style>
