<script setup lang="ts">
import { SpellStatus } from '@/2_utils/global';
import { app, spells, solving } from '@/3_stores';
import { mWrongSpellCode } from '@/6_modals';
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

const spellLists = reactive({
  unplayed: [] as MetaSpellData[],
  solving: [] as MetaSpellData[],
  finished: [] as MetaSpellData[],
});

onMounted(() => {
  // For whatever reason, Vue struggles to reflect changes to the spells map via a computed property... so we just have to re-build the filtered arrays on mount
  for (const list of ['unplayed', 'solving', 'finished'] as const) {
    spellLists[list] = [...spells.allSpells.values()].filter(
      s => s.status === SpellStatus[list]
    );
    console.log(list, spellLists[list].length);
  }
});
</script>

<template>
  <template v-if="spellLists.unplayed.length">
    <h3 class="home-section-title text-primary">New Spells!</h3>
    <c-spell-list :list="spellLists.unplayed" />
  </template>

  <template v-if="spellLists.solving.length">
    <h3 class="home-section-title">Spells you've started</h3>
    <c-spell-list :list="spellLists.solving" />
  </template>

  <h3 class="home-section-title">Add Spells</h3>
  <p class="mt-4">
    If you know the code for another Spell, you can enter it below.<br />Codes
    are 8 letters or numbers.
  </p>
  <c-input-with-button
    class="font-mono"
    placeholder="Enter Spell code..."
    button-text="Solve Spell"
    condition="^\w{8}$"
    :loading="loading"
    @submitted="c => tryGoToSpell(c)" />

  <template v-if="spellLists.finished.length">
    <h3 class="home-section-title">Spells you've finished</h3>
    <c-spell-list :list="spellLists.finished" />
  </template>
</template>
