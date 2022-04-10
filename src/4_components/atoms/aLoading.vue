<script setup lang="ts">
import { gsap } from 'gsap';

const props = defineProps<{
  size?: number | string;
  color?: string;
  delay?: number | string;
}>();

const droplets = ref(new Map<number, Element>());

const size = ref(
  props.size
    ? typeof props.size === 'string'
      ? parseFloat(props.size)
      : props.size
    : 1
);
const initDelay = ref(props.delay ? ~~props.delay : 0);
const fontSize = ref(`${size.value}rem`);
const bgColor = ref(props.color ?? 'currentColor');
const duration = Math.pow(size.value * 3, 0.15);

onMounted(() => {
  droplets.value.forEach((e, i) => {
    gsap
      .timeline({
        delay: i * (duration / 4) + initDelay.value,
        repeat: -1,
        repeatDelay: duration / 4,
      })
      .to(e, {
        opacity: 1,
        duration,
        ease: 'power1.out',
      })
      .to(
        e,
        {
          scale: 0.01,
          duration,
          ease: 'expoScale(1, 0.01)',
        },
        0
      )
      .to(e, {
        opacity: 0,
        duration,
        ease: 'power1.in',
      })
      .to(
        e,
        {
          scale: 1.2,
          filter: 'blur(0.5em)',
          duration,
          ease: 'expoScale(0.01, 1.2)',
        },
        duration
      );
  });
});
</script>

<template>
  <div class="drop">
    <div
      v-for="n in 3"
      :key="n"
      :ref="el => droplets.set(n, el as Element)"></div>
  </div>
</template>

<style scoped lang="postcss">
.drop {
  position: relative;
  height: 1em;
  width: 1em;
  font-size: v-bind(fontSize);

  & > div {
    @apply block absolute inset-0 m-auto opacity-0;
    background-color: v-bind(bgColor);
    border-radius: 100%;
  }
}
</style>
