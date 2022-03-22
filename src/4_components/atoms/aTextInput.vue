<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: string;
  tooltip?: string;
  tipPosition?: string;
  uppercase?: boolean;
}>();

function emitValue(e: Event) {
  const v = (e.target as HTMLInputElement).value;
  emit('update:modelValue', props.uppercase ? v.toUpperCase() : v);
}

const tipFlexOrder = computed(() =>
  props.tipPosition === 'top' ? 'order-first' : 'order-last'
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <div class="flex flex-col items-center">
    <input
      class="input input-bordered w-full"
      type="text"
      v-bind="$attrs"
      :value="modelValue"
      @input="emitValue" />
    <div
      v-show="props.tooltip"
      class="tooltip"
      :class="[
        tipFlexOrder,
        'tooltip-error',
        `tooltip-${props.tipPosition || 'bottom'}`,
        props.tooltip ? 'opacity-100' : 'opacity-0',
      ]">
      {{ props.tooltip }}
    </div>
  </div>
</template>

<style scoped lang="postcss">
.tooltip {
  @apply transition delay-100 duration-200 ease-in-out;
  @apply rounded px-2 py-1 text-sm font-semibold w-max; /*  max-w-full mx-auto; */
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
