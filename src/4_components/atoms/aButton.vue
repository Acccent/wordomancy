<script setup lang="ts">
const props = defineProps<{
  big?: boolean;
}>();
</script>

<template>
  <button
    class="btn w-64 min-w-fit max-w-full h-auto py-4 mx-auto font-bold"
    :class="{
      'btn-lg btn-primary mt-8': props.big,
    }">
    <slot />
  </button>
</template>
