<script setup lang="ts">
// @ts-nocheck
import { onMounted, ref, computed, nextTick } from 'vue';
import RunnerCard from './components/RunnerCard.vue'
import Loader from './components/Loader.vue'
import { Api, Display, ParticipantMetrics } from "./hooks/"
import Pagination from "./components/Pagination.vue"

const api = new Api()
const width = ref(window.screen.width);

const updateSize = () => {
  width.value = window.screen.width;
}

const display = computed<Display>(() => width.value >= 1920 ? 'Desktop' : width.value >= 450 ? 'Tablet' : 'Mobile')
const data = ref([])
const filteredData = computed(() => data.value.filter(el => el.distance <= 4.3))
const cardData = computed(() => filteredData.value.map(el => ({ participant: el.participant, distance: el.distance, heartRate: el.heart_rate, id: el.id, speed: el.speed, stress: el.stress, })))

const loading = ref(false)
const boot = ref(true)
const PER_PAGE = display.value === `Desktop` ? 23 : 60
const offsetPaging = computed(() => {
  if (display.value === 'Desktop') return currentPage.value * PER_PAGE
  else return 0
})

const currentPage = ref(0)
const pages = ref(0)
const nextPageData = ref<ParticipantMetrics | null>(null)
const isNextPage = ref(false)
const isInterval = ref(false)
const INTERVAL_TIME = 12000

setInterval(async () => {
  if (!isInterval.value ) return

  if (!isNextPage.value)
    currentPage.value = 0

  await updateRunners()

}, INTERVAL_TIME)

const updateRunners = async () => {
  loading.value = true
  let res

  if (!nextPageData.value) {
    res = await api.getLatestParticipantMetrics.getLatestParticipantMetricsList({
      query: { limit: PER_PAGE, offset: offsetPaging.value }
    })
  } else {
    res = nextPageData.value
    nextPageData.value = null
  }

  data.value = res.data.results
  isNextPage.value = !!res.data.next

  currentPage.value++
  if (isNextPage.value)
    api.getLatestParticipantMetrics.getLatestParticipantMetricsList({
      query: { limit: PER_PAGE, offset: offsetPaging.value }
    })
      .then((runnerRes) => { nextPageData.value = runnerRes as unknown as ParticipantMetrics })
      .catch(() => { nextPageData.value = null })

  pages.value = Math.floor(res.data.count / PER_PAGE)
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
    <h1>Спорт и поддержка: вместе быстрее</h1>
    <img v-if="display === 'Mobile'" src="/logos-mobile.svg" />
    <img v-else src="/logos.svg" />
  </div>

  <Loader v-if="boot" />

  <div v-if="!cardData.length" class="empty-table">
    <h3>Нет данных о забеге</h3>
  </div>
  <div class="cards">
    <RunnerCard v-for="(runner) in cardData" :key="runner.participant.external_user_id" :runner="runner"
      class="runner-card animate__animated animate__fadeIn" />
  </div>
  <div v-if="display === 'Desktop'" class="qr-code">
    <img src="/qr-test.svg" />
    <span>Сканируйте и следите за показателями на своём устройстве</span>
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

.empty-table {
  height: 44vh;
  align-items: center;
  display: flex;
  justify-content: center;

  h3 {
    text-align: center;
    font-size: 40px;
    font-weight: 500;
    line-height: 52px;
    padding-bottom: 12px;
    background: linear-gradient(47deg, #06EB70 35.14%, #00B0E6 68%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.qr-code {
  img {
    width: 110px;
    height: 110px;
    margin-bottom: 5px;
  }

  span {
    width: 100%;
    font-size: 13px;
  }

  text-align: center;
  bottom: 62px;
  right: 80px;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  width: calc(280px - 32px);
  height: calc(216px - 20px);
  border-radius: 24px;
  background: #FFF;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.04),
  0px 4px 16px 0px rgba(0, 0, 0, 0.06);
  flex-direction: column;
  color: #363636;
  font-size: 21px;
  font-weight: 500;
  line-height: 22px;
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
}

@media (max-width: 1700px) {
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
</style>
