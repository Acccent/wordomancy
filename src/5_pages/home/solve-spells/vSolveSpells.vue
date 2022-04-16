<script setup lang="ts">
import { SpellStatus } from '@/2_utils/global';
import { app, spells, solving } from '@/3_stores';
import mWrongSpellCode from './mWrongSpellCode.vue';
const router = useRouter();

const loading = ref(false);
async function tryGoToSpell(code: string) {
  loading.value = true;
  await solving.resetSpell(code, true);
  if (!solving.spellExists) {
    app.openModal('wrong spell code', mWrongSpellCode);
  } else {
    router.push({ name: 'spell', params: { id: code } });
  }
  loading.value = false;
}

const unplayedSpells = computed(() =>
  [...spells.allSpells.values()].filter(s => s.status === SpellStatus.unplayed)
);
const solvingSpells = computed(() =>
  [...spells.allSpells.values()].filter(s => s.status === SpellStatus.solving)
);
const finishedSpells = computed(() =>
  [...spells.allSpells.values()].filter(s => s.status === SpellStatus.finished)
);
</script>

<template>
  <template v-if="unplayedSpells.length">
    <h3 class="home-section-title text-primary">New Spells!</h3>
    <c-spell-list :list="unplayedSpells" />
  </template>

  <template v-if="solvingSpells.length">
    <h3 class="home-section-title">Spells you've started</h3>
    <c-spell-list :list="solvingSpells" />
  </template>

  <h3 class="home-section-title">Add Spells</h3>
  <p class="mt-4">
    If you know the code for another Spell, you can enter it below:
  </p>
  <c-input-with-button
    class="font-mono"
    placeholder="Enter Spell code..."
    button-text="Solve Spell"
    :loading="loading"
    @submitted="c => tryGoToSpell(c)" />

  <template v-if="finishedSpells.length">
    <h3 class="home-section-title">Spells you've finished</h3>
    <c-spell-list :list="finishedSpells" />
  </template>
</template>
