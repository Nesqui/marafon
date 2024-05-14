<script setup lang="ts">


const props = defineProps({
  runner: {
    type: Object,
    required: true
  },
})

</script>

<template>
  <div class="card-wrapper">
    <h3>{{ runner.id }}</h3>
    <div class="stats">
      <div class="stats__item">
        <div class="stats_title">
          <img src="/pulse.svg" /><span>Пульс</span>
        </div>
        <div class="stats_value">
          <span class="bold">{{ runner.heartRate.toFixed(1)
            }}</span><span>уд/мин</span>
        </div>
      </div>
      <div class="stats__item">
        <div class="stats_title">
          <img src="/stress.svg" /><span>Стресс</span>
        </div>
        <div class="stats_value">
          <span class="bold">{{ runner.stress.toFixed(2)
            }}</span><span></span>
        </div>
      </div>
      <div class="stats__item">
        <div class="stats_title">
          <img src="/speed.svg" /><span>Скорость</span>
        </div>
        <div class="stats_value">
          <span class="bold">{{ runner.speed.toFixed(1)
            }}</span><span>км/ч</span>
        </div>
      </div>
      <div class="stats__item">
        <div class="stats_title">
          <img src="/path.svg" /><span>Дистанция</span>
        </div>
        <div class="stats_value">
          <span class="bold">{{ runner.distance.toFixed(1)
            }}</span><span>км</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-wrapper {
  padding: 16px;
  width: calc(280px - 32px);
  border-radius: 24px;
  background: #FFF;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.04), 0px 4px 16px 0px rgba(0, 0, 0, 0.06);

  h3 {
    text-align: center;
    font-family: "SB Sans Display";
    font-size: 40px;
    font-style: normal;
    font-weight: 500;
    line-height: 52px;
    margin: 0;
    padding-bottom: 12px;
    background: linear-gradient(47deg, #06EB70 35.14%, #00B0E6 68%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .stats__item {
    width: 100%;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between;
    text-align: left;
    gap: 8px;

    .stats_title {
      span {
        width: 100px;
      }

      align-items: center;
      display: flex;
      gap: 8px;
      color: #363636;
      font-family: "SB Sans Display";
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 22px;
    }

    .stats_value {
      .bold {
        font-size: 20px;
        font-weight: 600;
      }

      display: flex;
      width: 104px;
      align-items: baseline;
      gap: 4px;
      color: #363636;
      font-family: "SB Sans Display";
      font-style: normal;
      line-height: 22px;
    }

  }
}
</style>
