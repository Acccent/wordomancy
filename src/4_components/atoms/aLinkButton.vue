<script setup lang="ts">
defineProps<{
  disable?: boolean;
}>();
</script>

<template>
  <a
    class="btn min-w-fit py-3 h-auto min-h-0 font-semibold"
    :class="{
      'btn-primary': !disable,
      'btn-disabled': disable,
    }"
    role="button">
    <slot />
  </a>
</template>
