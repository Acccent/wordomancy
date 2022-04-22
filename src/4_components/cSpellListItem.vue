<script setup lang="ts">
import { DateTime } from 'luxon';
import { LetterState as LS, SpellSource, SpellStatus } from '@/2_utils/global';
import { user, spells } from '@/3_stores';

const props = defineProps<{
  meta: MetaSpellData;
}>();

const spell = reactive(props.meta.spell);
const status = ref(props.meta.status);
const source = ref(props.meta.source);

const id = ref(spells.getSpellId(spell, source.value));

const guesses = computed(() => {
  if (status.value !== SpellStatus.unplayed) {
    const isDaily = source.value === SpellSource.daily;
    const isFinished = status.value === SpellStatus.finished;

    return user.data[
      isDaily
        ? isFinished
          ? 'finishedDailies'
          : 'solvingDailies'
        : isFinished
        ? 'finished'
        : 'solving'
    ].get(id.value);
  }
});

const isWon = computed(
  () =>
    guesses.value?.length &&
    guesses.value[guesses.value?.length - 1] === spell.spellword
);

const isLost = computed(() => status.value === SpellStatus.finished && !isWon);

const shownSpell = computed((): GuessedLetter[] => {
  const corrects = new Set<number>();
  for (const g of guesses.value || []) {
    if (typeof g === 'number') {
      corrects.add(g);
    } else {
      for (const [i, l] of [...g].entries()) {
        if (l === spell.spellword[i]) {
          corrects.add(i);
        }
      }
    }
  }

  return [...spell.spellword].map((letter, i) =>
    spell.keys.includes(i)
      ? { letter, state: LS.key }
      : corrects.has(i)
      ? { letter, state: LS.correct }
      : status.value === SpellStatus.finished
      ? { letter, state: LS.wrong }
      : { letter: ' ', state: LS.default }
  );
});
</script>

<template>
  <li class="flex justify-between items-center my-4">
    <div class="w-6 mr-2">
      <div
        v-if="status !== SpellStatus.unplayed"
        title="Your guesses"
        :class="[
          'flex',
          {
            'text-success': isWon,
            'text-error': isLost,
          },
        ]">
        <a-icon name="f-square">{{ isLost ? '×' : guesses?.length }}</a-icon>
      </div>
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
    <a-list-dotted-line />
    <div class="text-sm italic opacity-85">
      <span v-if="source === SpellSource.daily"
        >Daily Spell ({{
          DateTime.fromISO(spell.createdOn).toLocaleString({
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })
        }})</span
      >
      <span v-else>Cast by {{ (spell as SpellData).creator.displayName }}</span>
    </div>
    <div class="w-5 ml-1">
      <div
        v-if="source === SpellSource.daily"
        class="text-primary"
        title="Daily Spell">
        <a-icon name="f-clock" />
      </div>
      <div
        v-else-if="source === SpellSource.friend"
        class="text-info"
        title="Friend Spell">
        <a-icon name="f-friend" />
      </div>
      <div
        v-else-if="source === SpellSource.other"
        class="text-neutral"
        title="User Spell">
        <a-icon name="f-not-friend" />
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
