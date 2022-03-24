<script setup lang="ts">
const router = useRouter();

const spellCodeInput = ref('');

function goToSpell() {
  router.push({ name: 'spell', params: { code: spellCodeInput.value } });
}

function goToRandomSpell() {
  router.push({ name: 'spell', params: { code: 'random' } });
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
        <button class="btn btn-primary font-bold" @click="goToSpell">
          Solve Spell
        </button>
      </div>
    </div>
    <p class="mt-8">
      Or (just for the Alpha) click the button below to solve a
      randomly-generated Spell:
    </p>
    <a-button class="btn-primary mt-4" @click="goToRandomSpell"
      >Solve Random Spell</a-button
    >
  </div>
</template>
