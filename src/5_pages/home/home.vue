<script setup lang="ts">
import vEnergyForecast from './vEnergyForecast.vue';
import castSpell from './cast-spell/vCastSpell.vue';
import friendSpells from './friend-spells/vFriendSpells.vue';

const tabNames: Record<string, string> = {
  cast: 'Cast a Spell',
  solve: 'Solve Spells',
};
const activeTab = ref(tabNames.cast);
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
  <v-energy-forecast @acknowledged="tab => (activeTab = tabNames[tab])" />
</template>
