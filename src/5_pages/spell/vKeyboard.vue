<script setup lang="ts">
import { solving as spell } from '@/3_stores';

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
    spell.solution.length - spell.kbInput.length
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

const guessBtnLoading = ref(false);
async function submitGuess() {
  guessBtnLoading.value = true;
  await spell.evaluateGuess();
  emit('submitted');
  spell.resetInput();
  guessBtnLoading.value = false;
}

const hintBtnLoading = ref(false);
async function submitHint() {
  hintBtnLoading.value = true;
  await spell.receiveHint();
  emit('submitted');
  spell.resetInput();
  hintBtnLoading.value = false;
}

const inputsDisabled = computed(
  () => guessBtnLoading.value || hintBtnLoading.value
);

const emit = defineEmits<{
  (e: 'submitted'): void;
}>();
</script>

<template>
  <form id="guess-text-input" @submit.prevent="submitGuess">
    <div class="w-[30rem] max-w-full mb-4 mx-auto">
      <c-spell-input
        class="text-xl"
        :tooltip="spell.invalidGuess ? 'This is not a valid guess.' : ''"
        tip-position="top"
        v-model="spell.kbInput"
        :disabled="inputsDisabled"
        @update:modelValue="spell.updateCurrentGuess" />
    </div>
  </form>
  <div
    v-for="(row, i) in kbKeys"
    :key="`row-${i}`"
    class="flex justify-center gap-2 mb-2">
    <button
      v-if="i === 2 && spell.solution.length > 5"
      class="btn w-12 p-0 shrink"
      title="Move input left"
      :disabled="spell.inputOffset <= 0 || inputsDisabled"
      @click.prevent="moveLeft">
      <a-icon name="f-move-left" />
    </button>
    <button
      v-for="letter in row"
      :key="`letter-${letter}`"
      class="btn w-12 p-0 shrink"
      :class="getLetterButtonState(letter)"
      :disabled="inputsDisabled"
      @click.prevent="addLetter(letter)">
      {{ letter }}
    </button>
    <button
      v-if="i === 2 && spell.solution.length > 5"
      class="btn w-12 p-0 shrink"
      title="Move input right"
      :disabled="
        spell.kbInput.length < 1 ||
        spell.inputOffset + spell.kbInput.length >= spell.solution.length ||
        inputsDisabled
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
      :disabled="!spell.kbInput.length || inputsDisabled"
      @click.prevent="backspace">
      <a-icon name="f-backspace" />
    </a-button>
    <a-button
      class="btn-primary grow basis-2/3 py-2"
      title="Submit"
      form="guess-text-input"
      type="submit"
      :disabled="!spell.isValidGuess || inputsDisabled"
      :loading="guessBtnLoading">
      <a-icon name="u-upload" />
    </a-button>
    <a-button
      class="btn-accent shrink min-w-min py-2"
      title="Get hint"
      :disabled="!spell.canGetHint || inputsDisabled"
      :loading="hintBtnLoading"
      @click.prevent="submitHint">
      <a-icon name="f-hint" />
    </a-button>
  </div>
</template>
