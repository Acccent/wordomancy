<script setup lang="ts">
const router = useRouter();

const spellCodeInput = ref('');

function goToSpell() {
  router.push({ name: 'spell', params: { code: spellCodeInput.value } });
}
</script>

<template>
  <div class="text-center">
    <p>Sorry, the Friends feature isn't available yet!</p>
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
    <p class="mt-8 mb-4">You can also solve the daily Spell:</p>
    <a-link-button @click="router.push({ name: 'spell' })">
      Solve daily Spell
    </a-link-button>
  </div>
</template>
