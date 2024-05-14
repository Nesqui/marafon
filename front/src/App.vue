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
}))
)

const loading = ref(false)
const boot = ref(true)
const PER_PAGE = 23
const currentPage = ref(0)
const isNextPage = ref(null)
const isInterval = ref(false)
const INTERVAL_TIME = 12000

setInterval(async () => {
  if (!isInterval.value) return

  if (!isNextPage.value)
    currentPage.value = 0
  else
    await updateRunners()

}, INTERVAL_TIME)

const updateRunners = async () => {
  loading.value = true
  const res = await api.getAllParticipantMetrics.getAllParticipantMetricsList({
    query: {
      limit: PER_PAGE,
      offset: currentPage.value * PER_PAGE
    }
  })
  // await new Promise((resolve) => {
  //   setTimeout(() => resolve(true), 2700)
  // })
  currentPage.value++
  isNextPage.value = res.data.next
  data.value = res.data.results
  nextTick(() => loading.value = false)
}

onMounted(async () => {
  loading.value = true
  await updateRunners()

  isInterval.value = true
  nextTick(() => {
    loading.value = false
    boot.value = false
  })
})

</script>

<template>
  <div class="top-menu">
    <h3>Названия дашборда</h3>
    <img v-if="display === 'Mobile'" src="/logos-mobile.svg" />
    <img v-else src="/logos.svg" />
  </div>

  <Loader v-if="boot" />
  <Transition name="slide-up">
    <HelloWorld :display="display" v-if="!loading" :cardData="cardData" />
  </Transition>
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

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
}

.slide-up-leave-to {
  opacity: 0;
}
</style>
