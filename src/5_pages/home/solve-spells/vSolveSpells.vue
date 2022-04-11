<script setup lang="ts">
// import { SpellSource } from '@/2_utils/global';
import { spells } from '@/3_stores';
import CInputWithButton from '../../../4_components/cInputWithButton.vue';
const router = useRouter();

function goToSpell(code: string) {
  console.log(code);

  router.push({ name: 'spell', params: { id: code } });
}

// const loading = reactive({
//   friendsSpells: true,
// });

// async function refreshFriendsSpells() {
//   loading.friendsSpells = true;
//   await spells.getFriendSpells();
//   loading.friendsSpells = false;
// }
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
    placeholder="Enter code here..."
    button-text="Solve Spell"
    @submitted="c => goToSpell(c)" />

  <template v-if="spells.finishedSpells.length">
    <h3 class="mt-16 home-section-title">Spells you've finished:</h3>
    <c-spell-list :list="spells.finishedSpells" />
  </template>
</template>
