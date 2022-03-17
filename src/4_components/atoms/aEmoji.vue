<script setup lang="ts">
import { Icon } from '@iconify/vue/offline';

const props = defineProps<{
  name: string;
}>();
</script>

<template>
  <Icon :icon="props.name" />
</template>
