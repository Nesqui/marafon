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
  <div class="card-container">
    <RunnerCard v-for="(item, index) in cardData" :key="index" :runner="item" />
    <div v-if="display === 'Desktop'" class="qr-code">
      <img src="/qr.png" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  .qr-code {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    width: calc(280px - 32px);
    border-radius: 24px;
    background: #FFF;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.04), 0px 4px 16px 0px rgba(0, 0, 0, 0.06);
  }
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
