<script setup lang="ts">
import { SpellPhase } from '@/2_utils/global';
import { generateAnims } from '@/2_utils/anims';
import { user, casting } from '@/3_stores';
import vInputSpellword from './vInputSpellword.vue';
import vSelectKeys from './vSelectKeys.vue';

const { setup, enter, leave } = generateAnims(
  { opacity: 1, blur: 0, scale: 1 },
  { opacity: 0, blur: 10, scale: 0.98 }
);

function restart() {
  casting.phase = SpellPhase.noEnergy;
  casting.getNewEnergy();
}

onMounted(async () => {
  if (casting.phase === SpellPhase.noEnergy) {
    casting.getNewEnergy();
  }
});
</script>

<template>
  <h3 class="home-section-title">Hi {{ user.data.displayName }}!</h3>
  <template v-if="casting.phase === SpellPhase.noEnergy">
    <p class="mb-6">Getting your energy forecast...</p>
    <div class="flex justify-center items-center h-full w-full">
      <a-loading color="hsl(var(--a))" size="8" />
    </div>
  </template>
  <template v-else>
    <template v-if="casting.phase === SpellPhase.error">
      <p>It looks like there's been a little hiccup.</p>
      <p class="my-4">
        Please make sure to
        <a class="link" href="https://github.com/Acccent/wordomancy/issues/new"
          >submit an issue</a
        >!
      </p>
      <a-button class="btn-secondary" @click="restart"
        >Try casting a Spell again</a-button
      >
    </template>
    <template v-else>
      <p>Here is your energy forecast for today:</p>
      <div class="flex justify-center gap-16 mt-10 mb-16">
        <div v-for="e in casting.energy" :key="e[0]">
          <a-emoji
            :name="e[0]"
            class="w-16 h-16 mx-auto mb-4 drop-shadow-spell" />
          <span class="block font-spell text-xl">{{ e[1] }}</span>
        </div>
      </div>
    </template>
    <transition
      @before-enter="setup"
      @enter="enter"
      @leave="leave"
      mode="out-in"
      :css="false">
      <div v-if="casting.phase === SpellPhase.inputtingWord">
        <v-input-spellword />
      </div>
      <div v-else-if="casting.phase === SpellPhase.selectingKeys">
        <v-select-keys />
      </div>
      <div v-else-if="casting.phase === SpellPhase.submitted">
        <p class="mb-4">
          You submitted a Spell with the Spellword
          {{ casting.submittedSpell.spellword }} and the Key Letter{{
            casting.submittedSpell.keys.length > 1 ? 's' : ''
          }}
          {{ casting.keysAsPhrase }}.
        </p>
        <p>Your Spell code is:</p>
        <code class="text-xl">{{ casting.submittedSpell.code }}</code>
        <p class="mt-4">
          Open your Profile tab to review it and your past Spells.
        </p>
        <a-button big @click="casting.resetCasting"
          >Cast another Spell</a-button
        >
      </div>
    </transition>
  </template>
</template>
