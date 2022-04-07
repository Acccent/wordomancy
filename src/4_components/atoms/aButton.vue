<script setup lang="ts">
const props = defineProps<{
  big?: boolean;
  disabled?: boolean;
  loading?: boolean;
}>();
</script>

<template>
  <button
    class="btn w-64 min-w-fit max-w-full h-auto py-4 px-6 mx-auto font-bold"
    :class="{
      'btn-primary mt-8 text-lg': props.big,
      'text-base': !props.big,
    }"
    :disabled="props.loading || props.disabled">
    <slot v-if="!props.loading" />
    <a-loading v-else :size="props.big ? 1.75 : 1" />
  </button>
</template>
