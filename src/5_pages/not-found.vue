<script setup lang="ts">
import { user } from '@/3_stores';
</script>

<template>
  <div class="max-w-min mt-[25vh] mx-auto text-center">
    <h1 class="mb-16 text-4xl logo">Wordomancy</h1>
    <p class="mb-8">Looks like you got lost!</p>
    <a-link-button @click="$router.push({ name: user.homeRoute })">
      Go back home
    </a-link-button>
    <p class="my-4">or</p>
    <a-link-button @click="$router.push({ name: 'spell' })">
      Solve daily Spell
    </a-link-button>
  </div>
</template>
