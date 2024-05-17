<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from 'vue';
import RunnerCards from './components/RunnerCards.vue'
import Loader from './components/Loader.vue'
import { Api, Display } from "./hooks/"
import Pagination from "./components/Pagination.vue"

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
const pages = ref(0)
const nextPageData = ref(null)
const isNextPage = ref(false)
const isInterval = ref(false)
const INTERVAL_TIME = 12000

setInterval(async () => {
  if (!isInterval.value) return

  if (!isNextPage.value)
    currentPage.value = 0

  await updateRunners()

}, INTERVAL_TIME)

const updateRunners = async () => {
  loading.value = true
  let res
  
  if (!nextPageData.value) {
    res = await api.getLatestParticipantMetrics.getLatestParticipantMetricsList({
      query: { limit: PER_PAGE, offset: currentPage.value * PER_PAGE }
    })
  } else {
    res = nextPageData.value
    nextPageData.value = null
  }

  data.value = res.data.results
  isNextPage.value = !!res.data.next

  if (isNextPage.value)
    api.getLatestParticipantMetrics.getLatestParticipantMetricsList({
      query: { limit: PER_PAGE, offset: currentPage.value * PER_PAGE }
    })
      .then((runnerRes) => { nextPageData.value = runnerRes })
      .catch(() => { nextPageData.value = null })
  currentPage.value++
  pages.value = Math.floor(res.data.count / PER_PAGE)
  nextTick(() => loading.value = false)
}

onMounted(async () => {
  window.addEventListener('resize', updateSize);

  loading.value = true
  let gres = await api.getLatestParticipantMetrics.getLatestParticipantMetricsList({
    query: { limit: PER_PAGE, offset: currentPage.value * PER_PAGE }
  })
  console.log("🚀 ~ gres:", gres)
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
  <div v-else class="cards">
    <Transition name="slide-up">
      <RunnerCards :display="display" v-if="!loading" :cardData="cardData" />
    </Transition>
    <div v-if="display === 'Desktop'" class="qr-code">
      <img src="/qr.png" />
      <span>Следи за забегом с телефона</span>
    </div>
  </div>

  <div class="pagination-wrapper">
    <Pagination :page="currentPage" :pages="pages" v-if="!boot" />
  </div>
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
  flex-direction: column;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.pagination-wrapper {
  display: flex;
  width: 100%;
  justify-content: center;
  justify-self: flex-end;
  position: fixed;
  bottom: 17px;
}

@media (max-width: 1050px) {
  .top-menu {
    align-items: start;
    justify-content: unset;
    flex-direction: column-reverse;
    margin-bottom: 16px;
  }

  .pagination-wrapper {
    display: none
  }
}

@media (max-width: 450px) {
  .top-menu {
    flex-direction: column-reverse;
    justify-content: unset;
    gap: 24px;
    margin-bottom: 24px;
  }

  .pagination-wrapper {
    display: none
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
