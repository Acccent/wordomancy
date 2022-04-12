<script setup lang="ts">
import { DateTime } from 'luxon';
import { LetterState as LS, SpellSource, SpellStatus } from '@/2_utils/global';
import { spells } from '@/3_stores';

const props = defineProps<{
  spell: MetaSpellData;
}>();

const spell = reactive(props.spell.spell);
const status = ref(props.spell.status);
const source = ref(props.spell.source);

const id = spells.getSpellId(spell, source.value);

const shownSpell = computed((): GuessedLetter[] => {
  if (status.value === SpellStatus.finished) {
    return [...spell.spellword].map((letter, i) => ({
      letter,
      state: spell.keys.includes(i) ? LS.key : LS.correct,
    }));
  }
  return [...spell.spellword].map((letter, i) =>
    spell.keys.includes(i)
      ? { letter, state: LS.key }
      : { letter: ' ', state: LS.default }
  );
});
</script>

<template>
  <li class="flex justify-between items-center my-4">
    <div
      class="flex items-center"
      :class="{ 'pl-8': source === SpellSource.other }">
      <div
        v-if="source === SpellSource.daily"
        class="flex w-5 mr-3 text-primary">
        <a-icon name="f-clock" />
      </div>
      <div
        v-else-if="source === SpellSource.friend"
        class="flex w-5 mr-3 text-info">
        <a-icon name="f-friend" />
      </div>
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
          :class="['w-8', { 'opacity-[0.9]': gl.state !== LS.key }]"
          :letter="gl.letter"
          :letterState="gl.state"
          :key="i" />
      </router-link>
    </div>
    <a-list-dotted-line />
    <div class="text-sm italic opacity-85">
      <span v-if="source === SpellSource.daily"
        >Daily Spell ({{
          DateTime.fromISO(spell.createdOn).toLocaleString({
            weekday: 'long',
            day: 'numeric',
            month: 'short',
          })
        }})</span
      >
      <span v-else
        >Cast by
        {{ ((spell as SpellData).creator as OtherUserData).displayName }}</span
      >
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
