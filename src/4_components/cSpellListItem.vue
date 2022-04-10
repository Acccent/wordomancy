<script setup lang="ts">
import { spells } from '@/3_stores';
const props = defineProps<{
  spell: MetaSpellData;
}>();

const { spell, source } = reactive(props.spell);
const id = spells.getSpellId(spell, source);
</script>

<template>
  <li>
    <router-link
      :to="{
        name: 'spell',
        params: {
          id,
        },
      }"
      >{{ id }}</router-link
    >
  </li>
</template>
