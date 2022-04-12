<script setup lang="ts">
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
</script>

<template>
  <template v-if="spells.unplayedSpells.length">
    <h3 class="home-section-title text-primary">New Spells!</h3>
    <c-spell-list :list="spells.unplayedSpells" />
  </template>

  <template v-if="spells.solvingSpells.length">
    <h3 class="mt-12 home-section-title">Spells you've started:</h3>
    <c-spell-list :list="spells.solvingSpells" />
  </template>

  <p class="mt-16">If you know a Spell code, you can enter it below:</p>
  <c-input-with-button
    class="font-mono"
    placeholder="Enter Spell code..."
    button-text="Solve Spell"
    :loading="loading"
    @submitted="c => tryGoToSpell(c)" />

  <template v-if="spells.finishedSpells.length">
    <h3 class="mt-16 home-section-title">Spells you've finished:</h3>
    <c-spell-list :list="spells.finishedSpells" />
  </template>
</template>
