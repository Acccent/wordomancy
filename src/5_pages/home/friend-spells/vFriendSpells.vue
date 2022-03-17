<script setup lang="ts">
const router = useRouter();

function goToRandomSpell() {
  router.push({ name: 'spell', params: { spellid: 'random' } });
}
</script>

<template>
  <div class="text-center">
    <p>Sorry, this feature isn't available yet!</p>
    <p>Click the button below to solve a randomly-generated Spell:</p>
    <a-button big @click="goToRandomSpell">Solve Random Spell</a-button>
  </div>
</template>
