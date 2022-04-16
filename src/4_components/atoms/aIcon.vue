<script setup lang="ts">
import { Icon } from '@iconify/vue/offline';

const props = defineProps<{
  name: string;
}>();
</script>

<template>
  <div class="flex relative">
    <Icon class="w-6 h-6" :icon="props.name" />
    <div
      class="absolute inset-0 flex justify-center items-center text-sm font-mono">
      <slot />
    </div>
  </div>
</template>
