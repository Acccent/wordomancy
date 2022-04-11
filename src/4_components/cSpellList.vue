<script setup lang="ts">
import { spells } from '@/3_stores';
import cSpellListItem from '@/4_components/cSpellListItem.vue';
import cUserSpellListItem from '@/4_components/cUserSpellListItem.vue';

const props = defineProps<{
  list?: MetaSpellData[];
}>();

const list = computed(() => props.list ?? spells.sortedUserSpells);
</script>

<template>
  <ul class="w-fit mx-auto mb-8 text-left">
    <component
      :is="props.list === undefined ? cUserSpellListItem : cSpellListItem"
      v-for="(spell, i) in list"
      :spell="spell"
      :key="i" />
  </ul>
</template>
