<script setup lang="ts">
import { casting as spell } from '@/3_stores';

const used: boolean[][] = reactive([]);
const energyWords = computed(() => [...spell.energy.values()]);
const newSpellword = ref('');
const usedWrongLetters = ref(false);
const enteredOneLetter = ref(false);
const failedSubmitting = ref(false);

function changeInput() {
  failedSubmitting.value = false;
  enteredOneLetter.value = true;
  let swCompare = newSpellword.value;

  energyWords.value.forEach((energyWord, w) => {
    used[w] = new Array(energyWord.length);
    [...energyWord].forEach((energyLetter, l) => {
      if (swCompare.includes(energyLetter)) {
        used[w][l] = true;
        swCompare = swCompare.replace(energyLetter, '');
      } else {
        used[w][l] = false;
      }
    });
  });
  if (swCompare.length) {
    usedWrongLetters.value = true;
    let newSwArray = [...newSpellword.value];
    [...swCompare].forEach(letter => {
      newSwArray[newSwArray.lastIndexOf(letter)] = '';
    });
    newSpellword.value = newSwArray.join('');
  } else {
    usedWrongLetters.value = false;
  }
  spell.word = newSpellword.value;
}

const btnLoading = ref(false);
async function submitInput() {
  btnLoading.value = true;
  const success = await spell.submitInput();
  if (!success) {
    failedSubmitting.value = true;
  }
  btnLoading.value = false;
}

const tooltip = computed(() => {
  if (usedWrongLetters.value) {
    return 'You can only use letters from the words of your energy forecast!';
  }
  if (!spell.isValidWord && enteredOneLetter.value) {
    return 'Spellwords need to be between 5 and 10 letters!';
  }
  if (failedSubmitting.value) {
    return "This isn't a valid Spellword...";
  }
});
</script>

<template>
  <p>To cast a Spell, you must use the words from your forecast:</p>
  <div
    v-for="(word, w) in energyWords"
    class="flex justify-center flex-nowrap mt-6 gap-1"
    :key="word">
    <span
      v-for="(letter, l) in word"
      class="font-spell text-4xl drop-shadow-spell"
      :class="{ 'opacity-25': used[w]?.[l] }"
      :key="`${word}-${letter}`"
      >{{ letter }}</span
    >
  </div>
  <form class="form-control w-full mt-12" @submit.prevent="submitInput">
    <label class="mb-4" for="spellword-input">
      <p>Type in your Spellword below using letters from those words:</p>
    </label>
    <c-spell-input
      id="spellword"
      class="input-accent input-lg text-3xl"
      :tooltip="tooltip"
      v-model="newSpellword"
      @update:modelValue="changeInput" />
    <a-button big :disabled="!spell.isValidWord" :loading="btnLoading"
      >Use this Spellword</a-button
    >
  </form>
</template>
