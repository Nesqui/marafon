<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import Loader from './components/Loader.vue'
import { Api, Display } from "./hooks/"

const api = new Api()
const width = ref(window.innerWidth);

const updateSize = () => {
  width.value = window.innerWidth;
}

const display = computed<Display>(() => width.value >= 1920 ? 'Desktop' : width.value >= 768 ? 'Tablet' : 'Mobile')

onMounted(() => {
  window.addEventListener('resize', updateSize);
})
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
      limit: 22,
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
    <img v-if="display === 'Mobile'" src="/logos-mobile.svg" />
    <img v-else src="/logos.svg" />
  </div>
  <HelloWorld :display="display" v-if="!loading" :cardData="cardData" />
  <Loader v-else />
</template>

<style scoped lang="scss">
.top-menu {
  display: flex;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .top-menu {
    justify-content: unset;
    flex-direction: column-reverse;
  }
}

@media (max-width: 375px) {
  .top-menu {
    flex-direction: column-reverse;
    justify-content: unset;
  }
}
</style>
