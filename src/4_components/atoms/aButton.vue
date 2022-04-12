<script setup lang="ts">
const props = defineProps<{
  big?: boolean;
  disabled?: boolean;
  loading?: boolean;
}>();
</script>

<template>
  <button
    class="relative btn min-w-fit max-w-full h-auto px-6 font-bold"
    :class="{
      'btn-primary w-64 py-4 mt-8 mx-auto text-lg': props.big,
      'text-base': !props.big,
    }"
    :disabled="props.loading || props.disabled">
    <div :class="{ invisible: props.loading }">
      <slot />
    </div>
    <a-loading
      v-if="props.loading"
      class="!absolute"
      :size="props.big ? 1.75 : 1" />
  </button>
</template>
