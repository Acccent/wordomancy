<script setup lang="ts">
import { LetterState as LS, SpellSource } from '@/2_utils/global';
import { spells } from '@/3_stores';
const props = defineProps<{
  spell: SpellData;
}>();

const spell = reactive(props.spell);
const id = spells.getSpellId(spell, SpellSource.user);

const shownSpell = computed((): GuessedLetter[] => {
  return [...spell.spellword].map((letter, i) => ({
    letter,
    state: spell.keys.includes(i) ? LS.key : LS.default,
  }));
});
</script>

<template>
  <li class="flex justify-between my-4">
    <router-link
      class="flex items-center gap-0.5 w-fit"
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
    <div class="flex items-center">
      <div
        v-for="t in ['played', 'solved', 'guesses', 'failed']"
        :title="t === 'guesses' ? 'Average guesses' : `Times ${t}`"
        class="flex gap-1 ml-6"
        :key="t">
        <a-icon :name="`f-${t}`" />
        {{
          spell[
            t === 'played'
              ? 'timesPlayed'
              : t === 'solved'
              ? 'timesSolved'
              : t === 'guesses'
              ? 'averageGuesses'
              : 'timesFailed'
          ]
        }}
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
