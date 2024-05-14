<script setup lang="ts">
import { ref } from 'vue'
import SberCard from './SberCard.vue'

const test = ref({
  speed: 1,
  path: 1,
  pulse: 3,
  stress: 14,
})
</script>

<template>


  <div class="top-menu">
    <h3>Названия дашборда</h3>
    <img src="/logos.svg" />
  </div>
  <div class="card-wrapper">

    <SberCard :runner="test" :place="4" />
    <SberCard :runner="test" :place="4" />
    <SberCard :runner="test" :place="4" />
    <SberCard :runner="test" :place="4" />
    <SberCard :runner="test" :place="4" />
    <SberCard :runner="test" :place="4" />
    <SberCard :runner="test" :place="4" />
    <SberCard :runner="test" :place="4" />
    <SberCard :runner="test" :place="4" />
    <SberCard :runner="test" :place="4" />
  </div>

</template>

<style scoped lang="scss">
.top-menu {
  display: flex;
  justify-content: space-between;
}

.card-wrapper {
  display: grid;
  gap: 16px
}
</style>
