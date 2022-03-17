<script setup lang="ts">
import { useSpellSolving } from '@/3_stores/spell-solving';
const spell = useSpellSolving();

const kbKeys = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

function addLetter(l: string) {
  spell.kbInput += l;
  spell.updateCurrentGuess();
}

function backspace() {
  spell.kbInput = spell.kbInput.slice(0, -1);
  spell.updateCurrentGuess();
}

function moveLeft() {
  spell.inputOffset = Math.max(spell.inputOffset - 1, 0);
  spell.updateCurrentGuess();
}

function moveRight() {
  spell.inputOffset = Math.min(
    spell.inputOffset + 1,
    spell.knownInfo.length - spell.kbInput.length
  );
  spell.updateCurrentGuess();
}

function getLetterButtonState(l: string) {
  if (spell.isLetterInCorrects(l)) {
    return 'btn-success';
  }

  if (spell.isLetterInKeys(l)) {
    return 'btn-accent';
  }

  if (spell.knownInfo.misplaceds.has(l)) {
    return 'btn-warning';
  }

  if (spell.knownInfo.notInWord.has(l)) {
    return 'opacity-40';
  }

  return '';
}
</script>

<template>
  <form @submit.prevent="spell.submitCurrentGuess">
    <div class="w-[30rem] max-w-full mb-4 mx-auto">
      <c-spell-input
        class="text-xl"
        :tooltip="spell.unknownGuess ? 'This is not a valid guess.' : ''"
        tip-position="top"
        v-model="spell.kbInput"
        @update:modelValue="spell.updateCurrentGuess" />
    </div>
    <div
      v-for="(row, i) in kbKeys"
      :key="`row-${i}`"
      class="flex justify-center gap-2 mb-2">
      <button
        v-if="i === 2 && spell.knownInfo.length > 5"
        class="btn w-12 p-0 shrink"
        :disabled="spell.inputOffset <= 0"
        @click.prevent="moveLeft">
        <a-icon name="f-move-left" />
      </button>
      <button
        v-for="letter in row"
        :key="`letter-${letter}`"
        class="btn w-12 p-0 shrink"
        :class="getLetterButtonState(letter)"
        @click.prevent="addLetter(letter)">
        {{ letter }}
      </button>
      <button
        v-if="i === 2 && spell.knownInfo.length > 5"
        class="btn w-12 p-0 shrink"
        :disabled="
          spell.kbInput.length < 1 ||
          spell.inputOffset + spell.kbInput.length >= spell.knownInfo.length
        "
        @click.prevent="moveRight">
        <a-icon name="f-move-right" />
      </button>
    </div>
    <div
      class="flex justify-center gap-4 w-[34rem] max-w-full mt-6 mb-10 mx-auto">
      <a-button
        class="btn-secondary shrink min-w-min py-2"
        title="Backspace"
        :disabled="!spell.kbInput.length"
        @click.prevent="backspace">
        <a-icon name="f-backspace" />
      </a-button>
      <a-button
        class="btn-primary grow basis-2/3 py-2"
        title="Submit"
        type="submit"
        :disabled="!spell.isValidGuess">
        <a-icon name="u-upload" />
      </a-button>
      <a-button
        class="btn-accent shrink min-w-min py-2"
        title="Get hint"
        :disabled="!spell.canGetHint"
        @click.prevent="spell.submitGetHint">
        <a-icon name="f-hint" />
      </a-button>
    </div>
  </form>
</template>
