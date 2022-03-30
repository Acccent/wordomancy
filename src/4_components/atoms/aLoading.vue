<script setup lang="ts">
import { Motion } from 'motion/vue';

const props = defineProps<{
  size?: number | string;
  color?: string;
}>();

const s = ref(props.size ? ~~props.size : 1);
const duration = computed(() => Math.pow(s.value, 0.5) * 2);
const fontSize = computed(() => `${s.value}rem`);
const bgColor = computed(() => props.color ?? 'currentColor');
</script>

<template>
  <div class="droplet">
    <Motion
      v-for="n in 3"
      :key="n"
      :animate="{
        opacity: [0, 0.8, 1, 0, 0],
        scale: [1, 0.5, 0.01, 1.2, 1.2],
        filter: ['blur(0)', 'blur(0)', 'blur(0)', 'blur(0.6em)', 'blur(1em)'],
      }"
      :transition="{
        easing: ['ease-in', 'ease-out', 'linear'],
        offset: [0, 0.22, 0.44, 0.88, 1],
        duration,
        delay: (n - 1) * duration * 0.12,
        repeat: Infinity,
      }" />
  </div>
</template>

<style scoped lang="postcss">
.droplet {
  position: relative;
  height: 1em;
  width: 1em;
  font-size: v-bind(fontSize);

  & > div {
    @apply block absolute inset-0 m-auto;
    background-color: v-bind(bgColor);
    border-radius: 100%;
  }
}
</style>
