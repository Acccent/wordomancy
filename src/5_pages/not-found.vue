<script setup lang="ts">
const router = useRouter();
</script>

<template>
  <div class="column max-w-min mt-[30vh] text-center">
    <h1 class="mb-16 text-4xl logo">Wordomancy</h1>
    <p class="mb-8">Looks like you got lost!</p>
    <a-link-button @click="router.push({ name: 'index' })">
      Go back home
    </a-link-button>
    <p class="my-4">or</p>
    <a-link-button @click="router.push({ name: 'spell' })">
      Solve daily Spell
    </a-link-button>
  </div>
</template>
