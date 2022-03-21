<script setup lang="ts">
import { SpellPhase } from '@/2_utils/global';
import cModal from '@/4_components/cModal.vue';
import castSpell from './cast-spell/vCastSpell.vue';
import friendSpells from './friend-spells/vFriendSpells.vue';
import { useUser, useSpellCasting } from '@/3_stores';
const user = useUser();
const spell = useSpellCasting();

const tabNames: Record<string, string> = {
  cast: 'Cast a Spell',
  solve: 'Solve Spells',
};
const activeTab = ref(tabNames.cast);

const modal = ref<InstanceType<typeof cModal> | null>(null);

function start() {
  spell.resetEnergy();
  modal.value?.open();
}

function goToCastSpells() {
  activeTab.value = tabNames.cast;
  modal.value?.close();
}

function goToSolveSpells() {
  activeTab.value = tabNames.solve;
  modal.value?.close();
}

onMounted(() => {
  if (user.name) {
    start();
  }
});
</script>

<template>
  <c-navbar />
  <div class="column">
    <c-tabs-container :initial-tab="activeTab">
      <template #[tabNames.cast]>
        <cast-spell />
      </template>
      <template #[tabNames.solve]>
        <friend-spells />
      </template>
    </c-tabs-container>
  </div>
  <c-modal
    ref="modal"
    button-class="btn-primary"
    button-text="Cast a Spell"
    @closed="spell.phase = SpellPhase.inputtingWord">
    <p class="text-center">Welcome!</p>
    <p class="text-center">Here is your energy forecast for today:</p>
    <div class="flex justify-center gap-8 my-10">
      <template v-for="e in spell.energy" :key="e[0]">
        <div class="text-center">
          <a-emoji
            :name="e[0]"
            class="w-16 h-16 mx-auto mb-4 drop-shadow-spell" />
          <span class="block font-spell text-xl">{{ e[1] }}</span>
        </div>
      </template>
    </div>
    <template #modal-action>
      <div class="flex flex-col w-full">
        <div class="text-center">
          <p>Use your energy to</p>
          <a-button class="mt-2 btn-primary" @click="goToCastSpells">
            Cast a Spell
          </a-button>
        </div>
        <div class="divider">or</div>
        <div class="text-center">
          <p>
            keep it for later and
            <a class="link link-primary" @click="goToSolveSpells"
              >solve Spells</a
            >
            for now
          </p>
        </div>
      </div>
    </template>
  </c-modal>
  <!-- <c-debug>
    <button class="btn" @click="start">Open modal</button>
  </c-debug> -->
</template>
