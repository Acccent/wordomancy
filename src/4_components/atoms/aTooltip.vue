<script setup lang="ts">
import { generateAnims } from '@/2_utils/anims';

const props = defineProps<{
  isTop?: boolean | string;
}>();

const { setup, enter, leave } = generateAnims({ opacity: 1 }, { opacity: 0 });

const _isTop = computed(
  () =>
    props.isTop || (typeof props.isTop === 'string' && props.isTop !== 'false')
);
</script>

<template>
  <transition @before-enter="setup" @enter="enter" @leave="leave" appear>
    <div
      :class="[
        'tooltip tooltip-error',
        `tooltip-${_isTop ? 'top' : 'bottom'}`,
        `order-${_isTop ? 'first' : 'last'}`,
      ]">
      <slot />
    </div>
  </transition>
</template>

<style scoped lang="postcss">
.tooltip {
  @apply rounded px-2 py-1 text-sm font-semibold w-max;
  background-color: var(--tooltip-color);
  color: var(--tooltip-text-color);

  &::after {
    @apply opacity-100;
    left: 50%;
    right: auto;
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
