<script setup lang="ts">
import { LetterState as LS } from '@/2_utils/global';
import { solving } from '@/3_stores';

const props = defineProps<{
  guess?: GuessedWord;
}>();

const isCurrent = ref(props.guess === undefined);

const guessDisplay = computed(() => {
  const glArray = [] as GuessedLetter[];
  for (let i = 0; i < solving.solution.length; i++) {
    const inputLetter = (props.guess ?? solving.currentGuess).get(i);
    if (inputLetter) {
      glArray.push(inputLetter);
      continue;
    }

    if (isCurrent.value) {
      const correctLetter = solving.knownInfo.corrects.get(i);
      if (correctLetter) {
        glArray.push({
          letter: correctLetter,
          state: LS.correct,
        });
        continue;
      }

      const keyLetter = solving.knownInfo.keys.get(i);
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
  if (isCurrent.value) {
    switch (state) {
      case LS.correct:
      case LS.key:
        return state;
      case LS.wrong:
        return solving.showWrongState ? LS.wrong : LS.default;
      default:
        return LS.default;
    }
  } else {
    return state === LS.wrong && !solving.showWrongState ? LS.unknown : state;
  }
}

function isTranslucent(i: number) {
  return (
    isCurrent.value &&
    (i < solving.inputOffset ||
      i >= solving.kbInput.length + solving.inputOffset)
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
