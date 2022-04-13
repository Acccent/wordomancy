<script setup lang="ts">
const props = defineProps<{
  disable?: boolean;
}>();
</script>

<template>
  <a
    class="btn min-w-fit py-3 h-auto min-h-0 font-semibold"
    :class="{
      'btn-primary': !props.disable,
      'btn-disabled': props.disable,
    }"
    role="button">
    <slot />
  </a>
</template>
