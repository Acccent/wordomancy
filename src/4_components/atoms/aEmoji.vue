<script setup lang="ts">
import { Icon } from '@iconify/vue/offline';

defineProps<{
  name: string;
}>();
</script>

<template>
  <Icon :icon="name" />
</template>
