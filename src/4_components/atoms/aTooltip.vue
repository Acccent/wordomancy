<script setup lang="ts">
import { gsap } from 'gsap';

const props = defineProps<{
  show: boolean;
  text: string;
  isTop?: boolean | string;
}>();

const _isTop = computed(
  () =>
    props.isTop || (typeof props.isTop === 'string' && props.isTop !== 'false')
);

const opacity = ref(0);

watch(
  () => props.show,
  show => {
    gsap.to(opacity, {
      value: show ? 1 : 0,
      duration: 0.15,
      ease: 'power1.ease',
    });
  }
);
</script>

<template>
  <div
    :class="[
      'tooltip tooltip-error',
      `tooltip-${_isTop ? 'top' : 'bottom'}`,
      `order-${_isTop ? 'first' : 'last'}`,
    ]">
    {{ text }}
  </div>
</template>

<style scoped lang="postcss">
.tooltip {
  --opacity: v-bind(opacity);

  @apply rounded px-2 py-1 text-sm font-semibold w-max;
  background-color: var(--tooltip-color);
  color: var(--tooltip-text-color);
  opacity: var(--opacity);

  &::after {
    left: 50%;
    right: auto;
    opacity: var(--opacity);
    transition: none;
  }

  &.tooltip-bottom {
    margin-top: 3px;

    &::after {
      top: auto;
      bottom: 100%;
    }
  }
  &.tooltip-top {
    margin-bottom: 3px;

    &::after {
      top: 100%;
      bottom: auto;
    }
  }

  &::before {
    display: none;
  }
}
</style>
