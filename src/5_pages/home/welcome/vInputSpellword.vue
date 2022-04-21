<script setup lang="ts">
import { casting } from '@/3_stores';
import ATextInput from '@/4_components/atoms/aTextInput.vue';

const used: boolean[][] = reactive([]);
const energyWords = computed(() => [...casting.energy.values()]);
const usedWrongLetters = ref(false);

const tooltipShow = ref(false);
const tooltipText = ref('No error yet');

const spellInput = ref<InstanceType<typeof ATextInput> | null>(null);

function changeInput() {
  const refInput = spellInput?.value?.refInput;

  if (!refInput) {
    return;
  }

  tooltipShow.value = false;
  const inputUpper = refInput.value.toUpperCase() ?? '';
  let swCompare = inputUpper;

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
    tooltipShow.value = true;
    tooltipText.value =
      'You can only use letters from the words of your energy forecast!';
    let newSwArray = [...inputUpper];
    [...swCompare].forEach(letter => {
      newSwArray[newSwArray.lastIndexOf(letter)] = '';
    });
    casting.word = newSwArray.join('');
  } else {
    usedWrongLetters.value = false;
    casting.word = inputUpper;

    if (!casting.isValidWord) {
      tooltipShow.value = true;
      tooltipText.value = 'Spellwords need to be between 5 and 10 letters!';
    }
  }

  if (casting.word !== inputUpper) {
    refInput.value = casting.word;
  }
}

const loading = ref(false);
async function submitInput() {
  loading.value = true;
  const success = await casting.submitInput();
  if (!success) {
    tooltipShow.value = true;
    tooltipText.value = "This isn't a valid Spellword...";
  }
  loading.value = false;
}
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
    <label class="mb-2" for="spellword-input">
      <p>Type in your Spellword below using letters from those words:</p>
    </label>
    <a-text-input
      id="spellword"
      class="input-accent input-lg text-3xl spell-text-input"
      :tooltip="tooltipText"
      :show-tooltip="tooltipShow"
      ref="spellInput"
      @input="changeInput" />
    <a-button
      type="submit"
      big
      :disabled="!casting.isValidWord"
      :loading="loading"
      >Use this Spellword</a-button
    >
  </form>
</template>
