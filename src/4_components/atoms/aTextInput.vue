<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
defineProps<{
  tooltip?: string;
  showTooltip?: boolean;
  topTooltip?: boolean | string;
}>();

const refInput = ref<HTMLInputElement | null>(null);

defineExpose({ refInput });

defineEmits<{
  (e: 'input'): void;
  (e: 'enterUp'): void;
}>();
</script>

<template>
  <div class="flex flex-col items-center">
    <input
      class="input input-bordered w-full"
      type="text"
      v-bind="$attrs"
      ref="refInput"
      @input.prevent="$emit('input')"
      @keyup.enter="$emit('enterUp')" />
    <a-tooltip
      v-if="tooltip"
      :show="showTooltip ?? false"
      :text="tooltip"
      :is-top="topTooltip">
    </a-tooltip>
  </div>
</template>
