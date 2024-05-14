<script setup lang="ts">
import { onMounted } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import { Api } from "./hooks/"
const api = new Api()

onMounted(async () => {
  const res = await api.getAllParticipantMetrics.getAllParticipantMetricsList()
  console.log("🚀 ~ onMounted ~ res:", res)
})

</script>

<template>
  <HelloWorld />
</template>

<style scoped lang="scss">
</style>
