<script setup lang="ts">
import { LetterState as LS, SpellSource } from '@/2_utils/global';
import { spells } from '@/3_stores';

const props = defineProps<{
  meta: MetaSpellData;
}>();

const spell = reactive(props.meta.spell as SpellData);
const id = spells.getSpellId(spell, SpellSource.user);

const shownSpell = [...spell.spellword].map((letter, i) => ({
  letter,
  state: spell.keys.includes(i) ? LS.key : LS.default,
}));
</script>

<template>
  <li class="flex justify-between items-center my-4">
    <router-link
      class="flex gap-0.5 w-fit"
      :to="{
        name: 'spell',
        params: {
          id,
        },
      }">
      <c-spell-single-letter
        v-for="(gl, i) in shownSpell"
        :class="['w-8', { 'opacity-[0.8]': gl.state !== LS.key }]"
        :letter="gl.letter"
        :letterState="gl.state"
        :key="i" />
    </router-link>
    <a-list-dotted-line />
    <div class="flex gap-2">
      <div
        v-for="t in (['played', 'solved', 'average', 'failed'] as const)"
        :title="t === 'average' ? 'Average guesses' : `Times ${t}`"
        class="flex gap-0.5 w-12"
        :key="t">
        <a-icon :name="`f-${t}`" />
        {{ spell[`stat${t}`].toFixed(t === 'average' ? 1 : 0) }}
      </div>
    </div>
  </li>
</template>

<style scoped lang="postcss">
a {
  transition: filter var(--animation-btn) ease;
  &:hover,
  &:focus {
    filter: drop-shadow(0 0 10px hsl(var(--a)));
  }
}
</style>
