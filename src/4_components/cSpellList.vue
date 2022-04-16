<script setup lang="ts">
import { DateTime } from 'luxon';
import { spells } from '@/3_stores';
import cSpellListItem from '@/4_components/cSpellListItem.vue';
import cSpellListItemUser from '@/4_components/cSpellListItemUser.vue';

const props = defineProps<{
  list?: MetaSpellData[];
}>();

const sortedList = computed(() =>
  [...(props.list ?? spells.userSpells.values())].sort((a, b) => {
    const dateA = DateTime.fromISO(a.spell.createdOn);
    const dateB = DateTime.fromISO(b.spell.createdOn);
    return dateB <= dateA ? -1 : 1;
  })
);
</script>

<template>
  <ul class="w-list mx-auto mb-8">
    <div v-for="(meta, i) in sortedList" :key="i">
      <component
        :is="props.list === undefined ? cSpellListItemUser : cSpellListItem"
        :meta="meta" />
    </div>
  </ul>
</template>
