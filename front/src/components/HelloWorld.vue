<script setup lang="ts">
import { ref } from 'vue'
import SberCard from './SberCard.vue'

const props = defineProps({
  cardData: { required: true }
})
</script>

<template>
  <div class="card-container">

    <SberCard v-for="(item, index) in cardData" :key="index" :runner="item" />
    <div class="qr-code">
      <img src="/qr.png" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-container {
  display: grid;
  gap: 16px;

  .qr-code {
    grid-column: 6;
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 16px;
    width: calc(280px - 32px);
    border-radius: 24px;
    background: #FFF;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.04), 0px 4px 16px 0px rgba(0, 0, 0, 0.06);
  }
}

@media (max-width: 1920px) {
  .card-container {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .card-container {
    grid-template-columns: 1fr 1fr 1fr;

  }
}

@media (max-width: 375px) {
  .card-container {
    grid-template-columns: 1fr;
  }
}
</style>
