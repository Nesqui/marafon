<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import Loader from './components/Loader.vue'
import { Api } from "./hooks/"

const api = new Api()

const data = ref([])

const cardData = computed(() => data.value.map(el => ({
  distance: el.distance,
  heartRate: el.heart_rate,
  id: el.id,
  speed: el.speed,
  stress: el.stress,
})))

const loading = ref(false)
onMounted(async () => {
  loading.value = true
  const res = await api.getAllParticipantMetrics.getAllParticipantMetricsList({
    query: {
      limit: 25,
      offset: 0
    }
  })
  data.value = res.data.results

  nextTick(()=>loading.value = false)
})

</script>

<template>
  <div class="top-menu">
    <h3>Названия дашборда</h3>
    <img src="/logos.svg" />
  </div>
  <HelloWorld v-if="!loading" :cardData="cardData" />
  <Loader v-else />
</template>

<style scoped lang="scss">
.top-menu {
  display: flex;
  justify-content: space-between;
}
</style>
