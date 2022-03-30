<script setup lang="ts">
const router = useRouter();
</script>

<template>
  <div class="column max-w-min mt-[40vh] text-center">
    <h1 class="mb-16 text-4xl logo">Wordomancy</h1>
    <p class="mb-6">Looks like you got lost!</p>
    <button
      class="btn btn-sm btn-primary"
      @click="router.push({ name: 'index' })">
      Go back home
    </button>
    <p class="my-4">or</p>
    <button
      class="btn btn-sm btn-primary"
      @click="router.push({ name: 'spell', params: { code: 'daily' } })">
      Solve daily Spell
    </button>
  </div>
</template>
