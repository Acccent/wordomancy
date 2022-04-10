<script setup lang="ts">
// import { SpellSource } from '@/2_utils/global';
import { spells } from '@/3_stores';
const router = useRouter();

const spellCodeInput = ref('');
function goToSpell() {
  router.push({ name: 'spell', params: { code: spellCodeInput.value } });
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
  <div class="text-center">
    <a-link-button @click="router.push({ name: 'spell' })">
      Solve daily Spell
    </a-link-button>

    <p class="mt-8">If you know a Spell code, you can enter it below:</p>
    <div class="form-control mt-4">
      <div class="input-group justify-center">
        <input
          type="text"
          placeholder="Enter code here..."
          class="input input-bordered font-mono text-lg"
          v-model="spellCodeInput" />
        <a-link-button @click="goToSpell"> Solve Spell </a-link-button>
      </div>
    </div>

    <h3>New Spells:</h3>
    <c-spell-list :list="spells.unplayedSpells" />

    <p>Spells you've started:</p>
    <c-spell-list :list="spells.solvingSpells" />

    <p>Spells you've finished:</p>
    <c-spell-list :list="spells.finishedSpells" />
  </div>
</template>
