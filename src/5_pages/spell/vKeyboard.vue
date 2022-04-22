<script setup lang="ts">
import { solving } from '@/3_stores';
import ATextInput from '@/4_components/atoms/aTextInput.vue';

const kbKeys = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const textInput = ref<InstanceType<typeof ATextInput> | null>(null);
let refInput = textInput?.value?.refInput;

onMounted(() => {
  refInput = textInput?.value?.refInput;
});

function changeInput(s?: string) {
  solving.updateCurrentGuess(s ?? refInput?.value);
  if (refInput && refInput?.value !== solving.guessInput) {
    refInput.value = solving.guessInput;
  }
}

function moveLeft() {
  solving.inputOffset = Math.max(solving.inputOffset - 1, 0);
  solving.updateCurrentGuess();
}

function moveRight() {
  solving.inputOffset = Math.min(
    solving.inputOffset + 1,
    solving.solution.length - solving.guessInput.length
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

async function submit(type: 'evaluateGuess' | 'receiveHint') {
  loading.btnGuess = true;
  await solving[type]();
  emit('submitted');
  loading.btnGuess = false;
  if (refInput) {
    refInput.value = '';
  }
}

function submittedWithEnter() {
  refInput?.focus();
}

const inputsDisabled = computed(() => loading.btnGuess || loading.btnHint);

const emit = defineEmits<{
  (e: 'submitted'): void;
}>();
</script>

<template>
  <div class="flex flex-col gap-2 max-w-full mb-10">
    <a-tooltip
      :show="solving.invalidGuess"
      text="This is not a valid guess."
      class="after:hidden mb-2 mx-auto text-center" />
    <div class="flex gap-2 items-end mb-4">
      <a-button
        class="btn-error px-3"
        title="Delete all"
        :disabled="!solving.guessInput.length || inputsDisabled"
        @click.prevent="changeInput('')">
        <a-icon name="f-delete" />
      </a-button>
      <a-button
        class="btn-secondary"
        title="Backspace"
        :disabled="!solving.guessInput.length || inputsDisabled"
        @click.prevent="changeInput(solving.guessInput.slice(0, -1))">
        <a-icon name="f-backspace" />
      </a-button>
      <form
        id="guess-text-input"
        class="form-control grow"
        @submit.prevent="submit('evaluateGuess')">
        <div class="input-group items-end">
          <div class="w-1/2">
            <a-text-input
              class="text-xl spell-text-input"
              ref="textInput"
              :disabled="inputsDisabled"
              @input="changeInput"
              @enterUp="submittedWithEnter" />
          </div>
          <a-button
            class="btn-primary grow"
            title="Submit"
            form="guess-text-input"
            type="submit"
            :disabled="!solving.isInputValid || inputsDisabled"
            :loading="loading.btnGuess">
            <a-icon name="f-submit" />
          </a-button>
        </div>
      </form>
      <a-button
        class="btn-accent"
        title="Get hint"
        :disabled="!solving.canGetHint || inputsDisabled"
        :loading="loading.btnHint"
        @click.prevent="submit('receiveHint')">
        <a-icon name="f-hint" />
      </a-button>
    </div>
    <div
      v-for="(row, i) in kbKeys"
      :key="`row-${i}`"
      class="flex justify-center gap-2">
      <button
        v-if="i === 2 && solving.solution.length > 5"
        class="btn w-10% p-0 shrink"
        title="Move input left"
        :disabled="solving.inputOffset <= 0 || inputsDisabled"
        @click.prevent="moveLeft">
        <a-icon name="f-move-left" />
      </button>
      <button
        v-for="letter in row"
        :key="`letter-${letter}`"
        :class="['btn w-9% p-0 shrink', getLetterButtonState(letter)]"
        :disabled="inputsDisabled"
        @click.prevent="changeInput(solving.guessInput + letter)">
        {{ letter }}
      </button>
      <button
        v-if="i === 2 && solving.solution.length > 5"
        class="btn w-10% p-0 shrink"
        title="Move input right"
        :disabled="
          solving.guessInput.length < 1 ||
          solving.inputOffset + solving.guessInput.length >=
            solving.solution.length ||
          inputsDisabled
        "
        @click.prevent="moveRight">
        <a-icon name="f-move-right" />
      </button>
    </div>
  </div>
</template>
