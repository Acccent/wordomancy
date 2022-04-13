<script setup lang="ts">
import { solving } from '@/3_stores';

const kbKeys = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

function addLetter(l: string) {
  solving.kbInput += l;
  solving.updateCurrentGuess();
}

function backspace() {
  solving.kbInput = solving.kbInput.slice(0, -1);
  solving.updateCurrentGuess();
}

function moveLeft() {
  solving.inputOffset = Math.max(solving.inputOffset - 1, 0);
  solving.updateCurrentGuess();
}

function moveRight() {
  solving.inputOffset = Math.min(
    solving.inputOffset + 1,
    solving.solution.length - solving.kbInput.length
  );
  solving.updateCurrentGuess();
}

function getLetterButtonState(l: string) {
  if (solving.isLetterInCorrects(l)) {
    return 'btn-success';
  }

  if (solving.isLetterInKeys(l)) {
    return 'btn-accent';
  }

  if (solving.knownInfo.misplaceds.has(l)) {
    return 'btn-warning';
  }

  if (solving.knownInfo.notInWord.has(l)) {
    return 'opacity-40';
  }

  return '';
}

const loading = reactive({
  btnGuess: false,
  btnHint: false,
});

async function submitGuess() {
  loading.btnGuess = true;
  await solving.evaluateGuess();
  emit('submitted');
  loading.btnGuess = false;
}

async function submitHint() {
  loading.btnHint = true;
  await solving.receiveHint();
  emit('submitted');
  loading.btnHint = false;
}

const inputsDisabled = computed(() => loading.btnGuess || loading.btnHint);

const emit = defineEmits<{
  (e: 'submitted'): void;
}>();
</script>

<template>
  <form id="guess-text-input" @submit.prevent="submitGuess">
    <div class="w-[30rem] max-w-full mb-4 mx-auto">
      <c-spell-input
        class="text-xl"
        :tooltip="solving.invalidGuess ? 'This is not a valid guess.' : ''"
        tip-position="top"
        v-model="solving.kbInput"
        :disabled="inputsDisabled"
        @update:modelValue="solving.updateCurrentGuess" />
    </div>
  </form>
  <div
    v-for="(row, i) in kbKeys"
    :key="`row-${i}`"
    class="flex justify-center gap-2 mb-2">
    <button
      v-if="i === 2 && solving.solution.length > 5"
      class="btn w-12 p-0 shrink"
      title="Move input left"
      :disabled="solving.inputOffset <= 0 || inputsDisabled"
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
      v-if="i === 2 && solving.solution.length > 5"
      class="btn w-12 p-0 shrink"
      title="Move input right"
      :disabled="
        solving.kbInput.length < 1 ||
        solving.inputOffset + solving.kbInput.length >=
          solving.solution.length ||
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
      :disabled="!solving.kbInput.length || inputsDisabled"
      @click.prevent="backspace">
      <a-icon name="f-backspace" />
    </a-button>
    <a-button
      class="btn-primary grow basis-2/3 py-2"
      title="Submit"
      form="guess-text-input"
      type="submit"
      :disabled="!solving.isValidGuess || inputsDisabled"
      :loading="loading.btnGuess">
      <a-icon name="u-upload" />
    </a-button>
    <a-button
      class="btn-accent shrink min-w-min py-2"
      title="Get hint"
      :disabled="!solving.canGetHint || inputsDisabled"
      :loading="loading.btnHint"
      @click.prevent="submitHint">
      <a-icon name="f-hint" />
    </a-button>
  </div>
</template>
