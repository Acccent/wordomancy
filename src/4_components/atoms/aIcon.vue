<script setup lang="ts">
import { Icon } from '@iconify/vue/offline';

const props = defineProps<{
  name: string;
}>();
</script>

<template>
  <Icon class="w-6 h-6" :icon="props.name" />
</template>
