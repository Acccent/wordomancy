<script setup lang="ts">
import { spells } from '@/3_stores';
import cSpellListItem from '@/4_components/cSpellListItem.vue';
import cSpellListItemUser from '@/4_components/cSpellListItemUser.vue';

const props = defineProps<{
  list?: MetaSpellData[];
}>();

const list = computed(() => props.list ?? spells.sortedUserSpells);
</script>

<template>
  <ul class="w-list mx-auto mb-8">
    <component
      :is="props.list === undefined ? cSpellListItemUser : cSpellListItem"
      v-for="(spell, i) in list"
      :spell="spell"
      :key="i" />
  </ul>
</template>
