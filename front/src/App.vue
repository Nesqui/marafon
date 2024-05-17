<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from 'vue';
import RunnerCards from './components/RunnerCards.vue'
import Loader from './components/Loader.vue'
import { Api, Display } from "./hooks/"

const api = new Api()
const width = ref(window.screen.width);

const updateSize = () => {
  width.value = window.screen.width;
}

const display = computed<Display>(() => width.value >= 1920 ? 'Desktop' : width.value >= 450 ? 'Tablet' : 'Mobile')
const data = ref([])
const cardData = computed(() => data.value.map(el => ({ distance: el.distance, heartRate: el.heart_rate, id: el.id, speed: el.speed, stress: el.stress, })))

const loading = ref(false)
const boot = ref(true)
const PER_PAGE = 23
const currentPage = ref(0)
const nextPageData = ref(null)
const isNextPage = ref(false)
const isInterval = ref(false)
const INTERVAL_TIME = 12000

setInterval(async () => {
  if (!isInterval.value) return

  if (!isNextPage)
    currentPage.value = 0
  else
    await updateRunners()

}, INTERVAL_TIME)

const updateRunners = async () => {
  loading.value = true
  let res
  if (!nextPageData.value) {
    res = await api.getAllParticipantMetrics.getAllParticipantMetricsList({
      query: { limit: PER_PAGE, offset: currentPage.value * PER_PAGE }
    })
  } else {
    res = nextPageData.value
    nextPageData.value = null
  }

  data.value = res.data.results
  isNextPage.value = !!res.data.next

  api.getAllParticipantMetrics.getAllParticipantMetricsList({
    query: { limit: PER_PAGE, offset: (currentPage.value + 1) * PER_PAGE }
  })
    .then((runnerRes) => { nextPageData.value = runnerRes })
    .catch(() => { nextPageData.value = null })
  currentPage.value++

  nextTick(() => loading.value = false)
}

onMounted(async () => {
  window.addEventListener('resize', updateSize);

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
    <h1>Названия дашборда</h1>
    <img v-if="display === 'Mobile'" src="/logos-mobile.svg" />
    <img v-else src="/logos.svg" />
  </div>

  <Loader v-if="boot" />
  <Transition name="slide-up">
    <RunnerCards :display="display" v-if="!loading" :cardData="cardData" />
  </Transition>
</template>

<style scoped lang="scss">
.top-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #363853;
  margin-bottom: 32px;
  gap: 16px;
}

@media (max-width: 1050px) {
  .top-menu {
    align-items: start;
    justify-content: unset;
    flex-direction: column-reverse;
    margin-bottom: 16px;
  }
}

@media (max-width: 450px) {
  .top-menu {
    flex-direction: column-reverse;
    justify-content: unset;
    gap: 24px;
    margin-bottom: 24px;
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.65s ease-in;
}

.slide-up-enter-from {
  opacity: 0;
}

.slide-up-leave-to {
  opacity: 90;
}
</style>
