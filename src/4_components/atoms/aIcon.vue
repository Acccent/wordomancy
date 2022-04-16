<script setup lang="ts">
import { Icon } from '@iconify/vue/offline';

const props = defineProps<{
  name: string;
}>();
</script>

<template>
  <div class="flex relative">
    <Icon class="w-7 h-7 sm:w-6 sm:h-6" :icon="props.name" />
    <div
      class="absolute inset-0 flex justify-center items-center text-sm font-mono">
      <slot />
    </div>
  </div>
</template>
