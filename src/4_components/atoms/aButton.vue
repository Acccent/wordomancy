<script setup lang="ts">
defineProps<{
  big?: boolean;
  disabled?: boolean;
  loading?: boolean;
}>();
</script>

<template>
  <button
    class="relative btn min-w-fit max-w-full h-auto px-6 font-bold"
    :class="{
      'btn-primary w-64 py-4 mt-8 mx-auto text-lg': big,
      'text-base': !big,
    }"
    :disabled="loading || disabled">
    <div :class="{ invisible: loading }">
      <slot />
    </div>
    <a-loading v-if="loading" class="!absolute" :size="big ? 1.75 : 1" />
  </button>
</template>
