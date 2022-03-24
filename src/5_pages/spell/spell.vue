<script setup lang="ts">
import vSpellLettersSolve from './vSpellLettersSolve.vue';
import vKeyboard from './vKeyboard.vue';
import vSpellNotFound from './vSpellNotFound.vue';
import { useSpellSolving } from '@/3_stores';
const spell = useSpellSolving();
const route = useRoute();
const router = useRouter();

const spellNotFoundModal = ref<InstanceType<typeof vSpellNotFound> | null>(
  null
);

async function goToRandom() {
  if (route.params.code !== 'random') {
    router.replace({ name: 'spell', params: { code: 'random' } });
  }
  await spell.resetSpell('random');
}

onMounted(async () => {
  const code = route.params.code.toString();

  if (!code) {
    await goToRandom();
  } else {
    await spell.resetSpell(code);
  }

  if (!spell.spellExists) {
    spellNotFoundModal.value?.open();
  }
});
</script>

<template>
  <c-navbar />
  <div v-if="spell.spellExists" class="column flex flex-col h-full">
    <div class="grow">
      <v-spell-letters-solve
        v-for="(guess, i) in spell.allGuesses"
        :guess="guess"
        :key="`guess-${i}`" />
      <v-spell-letters-solve v-if="!spell.gameOver" />
    </div>
    <div v-if="spell.gameOver" class="flex-none py-12 text-center">
      <template v-if="spell.won">
        <p>Congratulations!</p>
      </template>
      <template v-else>
        <p>
          You lost! The Spellword was
          <span class="text-error">{{ spell.solution }}</span
          >.
        </p>
      </template>
      <p class="w-96 my-8 mx-auto">
        Normally, you would only be able to solve one Spell per day (plus any
        that your friends create) but for the Alpha, you can solve new ones
        forever!
      </p>
      <a-button big @click="goToRandom">Solve another Spell</a-button>
    </div>
    <div v-else class="flex-none">
      <v-keyboard />
    </div>
  </div>
  <v-spell-not-found ref="spellNotFoundModal" @picked-random="goToRandom" />
</template>
