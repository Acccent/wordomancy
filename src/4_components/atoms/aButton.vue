<script setup lang="ts">
const props = defineProps<{
  big?: boolean;
  disabled?: boolean;
  loading?: boolean;
}>();
</script>

<template>
  <button
    class="btn min-w-fit max-w-full h-auto px-6 font-bold"
    :class="{
      'btn-primary w-64 py-4 mt-8 mx-auto text-lg': props.big,
      'text-base': !props.big,
    }"
    :disabled="props.loading || props.disabled">
    <slot v-if="!props.loading" />
    <a-loading v-else :size="props.big ? 1.75 : 1" />
  </button>
</template>
