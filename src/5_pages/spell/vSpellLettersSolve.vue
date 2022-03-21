<script setup lang="ts">
import { LS } from '@/2_utils/global';
import { useSpellSolving } from '@/3_stores';
const spell = useSpellSolving();

const props = defineProps<{
  guess?: GuessedWord;
}>();

const isCurrent = props.guess === undefined;
const guess = computed(() => (isCurrent ? spell.currentGuess : props.guess));

const guessDisplay = computed(() => {
  const glArray = [] as GuessedLetter[];
  for (let i = 0; i < spell.knownInfo.length; i++) {
    const inputLetter = guess.value.get(i);
    if (inputLetter) {
      glArray.push(inputLetter);
      continue;
    }

    if (isCurrent) {
      const correctLetter = spell.knownInfo.corrects.get(i);
      if (correctLetter) {
        glArray.push({
          letter: correctLetter,
          state: LS.correct,
        });
        continue;
      }

      const keyLetter = spell.knownInfo.keys.get(i);
      if (keyLetter) {
        glArray.push({
          letter: keyLetter,
          state: LS.key,
        });
        continue;
      }
    }

    glArray.push({
      letter: '',
      state: LS.unknown,
    });
    continue;
  }
  return glArray;
});

function getLetterState(state: LS) {
  if (isCurrent) {
    switch (state) {
      case LS.correct:
      case LS.key:
        return state;
      case LS.wrong:
        return spell.showWrongState ? LS.wrong : LS.default;
      default:
        return LS.default;
    }
  } else {
    return state === LS.wrong && !spell.showWrongState ? LS.unknown : state;
  }
}

function isTranslucent(i: number) {
  return (
    isCurrent &&
    (i < spell.inputOffset || i >= spell.kbInput.length + spell.inputOffset)
  );
}
</script>

<template>
  <div class="flex justify-center gap-1 my-4">
    <div v-for="({ letter, state }, i) in guessDisplay" :key="i" class="w-1/10">
      <c-spell-single-letter
        :letter="letter"
        :letterState="getLetterState(state)"
        :class="{
          'opacity-60': isTranslucent(i),
          'border-dotted': isCurrent,
        }" />
    </div>
  </div>
</template>
