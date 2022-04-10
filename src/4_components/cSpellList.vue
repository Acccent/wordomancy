<script setup lang="ts">
const props = defineProps<{
  list: MetaSpellData[];
}>();
</script>

<template>
  <ul>
    <c-spell-list-item
      v-for="spell in props.list"
      :spell="spell"
      :key="spell.spell.createdOn" />
  </ul>
</template>
