<script setup>
import { computed } from "vue";
const props = defineProps({
  loading: {
    type: Boolean,
    default: true,
  },
  color: {
    type: String,
    default: "#5dc596",
  },
  size: {
    type: String,
    default: "55px",
  },
  radius: {
    type: String,
    default: "100%",
  },
});

const spinnerStyle = computed(() => {
  return {
    height: props.size,
    width: props.size,
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: props.color + " " + props.color + " transparent",
    borderRadius: props.radius,
    background: "transparent",
  };
});
</script>

<template>
  <div class="v-spinner" v-show="loading">
    <div class="v-clip" v-bind:style="spinnerStyle"></div>
  </div>
</template>

<style>
.v-spinner {
  height: 72vh;
  align-items: center;
  display: flex;
  justify-content: center;
  position: fixed;
  left: 48.8%;
}

.v-spinner .v-clip {
  -webkit-animation: v-clipDelay 0.75s 0s infinite linear;
  animation: v-clipDelay 0.75s 0s infinite linear;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;

  display: inline-block;
}

@-webkit-keyframes v-clipDelay {
  0% {
    -webkit-transform: rotate(0deg) scale(1);
    transform: rotate(0deg) scale(1);
  }

  50% {
    -webkit-transform: rotate(180deg) scale(0.95);
    transform: rotate(180deg) scale(0.95);
  }

  100% {
    -webkit-transform: rotate(360deg) scale(1);
    transform: rotate(360deg) scale(1);
  }
}

@keyframes v-clipDelay {
  0% {
    -webkit-transform: rotate(0deg) scale(1);
    transform: rotate(0deg) scale(1);
  }

  50% {
    -webkit-transform: rotate(180deg) scale(0.95);
    transform: rotate(180deg) scale(0.95);
  }

  100% {
    -webkit-transform: rotate(360deg) scale(1);
    transform: rotate(360deg) scale(1);
  }
}
</style>